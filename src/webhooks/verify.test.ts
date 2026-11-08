import { expect, test } from "vitest";
import { body, secret, signature } from "../../test/helpers/webhook.ts";
import { verifyWebhook } from "./verify.ts";

test.each([
	{ kind: "a string", value: body, mac: signature },
	{ kind: "bytes", value: new TextEncoder().encode(body), mac: signature },
	{ kind: "a string, with the signature in upper case", value: body, mac: signature.toUpperCase() },
])("When the body is $kind and the signature matches, then it's true", async ({ value, mac }) => {
	expect(await verifyWebhook(value, mac, secret)).toBe(true);
});

test.each([
	{ kind: "missing", value: body, mac: null, key: secret },
	{ kind: "empty", value: body, mac: "", key: secret },
	{ kind: "not hex", value: body, mac: "sha256=8100670e", key: secret },
	{ kind: "cut short", value: body, mac: signature.slice(0, 32), key: secret },
	{ kind: "made with another secret", value: body, mac: signature, key: "another secret" },
	{ kind: "for another body", value: body.replace("in progress", "complete"), mac: signature, key: secret },
	{
		kind: "for the body before it was serialized again",
		value: JSON.stringify(JSON.parse(body), null, 2),
		mac: signature,
		key: secret,
	},
])("When the signature is $kind, then it's false", async ({ value, mac, key }) => {
	expect(await verifyWebhook(value, mac, key)).toBe(false);
});
