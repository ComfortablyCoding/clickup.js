import { expectTypeOf, test } from "vitest";
import type {
	ListCreatedWebhookPayload,
	Status,
	TaskNameUpdatedWebhookPayload,
	Webhooks,
} from "../generated/types.gen.ts";
import type { Params } from "../types.ts";
import type { WebhookEvent, WebhookEventName } from "./types.ts";

test("When the spec's webhooks are generated, then each is named after its event, and every event has one, taskNameUpdated included", () => {
	type EventOfEach = { [W in Webhooks as W["key"]]: W["body"]["event"] };

	expectTypeOf<EventOfEach>().toEqualTypeOf<{ [N in WebhookEventName | "taskNameUpdated"]: N }>();
});

test("When an event's name is given, then WebhookEvent is that event's payload", () => {
	expectTypeOf<WebhookEvent<"listCreated">>().toEqualTypeOf<ListCreatedWebhookPayload>();
	expectTypeOf<WebhookEvent<"taskMoved" | "taskDeleted">["event"]>().toEqualTypeOf<"taskMoved" | "taskDeleted">();
});

test("When an event's name is checked, then the event narrows to its payload", () => {
	const event = {} as WebhookEvent;

	if (event.event === "taskStatusUpdated") {
		expectTypeOf(event.history_items[0].after).toEqualTypeOf<Status | null | undefined>();
	}

	if (event.event === "taskNameUpdated") {
		expectTypeOf(event).toEqualTypeOf<TaskNameUpdatedWebhookPayload>();
	}
});

test("When a webhook is created, then its events are the ones ClickUp sends, or `*`", () => {
	expectTypeOf<Params<"webhook.create">["events"]>().toEqualTypeOf<Array<WebhookEventName | "*">>();
});
