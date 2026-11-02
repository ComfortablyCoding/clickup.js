import type { ClickUpOptions, Hooks, ClickUpRequestOptions } from "../client.ts";
import { ClickUpError } from "../error.ts";
import { withTimeout } from "../utils.ts";
import { parseResponse, toRequestInit, type ClickUpResponseBody } from "./request.ts";
import { createLimiter, readRateLimit } from "./limiter.ts";
import { markNoResponse, withRetry } from "./retry.ts";

/** One request for the transport to send. */
export interface ClickUpRequestInput {
	/** The HTTP method */
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	/** Relative to the base URL, with values filled in, like `/v2/task/abc` */
	path: string;
	/** Query params. A list of values repeats as `name[]`, and an object or a list of objects is sent as JSON */
	query?: Record<string, unknown>;
	/** The body. A `FormData` is sent as multipart, anything else as JSON */
	data?: Record<string, unknown> | unknown[] | FormData | undefined;
}

/** The client's options, with their defaults applied. */
export interface TransportConfig {
	/** Optional, since some calls don't need one */
	token?: ClickUpOptions["token"];
	/** Where calls are sent, with or without a trailing slash */
	baseUrl: string;
	/** Milliseconds per attempt, unless a call sets its own */
	timeout: number;
	/** Retries per call, unless a call sets its own */
	maxRetries: number;
	/** Sent with every request, merged with a call's own */
	headers: Record<string, string>;
	/** Called on every attempt, retries included */
	hooks: Hooks;
}

/** Sends requests to ClickUp with the client's config. */
export interface Transport {
	/** Waits out the rate limit, retries what can be retried, and runs the hooks. */
	request: (input: ClickUpRequestInput, options?: ClickUpRequestOptions) => Promise<ClickUpResponseBody>;
}

/** Creates the transport every call goes through. */
export function createTransport(config: TransportConfig): Transport {
	const limiter = createLimiter();

	/** Makes one attempt: waits for the rate limit, runs the hooks and records the reported limit. */
	async function attempt(url: URL, init: RequestInit, options: ClickUpRequestOptions): Promise<ClickUpResponseBody> {
		await limiter.consume(options.signal);

		// A new Request for each attempt, since a body can only be sent once, and each gets its own timeout
		const timeout = options.timeout ?? config.timeout;
		const created = new Request(url, {
			...init,
			signal: withTimeout(timeout, options.signal),
		});
		const sent = (await config.hooks.onRequest?.(created)) ?? created;

		const response = await fetch(sent).catch(markNoResponse);

		// Read from ClickUp's own response, before a hook can replace it
		const rateLimit = readRateLimit(response.headers);
		if (rateLimit) {
			limiter.update(rateLimit);
		}

		// The hook gets a clone, so it can read the body and still leave the original for the call
		const received = (await config.hooks.onResponse?.(response.clone(), sent)) ?? response;
		const data = await parseResponse(received).catch(markNoResponse);

		if (!received.ok) {
			throw ClickUpError.fromResponse(received, sent, { body: data });
		}

		return data;
	}

	/** Sends a request, retrying what can be retried. */
	async function request(
		input: ClickUpRequestInput,
		options: ClickUpRequestOptions = {},
	): Promise<ClickUpResponseBody> {
		const { url, init } = await toRequestInit(input, config, options.headers);

		return withRetry(() => attempt(url, init, options), {
			method: input.method,
			maxRetries: options.maxRetries ?? config.maxRetries,
			signal: options.signal,
		});
	}

	return { request };
}
