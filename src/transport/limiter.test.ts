import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createLimiter, readRateLimit } from "./limiter.ts";

const secondsFromNow = (seconds: number) => Date.now() / 1000 + seconds;

async function isSettled(promise: Promise<unknown>): Promise<boolean> {
	let settled = false;
	promise.then(
		() => (settled = true),
		() => (settled = true),
	);
	await vi.advanceTimersByTimeAsync(0);

	return settled;
}

beforeEach(() => {
	vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"], now: new Date("2026-10-24T12:00:00Z") });
});

afterEach(() => {
	vi.useRealTimers();
});

describe("readRateLimit", () => {
	test("When a response has all three X-RateLimit headers, then they're its rate limit", () => {
		const headers = new Headers({
			"X-RateLimit-Limit": "100",
			"X-RateLimit-Remaining": "42",
			"X-RateLimit-Reset": "1761307260",
		});

		expect(readRateLimit(headers)).toEqual({ limit: 100, remaining: 42, resetAt: 1761307260 });
	});

	test.each<{ headers: string; values: Record<string, string> }>([
		{ headers: "no limit", values: { "X-RateLimit-Remaining": "42", "X-RateLimit-Reset": "1761307260" } },
		{ headers: "no remaining", values: { "X-RateLimit-Limit": "100", "X-RateLimit-Reset": "1761307260" } },
		{ headers: "no reset", values: { "X-RateLimit-Limit": "100", "X-RateLimit-Remaining": "42" } },
		{
			headers: "an empty remaining",
			values: { "X-RateLimit-Limit": "100", "X-RateLimit-Remaining": "", "X-RateLimit-Reset": "1761307260" },
		},
		{
			headers: "a reset that isn't a number",
			values: { "X-RateLimit-Limit": "100", "X-RateLimit-Remaining": "42", "X-RateLimit-Reset": "soon" },
		},
		{
			headers: "a limit of 0",
			values: { "X-RateLimit-Limit": "0", "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": "1761307260" },
		},
	])("When a response has $headers, then it has no rate limit", ({ values }) => {
		expect(readRateLimit(new Headers(values))).toBeUndefined();
	});
});

