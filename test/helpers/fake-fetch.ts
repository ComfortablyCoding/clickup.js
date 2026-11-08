import { vi, type Mock } from "vitest";

/** One canned answer for {@link fakeFetch}: a response, its `body` sent as JSON, or `"hang"` for no answer at all. */
export type Reply =
	| {
			/** @default 200 */
			status?: number;
			/** Sent as JSON */
			body?: unknown;
			/** Sent alongside `content-type: application/json` */
			headers?: Record<string, string>;
	  }
	| "hang";

/** A request {@link fakeFetch} received. */
export interface ReceivedRequest {
	/** As fetch received it */
	request: Request;
	/** Its URL, parsed */
	url: URL;
}

/**
 * A `fetch` that answers from `replies`, with a 500 once they run out. It records each request and,
 * like `fetch`, rejects when the request's signal aborts.
 */
export function fakeFetch(replies: Reply[]): {
	/** The fake, to stub the global `fetch` with */
	fetch: Mock<typeof globalThis.fetch>;
	/** Every request it received, in order */
	received: ReceivedRequest[];
} {
	const received: ReceivedRequest[] = [];

	const fetch = vi.fn<typeof globalThis.fetch>(async (input) => {
		const request = input as Request;
		request.signal.throwIfAborted();
		received.push({ request, url: new URL(request.url) });

		const reply = replies.shift() ?? { status: 500 };

		if (reply === "hang") {
			return new Promise<Response>((_, reject) => {
				request.signal.addEventListener("abort", () => reject(request.signal.reason), { once: true });
			});
		}

		return new Response(reply.body === undefined ? null : JSON.stringify(reply.body), {
			status: reply.status ?? 200,
			headers: { "content-type": "application/json", ...reply.headers },
		});
	});

	return { fetch, received };
}
