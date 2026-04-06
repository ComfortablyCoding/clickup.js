import type { ClickupAPIErrorOptions } from "./types.ts";

export class ClickupAPIError extends Error {
	status?: number;
	code: string | null;

	constructor(options: ClickupAPIErrorOptions = {}) {
		super(options.message);
		this.name = "ClickupAPIError";
		this.status = options.status;
		this.code = options.code ?? null;

		// Set the prototype explicitly for instanceof checks
		Object.setPrototypeOf(this, ClickupAPIError.prototype);
	}
}
