import type { WebhookEventName, Webhooks } from "../generated/types.gen.ts";

export type { WebhookEventName };

/** Every event ClickUp sends: the {@link WebhookEventName}s, plus `taskNameUpdated`, which a webhook can't subscribe to on its own */
type SentEventName = Webhooks["body"]["event"];

/**
 * An event ClickUp sends to a webhook, told apart by `event`. Pass event names to narrow it:
 * `WebhookEvent<"taskMoved">`, or `WebhookEvent<"taskCreated" | "taskDeleted">`.
 */
export type WebhookEvent<N extends SentEventName = SentEventName> = Extract<Webhooks["body"], Record<"event", N>>;
