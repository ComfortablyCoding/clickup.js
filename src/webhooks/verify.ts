/**
 * Checks a webhook request's `X-Signature`: the hex HMAC-SHA256 of its body, keyed with the webhook's secret.
 *
 * @param body The body exactly as ClickUp sent it
 * @param signature The `X-Signature` header
 * @param secret The webhook's `secret`, which `webhook.create` returns
 * @returns Whether the signature matches, compared in constant time. It's `false` if the signature is missing or isn't hex
 * @example
 * ```ts
 * // Express: express.raw() keeps the body as ClickUp sent it
 * app.post("/clickup", express.raw({ type: "application/json" }), async (req, res) => {
 * 	if (!(await verifyWebhook(req.body, req.get("X-Signature"), secret))) return res.sendStatus(401);
 * 	res.sendStatus(200);
 * });
 * ```
 */
export async function verifyWebhook(
	body: string | Uint8Array,
	signature: string | null | undefined,
	secret: string,
): Promise<boolean> {
	if (!signature) {
		return false;
	}

	let mac: Uint8Array<ArrayBuffer>;
	try {
		mac = Uint8Array.fromHex(signature);
	} catch {
		return false;
	}

	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
		"verify",
	]);
	// A copy, as `subtle` doesn't take views of a SharedArrayBuffer
	const data = typeof body === "string" ? encoder.encode(body) : new Uint8Array(body);

	// verify() compares in constant time, unlike comparing hex strings
	return crypto.subtle.verify("HMAC", key, mac, data);
}
