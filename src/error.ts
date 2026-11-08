import { isObject } from "./utils.ts";

/** What a {@link ClickUpError} is made from. */
export interface ClickUpErrorOptions {
	/** What went wrong */
	message: string;
	/** The request's HTTP method */
	method: string;
	/** The request's URL */
	url: string;
	/** The response's HTTP status */
	status: number;
	/** ClickUp's error code (`ECODE`), when it sent one */
	code?: string;
}

/**
 * Thrown for an error response from ClickUp. Anything else, like a `TypeError` from fetch, is thrown as is.
 *
 * @example
 * ```ts
 * try {
 * 	await clickup.task.get({ task_id: "86a1b2c3d" });
 * } catch (error) {
 * 	if (error instanceof ClickUpError && error.status === 404) console.log(error.message, error.code);
 * }
 * ```
 */
export class ClickUpError extends Error {
	/** The request's HTTP method */
	readonly method: string;
	/** The request's URL */
	readonly url: string;
	/** The response's HTTP status */
	readonly status: number;
	/** ClickUp's error code (`ECODE`), when it sent one */
	readonly code?: string;

	/** @param options What the error is made from */
	constructor(options: ClickUpErrorOptions) {
		super(options.message);

		this.name = "ClickUpError";
		this.method = options.method;
		this.url = options.url;
		this.status = options.status;
		this.code = options.code;
	}

	/**
	 * Makes the error for an error response. ClickUp's error bodies, as seen live:
	 *
	 * - v2: `{ err, ECODE }`
	 * - v3 (as documented): `{ status, message, trace_id, timestamp }`
	 * - v3 auth and docs: `{ err, ECODE, status, message?, timestamp? }`
	 * - v3 validation: `{ err, status, message: string[], error, statusCode, timestamp }`
	 *
	 * @param response The response, with a 4xx or 5xx status
	 * @param request The request it answers
	 * @param options What else is known about the response
	 * @param options.body The response body, already read, since a body can only be read once
	 * @returns The error. Its message is v3's `message` (joined if it's a list), v2's `err` or the status line, and its code is `ECODE`.
	 */
	static fromResponse(response: Response, request: Request, options: { body?: unknown } = {}): ClickUpError {
		const { err, message, ECODE } = isObject(options.body) ? options.body : {};
		const text = [message].flat().join("; ");

		return new ClickUpError({
			message: text || (typeof err === "string" ? err : "") || `${response.status} ${response.statusText}`.trim(),
			method: request.method,
			url: request.url,
			status: response.status,
			code: typeof ECODE === "string" ? ECODE : undefined,
		});
	}
}
