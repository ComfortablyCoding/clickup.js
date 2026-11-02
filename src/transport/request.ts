import pkg from "../../package.json" with { type: "json" };
import { isObject } from "../utils.ts";
import type { TransportConfig, ClickUpRequestInput } from "./http.ts";

/** A response's body: parsed JSON, the text when it isn't JSON, or `null` for a 204. */
export type ClickUpResponseBody = null | string | Record<string, any>;

/** The default `User-Agent`, like `clickup.js/5.0.0`, sent unless the headers set their own. */
const USER_AGENT = `${pkg.name}/${pkg.version}`;

/** Turns a request into fetch's URL and init. There's no signal, as each attempt adds its own. */
export async function toRequestInit(
	input: ClickUpRequestInput,
	config: TransportConfig,
	headers: Record<string, string> = {},
): Promise<{
	/** With the query added */
	url: URL;
	/** The method, headers and body */
	init: RequestInit;
}> {
	// set(), not a spread, as header names are case-insensitive
	const merged = new Headers(config.headers);
	for (const [name, value] of Object.entries(headers)) {
		merged.set(name, value);
	}

	if (!merged.has("User-Agent")) {
		merged.set("User-Agent", USER_AGENT);
	}

	const authorization = await toAuthorization(config.token);
	if (authorization) {
		merged.set("Authorization", authorization);
	}

	const { data } = input;

	let body: BodyInit | undefined;
	if (data instanceof FormData) {
		// Let fetch write the multipart Content-Type, boundary included
		merged.delete("Content-Type");
		body = data;
	} else if (isObject(data) || Array.isArray(data)) {
		merged.set("Content-Type", "application/json");
		body = JSON.stringify(data);
	}

	return {
		url: toUrl(config.baseUrl, input.path, input.query),
		init: { method: input.method, headers: merged, body },
	};
}

/** The `Authorization` header: personal tokens (`pk_...`) as they are, OAuth tokens as `Bearer ...`. */
export async function toAuthorization(token: TransportConfig["token"]): Promise<string | null> {
	let resolved = typeof token === "function" ? await token() : token;

	// Some calls don't need one, like trading an OAuth code for a token
	if (!resolved) {
		return null;
	}

	if (!resolved.startsWith("pk_") && !resolved.startsWith("Bearer ")) {
		resolved = `Bearer ${resolved}`;
	}

	return resolved;
}

/**
 * The path under the base URL, with the query formatted as {@link ClickUpRequestInput.query} says. A
 * trailing slash on the base URL is dropped, as every path starts with one.
 */
export function toUrl(baseUrl: string, path: string, query: Record<string, unknown> = {}): URL {
	const url = new URL(baseUrl.replace(/\/+$/, "") + path);

	for (const [name, value] of Object.entries(query)) {
		if (value === undefined) continue;

		if (Array.isArray(value) && !value.some(isObject)) {
			for (const item of value) {
				url.searchParams.append(`${name}[]`, String(item));
			}
		} else if (isObject(value) || Array.isArray(value)) {
			url.searchParams.set(name, JSON.stringify(value));
		} else {
			url.searchParams.set(name, String(value));
		}
	}

	return url;
}

/** Reads a body as JSON, as text when it isn't JSON, or `null` for a 204. */
export async function parseResponse(response: Response): Promise<ClickUpResponseBody> {
	if (response.status === 204) {
		return null;
	}

	const text = await response.text();

	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}
