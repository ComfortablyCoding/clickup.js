/** Thrown by {@link parseWebhook} for an invalid webhook request; answer it with a 401. */
export class InvalidWebhookError extends Error {
	/** @param message Why the request isn't valid */
	constructor(message: string) {
		super(message);

		this.name = "InvalidWebhookError";
	}
}
