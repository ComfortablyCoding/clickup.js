import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { Clickup } from "./client.js";
import { FetchError, ofetch } from "ofetch";
import { ClickupAPIError } from "./error.js";

vi.mock("ofetch", () => ({
	ofetch: vi.fn(),
	FetchError: class FetchError extends Error {
		constructor(status, statusText) {
			super(statusText);
			this.status = status;
			this.statusText = statusText;
		}
	},
}));

describe("client", () => {
	beforeEach(() => {
		ofetch.mockResolvedValue({ success: true });
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.resetAllMocks();
		vi.resetModules();
	});

	describe("instance", () => {
		const client = new Clickup();

		test("constructs an instance", () => {
			expect(client).instanceOf(Clickup);
		});
	});

	describe("token handling", () => {
		test("should use token from constructor", async () => {
			const client = new Clickup({ token: "MY_CONSTRUCTOR_TOKEN" });

			await client.request({ path: "" });

			expect(ofetch).toHaveBeenCalledWith(
				expect.any(URL),
				expect.objectContaining({
					headers: expect.objectContaining({ Authorization: "MY_CONSTRUCTOR_TOKEN" }),
				}),
			);
		});

		test("Should fall back to process.env.CLICKUP_TOKEN", async () => {
			process.env.CLICKUP_TOKEN = "MY_ENV_TOKEN";

			const client = new Clickup();
			await client.request({ path: "" });

			expect(ofetch).toHaveBeenCalledWith(
				expect.any(URL),
				expect.objectContaining({
					headers: expect.objectContaining({ Authorization: "MY_ENV_TOKEN" }),
				}),
			);

			delete process.env.CLICKUP_TOKEN;
		});

		test("should use seToken() to override", async () => {
			const client = new Clickup({ token: "MY_CONSTRUCTOR_TOKEN" });
			client.seToken("MY_SET_TOKEN");

			await client.request({ path: "" });

			expect(ofetch).toHaveBeenCalledWith(
				expect.any(URL),
				expect.objectContaining({
					headers: expect.objectContaining({ Authorization: "MY_SET_TOKEN" }),
				}),
			);
		});
	});

	describe("request", () => {
		test("should make GET request with default headers", async () => {
			const client = new Clickup();

			await client.request({ path: "" });

			expect(ofetch).toHaveBeenCalledWith(
				new URL("https://api.clickup.com/api/"),
				expect.objectContaining({
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}),
			);
		});

		test("should support custom method, query, headers", async () => {
			const client = new Clickup();

			await client.request({
				method: "POST",
				path: "v2/test",
				query: { page: 1 },
				headers: { "X-Custom": "value" },
			});

			expect(ofetch).toHaveBeenCalledWith(
				new URL("https://api.clickup.com/api/v2/test?page=1"),
				expect.objectContaining({
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Custom": "value",
					},
				}),
			);
		});

		test("should convert camelCase body keys to snake_case", async () => {
			const client = new Clickup();

			await client.request({
				method: "POST",
				path: "",
				body: { userId: 123, isActive: true },
			});

			expect(ofetch).toHaveBeenCalledWith(
				expect.any(URL),
				expect.objectContaining({
					body: { user_id: 123, is_active: true },
				}),
			);
		});

		test("should not convert FormData body", async () => {
			const client = new Clickup();

			const form = new FormData();
			form.append("file", new Blob(["test"], { type: "text/plain" }), "test.txt");

			await client.request({
				method: "POST",
				path: "/v2/upload",
				body: form,
			});

			expect(ofetch).toHaveBeenCalledWith(
				expect.any(URL),
				expect.objectContaining({
					body: form,
				}),
			);
		});

		test("should call onRequest and onResponse hooks", async () => {
			const onRequest = vi.fn();
			const onResponse = vi.fn().mockResolvedValue({ modified: true });

			const client = new Clickup({
				token: "test",
				hooks: { onRequest, onResponse },
			});

			await client.request({ path: "/v2/test" });

			expect(onRequest).toHaveBeenCalled();
			expect(onResponse).toHaveBeenCalledWith({ success: true });
		});

		test("should throw ClickupAPIError on FetchError", async () => {
			ofetch.mockRejectedValueOnce(new FetchError(429, "Too Many Requests"));

			const client = new Clickup();

			await expect(client.request({ path: "/v2/test" })).rejects.toThrow(new ClickupAPIError(429, "Too Many Requests"));
		});

		test("should rethrow non-FetchError", async () => {
			ofetch.mockRejectedValueOnce(new Error("Network failure"));

			const client = new Clickup();

			await expect(client.request({ path: "/v2/test" })).rejects.toThrow("Network failure");
		});
	});

	describe("buildRequestUrl", () => {
		const client = new Clickup();

		test("should return URL instance", () => {
			const url = client.buildRequestUrl("https://api.clickup.com/api/", "v2/list/123/task");
			expect(url).instanceOf(URL);
		});

		test("should append path to baseURL path", () => {
			const url = client.buildRequestUrl("https://api.clickup.com/api/", "v2/list/123/task");
			expect(url.pathname).equal("/api/v2/list/123/task");
		});

		test("supports basic searchParams", () => {
			const url = client.buildRequestUrl("https://api.clickup.com/api", "v2/list/123/task", { archived: false });
			expect(url.searchParams.get("archived")).toEqual("false");
		});

		test("should convert camelCase query keys to snake_case", () => {
			const url = client.buildRequestUrl("https://api.clickup.com/api", "v2/list/123/task", {
				orderBy: "id",
				includeClosed: true,
			});

			expect(url.searchParams.get("order_by")).toBeDefined();
			expect(url.searchParams.get("orderBy")).toBeNull();
			expect(url.searchParams.get("include_closed")).toBeDefined();
			expect(url.searchParams.get("includeClosed")).toBeNull();
		});

		test("should suffix non [] suffixed keys with [] for array values", () => {
			const url = client.buildRequestUrl("https://api.clickup.com/api", "v2/list/123/task", {
				assignees: [123, 456],
			});

			expect(url.searchParams.getAll("assignees[]")).toEqual(["123", "456"]);
		});

		test("should convert [] suffixed key array values to LHS bracket notation", () => {
			const url = client.buildRequestUrl("https://api.clickup.com/api", "v2/list/123/task", {
				"statuses[]": ["completed", "in progress"],
			});

			expect(url.searchParams.getAll("statuses[]").length).toEqual(2);
		});
	});

	describe("cameltoSnakeCase", () => {
		const client = new Clickup();

		test.each([
			["userId", "user_id"],
			["isActive", "is_active"],
			["dueDateGt", "due_date_gt"],
			["snake_case", "snake_case"],
			["", ""],
		])("should camelCase $0 to snake_case $1", (k, v) => {
			expect(client.cameltoSnakeCase(k)).toBe(v);
		});
	});
});
