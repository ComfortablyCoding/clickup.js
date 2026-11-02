import { sleep } from "../utils.ts";

/** Options for {@link createLimiter}. */
export interface LimiterOptions {
	/** Requests per minute, until a response reports the real limit. @default 100, the limit on ClickUp's lowest plan */
	limit?: number;
}

/** A rate limit, as a response's `X-RateLimit-*` headers report it. */
export interface RateLimit {
	/** Requests allowed per window (`X-RateLimit-Limit`) */
	limit: number;
	/** Requests left in this window (`X-RateLimit-Remaining`) */
	remaining: number;
	/** When the window resets, in epoch seconds (`X-RateLimit-Reset`) */
	resetAt: number;
}

/** Reads a response's `X-RateLimit-*` headers, or returns `undefined` if any is missing or invalid. */
export function readRateLimit(headers: Headers): RateLimit | undefined {
	// `|| NaN`, as Number(null) and Number("") are both 0
	const [limit, remaining, resetAt] = ["limit", "remaining", "reset"].map((name) =>
		Number(headers.get(`x-ratelimit-${name}`) || NaN),
	);

	if (![limit, remaining, resetAt].every(Number.isFinite) || limit <= 0) {
		return undefined;
	}

	return { limit, remaining, resetAt };
}

/** A window's length: ClickUp's limits are per minute. */
const WINDOW = 60_000;

/**
 * Holds requests back once the window's budget is spent. Requests are counted as they're sent, so
 * concurrent calls can't overshoot.
 */
export function createLimiter({ limit = 100 }: LimiterOptions = {}): {
	/** Resolves once a request may be sent, or rejects with the signal's reason without counting it */
	consume: (signal?: AbortSignal) => Promise<void>;
	/** Records the rate limit a response reported */
	update: (rateLimit: RateLimit) => void;
} {
	if (!Number.isFinite(limit) || limit <= 0) {
		throw new RangeError("limit must be a positive number");
	}

	/** Requests allowed per window, as last reported */
	let perWindow = limit;
	/** Requests left in the window, counted as they're sent */
	let remaining = limit;
	/** When the window resets, in epoch milliseconds */
	let resetAt = 0;
	/** Whether the current window's count came from a response, rather than being assumed */
	let reported = false;
	/** The calls waiting their turn, in order */
	let queue = Promise.resolve();

	/** Waits for its turn and for room in the window, then counts the request. */
	function consume(signal?: AbortSignal): Promise<void> {
		if (signal?.aborted) {
			return Promise.reject(signal.reason);
		}

		const turn = queue.then(async () => {
			// Aborted while waiting in line: it's never sent, so it doesn't use up a slot
			signal?.throwIfAborted();

			if (remaining <= 0 && resetAt > Date.now()) {
				// Capped, in case this clock and ClickUp's disagree
				await sleep(Math.min(resetAt - Date.now(), WINDOW), signal);
			}

			if (Date.now() >= resetAt) {
				// A new window, assumed full until a response reports it
				remaining = perWindow;
				resetAt = Date.now() + WINDOW;
				reported = false;
			}

			remaining -= 1;
		});

		queue = turn.catch(() => {});

		if (!signal) {
			return turn;
		}

		// Reject as soon as the signal aborts, without waiting for the calls ahead
		const { promise, resolve, reject } = Promise.withResolvers<void>();
		const onAbort = () => reject(signal.reason);

		signal.addEventListener("abort", onAbort, { once: true });
		// So a signal shared by many calls doesn't collect a listener per call
		turn.then(resolve, reject).finally(() => signal.removeEventListener("abort", onAbort));

		return promise;
	}

	/** Records the rate limit a response reported. */
	function update(rateLimit: RateLimit): void {
		const reset = rateLimit.resetAt * 1000;

		// The response came after its window ended
		if (reset <= Date.now()) {
			return;
		}

		perWindow = rateLimit.limit;
		// A newer window brings its own count. Otherwise keep the lower one, as ClickUp may not have
		// counted requests that are still in flight.
		remaining = reported && reset > resetAt ? rateLimit.remaining : Math.min(remaining, rateLimit.remaining);
		resetAt = reset;
		reported = true;
	}

	return { consume, update };
}
