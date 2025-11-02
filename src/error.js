export class ClickupAPIError extends Error {
	constructor(status, message) {
		super(message);
		this.name = "ClickupAPIError";
		this.code = status;

		// Set the prototype explicitly for instanceof checks
		Object.setPrototypeOf(this, ClickupAPIError.prototype);
	}
}
