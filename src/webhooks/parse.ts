import { isObject } from "../utils.ts";
import { InvalidWebhookError } from "./error.ts";
import type { WebhookEvent } from "./types.ts";
import { verifyWebhook } from "./verify.ts";

/** A webhook request's raw parts, for servers that don't hand over a `Request`. */
export interface RawWebhookRequest {
	/** The body exactly as ClickUp sent it, since re-serialized JSON may not match the signature */
	body: string | Uint8Array;
	/** The `X-Signature` header */
	signature: string | null | undefined;
}

/** Options for {@link parseWebhook}. */
export interface ParseWebhookOptions {
	/** The webhook's `secret` from `webhook.create`. For several webhooks, pass a function that looks it up by ID. */
	secret: string | ((webhookId: string) => string | undefined | Promise<string | undefined>);
}

/**
 * Verifies a webhook request and reads its event.
 *
 * @param input The request, or its raw body and `X-Signature` header
 * @param options The webhook's secret, or a function that looks one up
 * @returns The event: check `event` to narrow it
 * @throws {@link InvalidWebhookError} when the signature is missing or wrong, the body isn't JSON, or there's no secret
 * @example
 * ```ts
 * async function receive(request: Request): Promise<Response> {
 * 	try {
 * 		const event = await parseWebhook(request, { secret });
 * 		if (event.event === "taskStatusUpdated") console.log(event.task_id, event.history_items[0]?.after?.status);
 * 	} catch (error) {
 * 		if (error instanceof InvalidWebhookError) return new Response(null, { status: 401 });
 * 		throw error;
 * 	}
 *
 * 	return new Response(null, { status: 200 });
 * }
 * ```
 */
export async function parseWebhook(
	input: Request | RawWebhookRequest,
	options: ParseWebhookOptions,
): Promise<WebhookEvent> {
	// Read as bytes, since the signature covers the body exactly as sent
	const { body, signature } =
		"signature" in input
			? input
			: { body: new Uint8Array(await input.arrayBuffer()), signature: input.headers.get("X-Signature") };

	if (!signature) {
		throw new InvalidWebhookError("The request has no X-Signature header");
	}

	let event: unknown;
	try {
		event = JSON.parse(typeof body === "string" ? body : new TextDecoder().decode(body));
	} catch {
		throw new InvalidWebhookError("The body isn't JSON");
	}

	// Looked up by the webhook ID in the body, which the signature check then confirms
	let secret: ParseWebhookOptions["secret"] | undefined = options.secret;
	if (typeof secret === "function") {
		const webhookId = isObject(event) ? event.webhook_id : undefined;
		secret = typeof webhookId === "string" ? await secret(webhookId) : undefined;
	}

	if (!secret) {
		throw new InvalidWebhookError("There's no secret for the webhook");
	}

	if (!(await verifyWebhook(body, signature, secret))) {
		throw new InvalidWebhookError(
			"X-Signature doesn't match the body. Check the secret, and pass the body as ClickUp sent it, not JSON parsed and serialized again",
		);
	}

	return event as WebhookEvent;
}
