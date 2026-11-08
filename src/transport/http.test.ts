import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ClickUpError } from "../error.ts";
import { fakeFetch, type Reply } from "../../test/helpers/fake-fetch.ts";
import type { Hooks } from "../client.ts";
import { createTransport, type TransportConfig } from "./http.ts";

const TOKEN = "pk_81234567_5RZ0QF9M2KJXW8YB1LTD4HNC7VAPGE3S";
const getTask = { method: "GET", path: "/v2/task/86a1b2c3d" } as const;
const createTask = { method: "POST", path: "/v2/list/901234567/task", data: { name: "Ship v5" } } as const;

function setup(replies: Reply[], config: Partial<TransportConfig> = {}) {
	const { fetch, received } = fakeFetch(replies);
	vi.stubGlobal("fetch", fetch);

	const transport = createTransport({
		token: TOKEN,
		baseUrl: "https://api.clickup.com/api",
		timeout: 30_000,
		maxRetries: 2,
		headers: {},
		hooks: {},
		...config,
	});

	return { request: transport.request, received };
}

async function settle<T>(call: Promise<T>): Promise<T> {
	let done = false;
	call.then(
		() => (done = true),
		() => (done = true),
	);

	while (!done) {
		await vi.advanceTimersToNextTimerAsync();
	}

	return call;
}

function rateLimit(remaining: number, seconds: number): Record<string, string> {
	return {
		"x-ratelimit-limit": "100",
		"x-ratelimit-remaining": String(remaining),
		"x-ratelimit-reset": String(Date.now() / 1000 + seconds),
	};
}

beforeEach(() => {
	vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"], now: new Date("2026-10-24T12:00:00Z") });
});

afterEach(() => {
	vi.useRealTimers();
});

describe("the token", () => {
	test("When the token is a function, then it's called for every call, so it can return a refreshed token", async () => {
		const tokens = ["81234567_first", "81234567_refreshed"];
		const { request, received } = setup([{ body: {} }, { body: {} }], { token: () => tokens.shift() ?? "" });

		await request(getTask);
		await request(getTask);

		expect(received.map(({ request: sent }) => sent.headers.get("authorization"))).toEqual([
			"Bearer 81234567_first",
			"Bearer 81234567_refreshed",
		]);
	});
});

describe("retries", () => {
	test("When a POST gets a 429, then it's retried once the rate limit resets", async () => {
		const { request, received } = setup([{ status: 429, headers: rateLimit(0, 20) }, { body: { id: "86a1b2c3d" } }]);

		const call = request(createTask);
		await vi.advanceTimersByTimeAsync(19_900);
		const sentBeforeReset = received.length;
		const result = await settle(call);

		expect(sentBeforeReset).toBe(1);
		expect(result).toEqual({ id: "86a1b2c3d" });
	});

	test.each([
		{ scenario: "the client's maxRetries", maxRetries: undefined, attempts: 3 },
		{ scenario: "the call's maxRetries", maxRetries: 4, attempts: 5 },
		{ scenario: "a maxRetries of 0", maxRetries: 0, attempts: 1 },
	])(
		"When every attempt fails, then $scenario sets how many are made, and the last error is thrown",
		async ({ maxRetries, attempts }) => {
			const replies = Array.from({ length: 6 }, (_, i) => ({
				status: 503,
				body: { err: `Service unavailable (${i + 1})` },
			}));
			const { request, received } = setup(replies);

			const call = request(getTask, { maxRetries });

			await expect(settle(call)).rejects.toMatchObject({ message: `Service unavailable (${attempts})` });
			expect(received).toHaveLength(attempts);
		},
	);

	test.each([
		{ scenario: "fetch gets no response", hook: () => {}, attempts: 3 },
		{
			scenario: "onRequest throws a TypeError, as a bug in it would",
			hook: () => {
				throw new TypeError("Cannot read properties of undefined");
			},
			attempts: 1,
		},
	])("When a GET fails because $scenario, then $attempts attempts are made", async ({ hook, attempts }) => {
		const onRequest = vi.fn<NonNullable<Hooks["onRequest"]>>(hook);
		const { request } = setup([], { hooks: { onRequest } });
		vi.stubGlobal(
			"fetch",
			vi.fn<typeof fetch>(async () => {
				throw new TypeError("fetch failed");
			}),
		);

		await expect(settle(request(getTask))).rejects.toBeInstanceOf(TypeError);
		expect(onRequest).toHaveBeenCalledTimes(attempts);
	});
});

