import { afterEach, describe, expect, test, vi } from "vitest";
import { isObject, readFromEnv, sleep, withDefaults, withTimeout } from "./utils.ts";

afterEach(() => {
	vi.useRealTimers();
});

describe("isObject", () => {
	test.each([
		{ value: { id: "86a1b2c3d" }, kind: "an object", expected: true },
		{ value: new TypeError("fetch failed"), kind: "an error", expected: true },
		{ value: ["86a1b2c3d"], kind: "a list", expected: false },
		{ value: null, kind: "null", expected: false },
		{ value: undefined, kind: "undefined", expected: false },
		{ value: "86a1b2c3d", kind: "a string", expected: false },
	])("When the value is $kind, then it's $expected", ({ value, expected }) => {
		expect(isObject(value)).toBe(expected);
	});
});

describe("withDefaults", () => {
	const defaults = { timeout: 30_000, maxRetries: 2 };

	test.each([
		{ scenario: "no values", values: undefined, expected: defaults },
		{ scenario: "a value", values: { maxRetries: 0 }, expected: { timeout: 30_000, maxRetries: 0 } },
		{ scenario: "an undefined value", values: { timeout: undefined }, expected: defaults },
	])("When given $scenario, then each value that's set replaces its default", ({ values, expected }) => {
		expect(withDefaults(defaults, values)).toEqual(expected);
	});
});

describe("withTimeout", () => {
	test("When the time is up, then it aborts with a TimeoutError", async () => {
		const signal = withTimeout(10);

		await vi.waitFor(() => expect(signal.aborted).toBe(true));

		expect(signal.reason).toMatchObject({ name: "TimeoutError" });
	});

	test("When the other signal aborts first, then it aborts with that signal's reason", () => {
		const controller = new AbortController();
		const reason = new Error("The user closed the page");
		const signal = withTimeout(60_000, controller.signal);

		controller.abort(reason);

		expect(signal.reason).toBe(reason);
	});
});

describe("sleep", () => {
	test("When the time passes, then it resolves", async () => {
		vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
		const done = vi.fn<() => void>();

		void sleep(1_000).then(done);
		await vi.advanceTimersByTimeAsync(999);
		const doneEarly = done.mock.calls.length > 0;
		await vi.advanceTimersByTimeAsync(1);

		expect(doneEarly).toBe(false);
		expect(done).toHaveBeenCalledOnce();
	});

	test("When the signal aborts during the wait, then it rejects with the signal's reason", async () => {
		const controller = new AbortController();
		const reason = new Error("The user closed the page");

		const waiting = sleep(60_000, controller.signal);
		controller.abort(reason);

		await expect(waiting).rejects.toBe(reason);
	});

	test("When the signal is already aborted, then it rejects at once", async () => {
		const reason = new Error("The user closed the page");

		await expect(sleep(60_000, AbortSignal.abort(reason))).rejects.toBe(reason);
	});

	test("When the wait ends, then it stops listening to the signal", async () => {
		vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
		const signal = new AbortController().signal;
		const added = vi.spyOn(signal, "addEventListener");
		const removed = vi.spyOn(signal, "removeEventListener");

		const waiting = sleep(1_000, signal);
		await vi.advanceTimersByTimeAsync(1_000);
		await waiting;

		expect(removed).toHaveBeenCalledWith("abort", added.mock.calls[0][1]);
	});
});

describe("readFromEnv", () => {
	test("When the variable is set, then it returns its value", () => {
		vi.stubEnv("CLICKUP_TOKEN", "pk_81234567_5RZ0QF9M2KJXW8YB1LTD4HNC7VAPGE3S");

		expect(readFromEnv("CLICKUP_TOKEN")).toBe("pk_81234567_5RZ0QF9M2KJXW8YB1LTD4HNC7VAPGE3S");
	});

	test("When the variable is unset, then it returns undefined", () => {
		expect(readFromEnv("CLICKUP_UNSET_FOR_TEST")).toBeUndefined();
	});
});
