import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { routes } from "./generated/routes.gen.ts";
import { createClickUp, type ClickUp, type ClickUpOptions, type WithWorkspace } from "./index.ts";
import { fakeFetch, type Reply } from "../test/helpers/fake-fetch.ts";

const TOKEN = "pk_81234567_5RZ0QF9M2KJXW8YB1LTD4HNC7VAPGE3S";
const TASK_ID = "86a1b2c3d";
const WORKSPACE_ID = 9012345;

type Setup<C> = { clickup: C; received: ReturnType<typeof fakeFetch>["received"] };

function setup(
	replies: Reply[],
	options: ClickUpOptions & { workspace: { id: number } },
): Setup<WithWorkspace<ClickUp>>;
function setup(replies: Reply[], options?: ClickUpOptions): Setup<ClickUp>;
function setup(
	replies: Reply[],
	options: ClickUpOptions = { token: TOKEN },
): Setup<WithWorkspace<ClickUp>> | Setup<ClickUp> {
	const { fetch, received } = fakeFetch(replies);
	vi.stubGlobal("fetch", fetch);

	return { clickup: createClickUp(options), received };
}

beforeEach(() => {
	vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"], now: new Date("2026-10-24T12:00:00Z") });
});

afterEach(() => {
	vi.useRealTimers();
});

describe("methods", () => {
	test("When the client is created, then every route is a method on its namespace", () => {
		const { clickup } = setup([]);
		const groups = clickup as unknown as Record<string, Record<string, unknown>>;

		const missing = Object.keys(routes).filter((name) => {
			const [group, method] = name.split(".");
			return typeof groups[group]?.[method] !== "function";
		});

		expect(missing).toEqual([]);
	});

	test("When request() is called, then it sends any path, for endpoints the spec doesn't describe yet", async () => {
		const { clickup, received } = setup([{ body: { ok: true } }]);

		const result = await clickup.request({ method: "GET", path: "/v2/task/86a1b2c3d/time_in_status" });

		expect(result).toEqual({ ok: true });
		expect(received[0].url.href).toBe("https://api.clickup.com/api/v2/task/86a1b2c3d/time_in_status");
	});
});

describe("the workspace", () => {
	test("When customTaskIds is on, then routes that take custom task IDs are sent custom_task_ids and the workspace", async () => {
		const { clickup, received } = setup([{ body: {} }], {
			token: TOKEN,
			workspace: { id: WORKSPACE_ID, customTaskIds: true },
		});

		await clickup.task.get({ task_id: "DEV-42" });

		expect(Object.fromEntries(received[0].url.searchParams)).toEqual({
			custom_task_ids: "true",
			team_id: String(WORKSPACE_ID),
		});
	});
});

describe("the token", () => {
	test.each([
		{ scenario: "no token is given", token: undefined, env: TOKEN, authorization: TOKEN },
		{ scenario: "a token is given", token: "pk_99999999_given", env: TOKEN, authorization: "pk_99999999_given" },
		{ scenario: "there's no token at all", token: undefined, env: "", authorization: null },
	])(
		"When $scenario and CLICKUP_TOKEN is '$env', then Authorization is $authorization",
		async ({ token, env, authorization }) => {
			vi.stubEnv("CLICKUP_TOKEN", env);
			const { clickup, received } = setup([{ body: {} }], { token });

			await clickup.authorization.getUser();

			expect(received[0].request.headers.get("authorization")).toBe(authorization);
		},
	);
});

describe("request options", () => {
	test("When created without request options, then calls go to ClickUp's API, and a failed GET is retried twice", async () => {
		const replies: Reply[] = Array.from({ length: 4 }, () => ({ status: 503 }));
		const { clickup, received } = setup(replies);

		const call = clickup.task.get({ task_id: TASK_ID });
		call.catch(() => {});
		await vi.runAllTimersAsync();

		await expect(call).rejects.toMatchObject({ status: 503 });
		expect(received.map(({ url }) => url.origin + url.pathname)).toEqual(
			Array.from({ length: 3 }, () => `https://api.clickup.com/api/v2/task/${TASK_ID}`),
		);
	});

	test("When created with a base URL and headers, then every call uses them, with a call's own headers added", async () => {
		const { clickup, received } = setup([{ body: {} }], {
			token: TOKEN,
			request: { baseUrl: "https://clickup-proxy.example.com/api", headers: { "X-Client": "release-bot" } },
		});

		await clickup.authorization.getUser(undefined, { headers: { "X-Trace-Id": "4bf92f3577b34da6" } });

		expect(received[0].url.href).toBe("https://clickup-proxy.example.com/api/v2/user");
		expect(received[0].request.headers.get("x-client")).toBe("release-bot");
		expect(received[0].request.headers.get("x-trace-id")).toBe("4bf92f3577b34da6");
	});

	test("When created with hooks, then they see every call", async () => {
		const onRequest = vi.fn<(request: Request) => void>();
		const { clickup } = setup([{ body: {} }], { token: TOKEN, hooks: { onRequest } });

		await clickup.authorization.getUser();

		expect(onRequest.mock.calls.map(([request]) => request.url)).toEqual(["https://api.clickup.com/api/v2/user"]);
	});
});
