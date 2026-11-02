import { ClickUpError } from "../error.ts";
import { isObject, sleep } from "../utils.ts";

/** The longest backoff, in milliseconds. */
const MAX_BACKOFF = 8_000;

/** Methods safe to resend after a failure ClickUp may have processed (RFC 9110). */
const IDEMPOTENT = new Set(["GET", "PUT", "DELETE"]);

/** 5xx statuses that sending again won't fix: Not Implemented and HTTP Version Not Supported. */
const PERMANENT = new Set([501, 505]);

/** Errors fetch threw because no response came back, as marked by {@link markNoResponse}. */
const noResponse = new WeakSet<object>();

/** Marks an error from fetch or from reading the body, then rethrows it, so {@link withRetry} can tell it from a hook's. */
export function markNoResponse(error: unknown): never {
	if (isObject(error)) {
		noResponse.add(error);
	}

	throw error;
}

/** Options for {@link withRetry}. */
export interface RetryOptions {
	/** The call's HTTP method, which decides what's retryable */
	method: string;
	/** How many retries may follow the first attempt; 0 means only one attempt */
	maxRetries: number;
	/** Cuts a wait before a retry short, rejecting with its reason */
	signal?: AbortSignal;
}

/**
 * Makes the attempt, retrying failures that can be retried after a backoff. A 429 doesn't wait here:
 * the limiter holds the next attempt until the window resets.
 */
export async function withRetry<T>(
	attempt: () => Promise<T>,
	{ method, maxRetries, signal }: RetryOptions,
): Promise<T> {
	for (let n = 0; ; n++) {
		try {
			return await attempt();
		} catch (error) {
			if (n >= maxRetries || !isRetryable(method, error)) {
				throw error;
			}

			// Rejects at once on abort, so an abort is never retried
			await sleep(backoff(n), signal);
		}
	}
}

/** About 500 ms, 1 s, 2 s, … up to 8 s, with jitter so concurrent callers don't retry in step. */
export function backoff(attempt: number): number {
	const jitter = 0.75 + Math.random() * 0.25;

	return Math.min(500 * 2 ** attempt, MAX_BACKOFF) * jitter;
}

/** A 429 on any method, as ClickUp didn't process it; a 408, 5xx or no response only on idempotent ones. */
function isRetryable(method: string, error: unknown): boolean {
	if (error instanceof ClickUpError) {
		if (error.status === 429) {
			return true;
		}

		return IDEMPOTENT.has(method) && (error.status === 408 || (error.status >= 500 && !PERMANENT.has(error.status)));
	}

	// No response: fetch's TypeError or the attempt's TimeoutError, unless a hook threw it
	const lost = error instanceof TypeError || (error instanceof DOMException && error.name === "TimeoutError");

	return IDEMPOTENT.has(method) && lost && noResponse.has(error);
}
