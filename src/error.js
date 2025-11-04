export class ClickupAPIError extends Error {
	constructor(options = {}) {
		super(options.message);
		this.name = "ClickupAPIError";
		this.satus = options.status;
		this.code = options.code ?? null;

		// Set the prototype explicitly for instanceof checks
		Object.setPrototypeOf(this, ClickupAPIError.prototype);
	}
}