describe("createLimiter", () => {
	test.each([0, -5, Number.NaN, Number.POSITIVE_INFINITY])(
		"When the limit is %d, then it throws a RangeError",
		(limit) => {
			expect(() => createLimiter({ limit })).toThrow(new RangeError("limit must be a positive number"));
		},
	);

	test("When the window's budget is used up, then the next call waits for the next window", async () => {
		const limiter = createLimiter({ limit: 2 });
		await limiter.consume();
		await limiter.consume();

		const third = limiter.consume();

		expect(await isSettled(third)).toBe(false);
		await vi.advanceTimersByTimeAsync(60_000);
		expect(await isSettled(third)).toBe(true);
	});

	test("When no limit is given, then it lets 100 calls a minute through, the limit on ClickUp's lowest plan", async () => {
		const limiter = createLimiter();
		await Promise.all(Array.from({ length: 100 }, () => limiter.consume()));

		expect(await isSettled(limiter.consume())).toBe(false);
	});

	test("When calls wait for the window, then they go in the order they came", async () => {
		const limiter = createLimiter({ limit: 1 });
		await limiter.consume();
		const order: string[] = [];

		const calls = ["first", "second", "third"].map((name) => limiter.consume().then(() => order.push(name)));
		await vi.advanceTimersByTimeAsync(180_000);
		await Promise.all(calls);

		expect(order).toEqual(["first", "second", "third"]);
	});

	describe("what responses report", () => {
		test("When a response reports the budget used up, then calls wait until its reset", async () => {
			const limiter = createLimiter();
			limiter.update({ limit: 100, remaining: 0, resetAt: secondsFromNow(10) });

			const call = limiter.consume();

			await vi.advanceTimersByTimeAsync(9_900);
			expect(await isSettled(call)).toBe(false);
			await vi.advanceTimersByTimeAsync(100);
			expect(await isSettled(call)).toBe(true);
		});

		test("When ClickUp's reset is more than a minute away, then a call waits at most a minute", async () => {
			const limiter = createLimiter();
			limiter.update({ limit: 100, remaining: 0, resetAt: secondsFromNow(600) });

			const call = limiter.consume();

			await vi.advanceTimersByTimeAsync(60_000);
			expect(await isSettled(call)).toBe(true);
		});

		test("When a report has more left than this client counted, then the lower count is kept, as requests may be in flight", async () => {
			const limiter = createLimiter({ limit: 3 });
			await limiter.consume();
			await limiter.consume();

			limiter.update({ limit: 3, remaining: 3, resetAt: secondsFromNow(30) });

			await limiter.consume();
			expect(await isSettled(limiter.consume())).toBe(false);
		});

		test("When a report is for a newer window than the last report, then its count is taken", async () => {
			const limiter = createLimiter({ limit: 10 });
			limiter.update({ limit: 10, remaining: 0, resetAt: secondsFromNow(10) });

			limiter.update({ limit: 10, remaining: 2, resetAt: secondsFromNow(70) });

			await limiter.consume();
			await limiter.consume();
			expect(await isSettled(limiter.consume())).toBe(false);
		});

		test("When a report is for a window that already ended, then it's ignored", async () => {
			const limiter = createLimiter();

			limiter.update({ limit: 100, remaining: 0, resetAt: secondsFromNow(-5) });

			expect(await isSettled(limiter.consume())).toBe(true);
		});
	});

	describe("aborting", () => {
		test("When the signal is already aborted, then the call rejects at once and doesn't take a slot", async () => {
			const limiter = createLimiter({ limit: 1 });
			const reason = new Error("The user closed the page");

			await expect(limiter.consume(AbortSignal.abort(reason))).rejects.toBe(reason);
			expect(await isSettled(limiter.consume())).toBe(true);
		});

		test("When a call waiting for room is aborted, then it rejects with the signal's reason", async () => {
			const limiter = createLimiter({ limit: 1 });
			await limiter.consume();
			const controller = new AbortController();
			const reason = new Error("The user closed the page");

			const call = limiter.consume(controller.signal);
			await vi.advanceTimersByTimeAsync(1_000);
			controller.abort(reason);

			await expect(call).rejects.toBe(reason);
		});

		test("When a call waiting behind another is aborted, then it rejects at once, not when its turn comes", async () => {
			const limiter = createLimiter({ limit: 1 });
			await limiter.consume();
			const controller = new AbortController();
			const reason = new Error("The user closed the page");
			const ahead = limiter.consume();

			const behind = limiter.consume(controller.signal);
			controller.abort(reason);

			await expect(behind).rejects.toBe(reason);
			expect(await isSettled(ahead)).toBe(false);
		});

		test("When an aborted call's turn comes, then it's skipped without taking a slot", async () => {
			const limiter = createLimiter({ limit: 2 });
			await limiter.consume();
			await limiter.consume();
			const controller = new AbortController();
			const ahead = limiter.consume();
			const behind = limiter.consume(controller.signal);
			const last = limiter.consume();
			controller.abort(new Error("The user closed the page"));
			await expect(behind).rejects.toThrow("The user closed the page");

			await vi.advanceTimersByTimeAsync(60_000);

			expect([await isSettled(ahead), await isSettled(last)]).toEqual([true, true]);
		});

		test("When calls share a signal, then it holds no listeners once they're done", async () => {
			const limiter = createLimiter();
			const signal = new AbortController().signal;
			const added = vi.spyOn(signal, "addEventListener");
			const removed = vi.spyOn(signal, "removeEventListener");

			await Promise.all([limiter.consume(signal), limiter.consume(signal), limiter.consume(signal)]);
			await vi.advanceTimersByTimeAsync(0);

			expect(added).toHaveBeenCalledTimes(3);
			expect(removed.mock.calls).toEqual(added.mock.calls.map(([type, listener]) => [type, listener]));
		});
	});
});