describe("timeouts and aborts", () => {
	test("When an attempt gets no answer in time, then the call rejects with fetch's TimeoutError", async () => {
		const { request } = setup(["hang"], { timeout: 20, maxRetries: 0 });

		const call = request(getTask);

		await expect(call).rejects.toMatchObject({ name: "TimeoutError" });
		await expect(call).rejects.not.toBeInstanceOf(ClickUpError);
	});

	test("When the call's timeout is shorter, then it wins over the client's", async () => {
		const { request } = setup(["hang"], { timeout: 60_000, maxRetries: 0 });

		const call = request(getTask, { timeout: 20 });

		await expect(call).rejects.toMatchObject({ name: "TimeoutError" });
	});

	test("When the caller aborts mid-request, then the call rejects with the signal's reason, without a retry", async () => {
		const { request, received } = setup(["hang", { body: {} }]);
		const controller = new AbortController();
		const reason = new Error("The user closed the page");

		const call = request(getTask, { signal: controller.signal });
		await vi.advanceTimersByTimeAsync(0);
		controller.abort(reason);

		await expect(settle(call)).rejects.toBe(reason);
		expect(received).toHaveLength(1);
	});
});

describe("hooks", () => {
	test("When onRequest returns a request, then that's what is sent", async () => {
		const { request, received } = setup([{ body: {} }], {
			hooks: {
				onRequest: (created) => {
					const traced = new Request(created);
					traced.headers.set("X-Trace-Id", "4bf92f3577b34da6");
					return traced;
				},
			},
		});

		await request(getTask);

		expect(received[0].request.headers.get("x-trace-id")).toBe("4bf92f3577b34da6");
	});

	test("When onResponse reads the body, then the call still resolves to it", async () => {
		const seen: unknown[] = [];
		const { request } = setup([{ body: { id: "86a1b2c3d" } }], {
			hooks: {
				onResponse: async (response, sent) => {
					seen.push(sent.url, await response.json());
				},
			},
		});

		const result = await request(getTask);

		expect(result).toEqual({ id: "86a1b2c3d" });
		expect(seen).toEqual(["https://api.clickup.com/api/v2/task/86a1b2c3d", { id: "86a1b2c3d" }]);
	});

	test.each([
		{ scenario: "a success", reply: { body: { id: "86a1b2c3d" } } },
		{ scenario: "an error", reply: { status: 404, body: { err: "Task not found", ECODE: "ITEM_015" } } },
	])(
		"When ClickUp sends $scenario and onResponse returns a response, then the call reads that instead",
		async ({ reply }) => {
			const { request } = setup([reply], {
				hooks: {
					onResponse: () => Response.json({ id: "86a1b2c3d", cached: true }),
				},
			});

			const result = await request(getTask);

			expect(result).toEqual({ id: "86a1b2c3d", cached: true });
		},
	);

	test("When onResponse replaces a response, then the rate limit is still read from ClickUp's", async () => {
		const { request, received } = setup([{ body: {}, headers: rateLimit(0, 30) }, { body: {} }], {
			hooks: { onResponse: () => Response.json({}) },
		});

		await request(getTask);
		const second = request(getTask);
		await vi.advanceTimersByTimeAsync(29_000);

		expect(received).toHaveLength(1);

		await settle(second);

		expect(received).toHaveLength(2);
	});

	test("When a call is retried, then the hooks run for every attempt", async () => {
		const onRequest = vi.fn<NonNullable<Hooks["onRequest"]>>();
		const onResponse = vi.fn<NonNullable<Hooks["onResponse"]>>();
		const { request } = setup([{ status: 502 }, { body: {} }], { hooks: { onRequest, onResponse } });

		await settle(request(getTask));

		expect(onRequest).toHaveBeenCalledTimes(2);
		expect(onResponse.mock.calls.map(([response]) => response.status)).toEqual([502, 200]);
	});
});
