import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ClickUpError } from "../error.ts";
import { backoff, markNoResponse, withRetry } from "./retry.ts";

const responded = (status: number) =>
	new ClickUpError({
		message: String(status),
		method: "GET",
		url: "https://api.clickup.com/api/v2/task/86a1b2c3d",
		status,
	});

function fromFetch(error: Error): Error {
	try {
		markNoResponse(error);
	} catch (marked) {
		return marked as Error;
	}
}

const lost = () => fromFetch(new TypeError("fetch failed"));
const timedOut = () => fromFetch(new DOMException("The operation timed out.", "TimeoutError"));

async function attemptTimes(method: string, errors: unknown[], maxRetries = 2): Promise<number[]> {
	const start = Date.now();
	const times: number[] = [];

	const done = withRetry(
		async () => {
			times.push(Date.now() - start);
			if (times.length <= errors.length) throw errors[times.length - 1];
		},
		{ method, maxRetries },
	).catch(() => {});
	await vi.runAllTimersAsync();
	await done;

	return times;
}

beforeEach(() => {
	vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"], now: new Date("2026-10-24T12:00:00Z") });
});

afterEach(() => {
	vi.useRealTimers();
});

describe("backoff", () => {
	test.each([
		{ attempt: 0, longest: 500 },
		{ attempt: 1, longest: 1_000 },
		{ attempt: 2, longest: 2_000 },
		{ attempt: 3, longest: 4_000 },
		{ attempt: 4, longest: 8_000 },
		{ attempt: 9, longest: 8_000 },
	])(
		"When attempt $attempt failed, then the wait is $longest ms, jittered down by up to a quarter",
		({ attempt, longest }) => {
			vi.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValueOnce(1);

			const waits = [backoff(attempt), backoff(attempt)];

			expect(waits).toEqual([longest * 0.75, longest]);
		},
	);
});

describe("withRetry", () => {
	const failures = [
		{ failure: "no response", error: lost },
		{ failure: "a timeout", error: timedOut },
		...[408, 500, 502, 503, 504].map((status) => ({ failure: `a ${status}`, error: () => responded(status) })),
	];

	test.each(["GET", "PUT", "DELETE"].flatMap((method) => failures.map((failure) => ({ method, ...failure }))))(
		"When a $method attempt fails with $failure, then it's made again after a backoff",
		async ({ method, error }) => {
			vi.spyOn(Math, "random").mockReturnValue(0);

			expect(await attemptTimes(method, [error()])).toEqual([0, 375]);
		},
	);

	test.each(["POST", "PATCH"].flatMap((method) => failures.map((failure) => ({ method, ...failure }))))(
		"When a $method attempt fails with $failure, then it isn't made again, as it might be done twice",
		async ({ method, error }) => {
			expect(await attemptTimes(method, [error()])).toEqual([0]);
		},
	);

	test.each(["GET", "POST", "PATCH"])(
		"When a %s attempt gets a 429, then it's made again after a backoff, as ClickUp didn't process it",
		async (method) => {
			vi.spyOn(Math, "random").mockReturnValue(0);

			expect(await attemptTimes(method, [responded(429)])).toEqual([0, 375]);
		},
	);

	test.each([400, 401, 403, 404, 422, 501, 505])(
		"When an attempt gets a %i, then it isn't made again",
		async (status) => {
			expect(await attemptTimes("GET", [responded(status)])).toEqual([0]);
		},
	);

	test.each([
		{ kind: "an error", error: new Error("onRequest failed") },
		{ kind: "a TypeError, as a bug would", error: new TypeError("Cannot read properties of undefined") },
	])("When an attempt throws $kind that fetch didn't, like a hook's, then it isn't made again", async ({ error }) => {
		expect(await attemptTimes("GET", [error])).toEqual([0]);
	});

	test("When attempts keep failing, then each wait backs off further", async () => {
		vi.spyOn(Math, "random").mockReturnValue(0);

		expect(await attemptTimes("GET", [lost(), lost()])).toEqual([0, 375, 1_125]);
	});

	test.each([
		{ maxRetries: 0, attempts: 1 },
		{ maxRetries: 2, attempts: 3 },
	])(
		"When every attempt fails, then $attempts are made with maxRetries $maxRetries, and the last error is thrown",
		async ({ maxRetries, attempts }) => {
			const errors = [503, 502, 500, 504].map(responded);
			const attempt = vi.fn<() => Promise<never>>(async () => {
				throw errors[attempt.mock.calls.length - 1];
			});

			const done = withRetry(attempt, { method: "GET", maxRetries });
			done.catch(() => {});
			await vi.runAllTimersAsync();

			await expect(done).rejects.toBe(errors[attempts - 1]);
			expect(attempt).toHaveBeenCalledTimes(attempts);
		},
	);

	test("When the signal aborts during a wait, then it rejects with the signal's reason and makes no more attempts", async () => {
		const controller = new AbortController();
		const reason = new Error("The user closed the page");
		const attempt = vi.fn<() => Promise<never>>(async () => {
			throw responded(503);
		});

		const done = withRetry(attempt, { method: "GET", maxRetries: 2, signal: controller.signal });
		await vi.advanceTimersByTimeAsync(100);
		controller.abort(reason);

		await expect(done).rejects.toBe(reason);
		expect(attempt).toHaveBeenCalledTimes(1);
	});

	test("When an attempt succeeds, then it resolves to what the attempt returned", async () => {
		const result = await withRetry(async () => ({ id: "86a1b2c3d" }), { method: "GET", maxRetries: 2 });

		expect(result).toEqual({ id: "86a1b2c3d" });
	});
});
