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

	describe("options", () => {
		test("should deep merge request options with defaults", () => {
			const client = new Clickup({ request: { timeout: 5000 } });

			expect(client.options.request.timeout).toBe(5000);
			expect(client.options.request.prefixUrl).toBe("https://api.clickup.com/api/");
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

		test("should use setToken() to override", async () => {
			const client = new Clickup({ token: "MY_CONSTRUCTOR_TOKEN" });
			client.setToken("MY_SET_TOKEN");

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
		test("should make GET request", async () => {
			const client = new Clickup();

			await client.request({ path: "" });

			expect(ofetch).toHaveBeenCalledWith(
				new URL("https://api.clickup.com/api/"),
				expect.objectContaining({
					method: "GET",
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
					headers: expect.objectContaining({
						"X-Custom": "value",
					}),
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
			expect(onResponse).toHaveBeenCalled();
		});

		test("should throw ClickupAPIError on FetchError", async () => {
			ofetch.mockRejectedValueOnce(new FetchError(429, "Too Many Requests"));

			const client = new Clickup();

			await expect(client.request({ path: "/v2/test" })).rejects.toThrow(
				new ClickupAPIError({ status: 429, message: "Too Many Requests" }),
			);
		});

		test("should rethrow non-FetchError", async () => {
			ofetch.mockRejectedValueOnce(new Error("Network failure"));

			const client = new Clickup();

			await expect(client.request({ path: "/v2/test" })).rejects.toThrow("Network failure");
		});
	});
});
