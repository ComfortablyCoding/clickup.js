import { describe, expect, test } from "vitest";
import pkg from "../../package.json" with { type: "json" };
import { parseResponse, toAuthorization, toRequestInit, toUrl } from "./request.ts";
import type { TransportConfig, ClickUpRequestInput } from "./http.ts";

const TOKEN = "pk_81234567_5RZ0QF9M2KJXW8YB1LTD4HNC7VAPGE3S";

describe("toAuthorization", () => {
	test.each([
		{ token: TOKEN, authorization: TOKEN },
		{ token: "81234567_c2ab0aa5", authorization: "Bearer 81234567_c2ab0aa5" },
		{ token: "Bearer 81234567_c2ab0aa5", authorization: "Bearer 81234567_c2ab0aa5" },
		{ token: () => TOKEN, authorization: TOKEN },
		{ token: async () => "81234567_c2ab0aa5", authorization: "Bearer 81234567_c2ab0aa5" },
		{ token: undefined, authorization: null },
		{ token: "", authorization: null },
		{ token: () => "", authorization: null },
	])("When the token is $token, then the Authorization value is $authorization", async ({ token, authorization }) => {
		expect(await toAuthorization(token)).toBe(authorization);
	});
});

describe("toUrl", () => {
	test.each([
		{
			value: "a list of values",
			query: { statuses: ["to do", "in review"] },
			params: [
				["statuses[]", "to do"],
				["statuses[]", "in review"],
			],
		},
		{
			value: "a list of objects",
			query: { custom_fields: [{ field_id: "de761538-8ae0", operator: "=", value: "High" }] },
			params: [["custom_fields", '[{"field_id":"de761538-8ae0","operator":"=","value":"High"}]']],
		},
		{
			value: "an object",
			query: { custom_field: { field_id: "de761538-8ae0", operator: "IS NULL" } },
			params: [["custom_field", '{"field_id":"de761538-8ae0","operator":"IS NULL"}']],
		},
		{
			value: "a number or boolean",
			query: { page: 2, archived: false },
			params: [
				["page", "2"],
				["archived", "false"],
			],
		},
		{ value: "undefined", query: { archived: undefined }, params: [] },
	])("When a param is $value, then it's written as ClickUp reads it", ({ query, params }) => {
		const url = toUrl("https://api.clickup.com/api", "/v2/list/901234567/task", query);

		expect([...url.searchParams]).toEqual(params);
	});

	test.each(["https://api.clickup.com/api", "https://api.clickup.com/api/"])(
		"When the base URL is %s, then the path joins it with one slash",
		(baseUrl) => {
			expect(toUrl(baseUrl, "/v2/task/86a1b2c3d").href).toBe("https://api.clickup.com/api/v2/task/86a1b2c3d");
		},
	);
});

describe("parseResponse", () => {
	test.each([
		{ body: "JSON", response: new Response('{"id":"86a1b2c3d"}'), parsed: { id: "86a1b2c3d" } },
		{ body: "text", response: new Response("OK"), parsed: "OK" },
		{ body: "empty", response: new Response(""), parsed: "" },
		{ body: "a 204's", response: new Response(null, { status: 204 }), parsed: null },
	])("When the body is $body, then it's read as $parsed", async ({ response, parsed }) => {
		expect(await parseResponse(response)).toEqual(parsed);
	});
});

describe("toRequestInit", () => {
	const config = (overrides: Partial<TransportConfig> = {}): TransportConfig => ({
		token: TOKEN,
		baseUrl: "https://api.clickup.com/api",
		timeout: 30_000,
		maxRetries: 2,
		headers: {},
		hooks: {},
		...overrides,
	});

	test("When given a request, then the URL is the base URL, path and query, with the method and Authorization", async () => {
		const input: ClickUpRequestInput = { method: "GET", path: "/v2/list/901234567/task", query: { page: 2 } };

		const { url, init } = await toRequestInit(input, config());

		expect(url.href).toBe("https://api.clickup.com/api/v2/list/901234567/task?page=2");
		expect(init.method).toBe("GET");
		expect(new Headers(init.headers).get("authorization")).toBe(TOKEN);
	});

	test("When the client and the call both set headers, then both are sent, and the call's win whatever their case", async () => {
		const input: ClickUpRequestInput = { method: "GET", path: "/v2/user" };

		const { init } = await toRequestInit(
			input,
			config({ headers: { "X-Client": "release-bot", "X-Trace-Id": "client" } }),
			{
				"x-trace-id": "4bf92f3577b34da6",
			},
		);

		const headers = new Headers(init.headers);
		expect([headers.get("x-client"), headers.get("x-trace-id")]).toEqual(["release-bot", "4bf92f3577b34da6"]);
	});

	test("When no headers set a User-Agent, then it's the package's name and version", async () => {
		const { init } = await toRequestInit({ method: "GET", path: "/v2/user" }, config());

		expect(new Headers(init.headers).get("user-agent")).toBe(`clickup.js/${pkg.version}`);
	});

	test.each<{ by: string; client: Record<string, string>; call: Record<string, string> }>([
		{ by: "the client's", client: { "User-Agent": "release-bot/1.2.0" }, call: {} },
		{ by: "the call's, in any case", client: {}, call: { "user-agent": "release-bot/1.2.0" } },
	])("When $by headers set a User-Agent, then it's sent instead", async ({ client, call }) => {
		const { init } = await toRequestInit({ method: "GET", path: "/v2/user" }, config({ headers: client }), call);

		expect(new Headers(init.headers).get("user-agent")).toBe("release-bot/1.2.0");
	});

	test.each([
		{ data: "an object", value: { name: "Ship v5" }, body: '{"name":"Ship v5"}' },
		{
			data: "a list",
			value: [{ assignee: 81234567, time: 3_600_000 }],
			body: '[{"assignee":81234567,"time":3600000}]',
		},
	])("When the data is $data, then it's sent as JSON", async ({ value, body }) => {
		const { init } = await toRequestInit({ method: "PUT", path: "/v2/task/86a1b2c3d", data: value }, config());

		expect(init.body).toBe(body);
		expect(new Headers(init.headers).get("content-type")).toBe("application/json");
	});

	test("When the data is a form, then it's sent as is, and the Content-Type is left for fetch to write", async () => {
		const form = new FormData();
		form.append("attachment", new File(["Release notes for v5"], "notes.txt"));

		const { init } = await toRequestInit(
			{ method: "POST", path: "/v2/task/86a1b2c3d/attachment", data: form },
			config({ headers: { "Content-Type": "application/json" } }),
		);

		expect(init.body).toBe(form);
		expect(new Headers(init.headers).has("content-type")).toBe(false);
	});

	test("When there's no data, then there's no body", async () => {
		const { init } = await toRequestInit({ method: "DELETE", path: "/v2/task/86a1b2c3d" }, config());

		expect(init.body).toBeUndefined();
	});
});
