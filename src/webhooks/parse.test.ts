import { expect, test, vi } from "vitest";
import { body, delivery, secret, signature } from "../../test/helpers/webhook.ts";
import { InvalidWebhookError } from "./error.ts";
import { parseWebhook } from "./parse.ts";

test("When the request is signed with the secret, then it returns the event", async () => {
	const event = await parseWebhook(delivery(), { secret });

	expect(event).toEqual(JSON.parse(body));
});

test("When given the raw body and header instead of a Request, then it returns the event", async () => {
	const event = await parseWebhook({ body: new TextEncoder().encode(body), signature }, { secret });

	expect(event).toEqual(JSON.parse(body));
});

test("When the secret is a function, then it's asked for the secret of the webhook the body names", async () => {
	const lookup = vi.fn<(webhookId: string) => Promise<string | undefined>>(async () => secret);

	await parseWebhook(delivery(), { secret: lookup });

	expect(lookup).toHaveBeenCalledExactlyOnceWith("7fa3ec74-69a8-4530-a251-8a13730bd204");
});

test.each([
	{ problem: "has no X-Signature header", request: () => delivery({}), key: secret, message: /no X-Signature/ },
	{
		problem: "is signed with another secret",
		request: () => delivery(),
		key: "another secret",
		message: /doesn't match/,
	},
	{
		problem: "has a body that isn't JSON",
		request: () => delivery({ "X-Signature": signature }, "<html></html>"),
		key: secret,
		message: /isn't JSON/,
	},
	{
		problem: "names a webhook there's no secret for",
		request: () => delivery(),
		key: async () => undefined,
		message: /no secret/,
	},
])("When the request $problem, then it throws an InvalidWebhookError", async ({ request, key, message }) => {
	const error = await parseWebhook(request(), { secret: key }).catch((error: unknown) => error);

	expect(error).toBeInstanceOf(InvalidWebhookError);
	expect(error).toMatchObject({ name: "InvalidWebhookError", message: expect.stringMatching(message) });
});
