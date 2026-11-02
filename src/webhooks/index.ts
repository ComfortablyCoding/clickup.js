/**
 * Verifies and reads the requests ClickUp sends to webhooks. It's a separate entry point, so a webhook
 * receiver doesn't load the client.
 *
 * @module clickup.js/webhooks
 */

// Nothing in this folder may import client.ts or transport/, or the client comes with it
export { InvalidWebhookError } from "./error.ts";
export { parseWebhook, type ParseWebhookOptions, type RawWebhookRequest } from "./parse.ts";
export type { WebhookEvent, WebhookEventName } from "./types.ts";
export { verifyWebhook } from "./verify.ts";
