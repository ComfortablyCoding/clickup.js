import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { Clickup } from "./client.ts";
import { ClickupAPIError } from "./error.ts";

function mockFetch(body = { success: true }, status = 200) {
	return vi.fn().mockResolvedValue({
		ok: status >= 200 && status < 300,
		status,
		statusText: status === 200 ? "OK" : "Error",
		json: () => Promise.resolve(body),
	});
}

describe("client", () => {
	let fetchMock: ReturnType<typeof mockFetch>;

	beforeEach(() => {
		fetchMock = mockFetch();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("instance", () => {
		test("constructs an instance", () => {
			const client = new Clickup({ fetch: fetchMock });
			expect(client).instanceOf(Clickup);
		});
	});

	describe("options", () => {
		test("should deep merge request options with defaults", () => {
			const client = new Clickup({ fetch: fetchMock, request: { prefixUrl: "https://custom.api.com/" } });

			expect(client.options.request.prefixUrl).toBe("https://custom.api.com/");
		});
	});

	describe("token handling", () => {
		test("should use token from constructor", async () => {
			const client = new Clickup({ fetch: fetchMock, token: "MY_CONSTRUCTOR_TOKEN" });

			await client.request({ path: "" });

			expect(fetchMock).toHaveBeenCalledWith(
				expect.any(URL),
				expect.objectContaining({
					headers: expect.objectContaining({ Authorization: "MY_CONSTRUCTOR_TOKEN" }),
				}),
			);
		});

		test("Should fall back to process.env.CLICKUP_TOKEN", async () => {
			process.env.CLICKUP_TOKEN = "MY_ENV_TOKEN";

			const client = new Clickup({ fetch: fetchMock });
			await client.request({ path: "" });

			expect(fetchMock).toHaveBeenCalledWith(
				expect.any(URL),
				expect.objectContaining({
					headers: expect.objectContaining({ Authorization: "MY_ENV_TOKEN" }),
				}),
			);

			delete process.env.CLICKUP_TOKEN;
		});

		test("should use setToken() to override", async () => {
			const client = new Clickup({ fetch: fetchMock, token: "MY_CONSTRUCTOR_TOKEN" });
			client.setToken("MY_SET_TOKEN");

			await client.request({ path: "" });

			expect(fetchMock).toHaveBeenCalledWith(
				expect.any(URL),
				expect.objectContaining({
					headers: expect.objectContaining({ Authorization: "MY_SET_TOKEN" }),
				}),
			);
		});
	});

	describe("request", () => {
		test("should make GET request", async () => {
			const client = new Clickup({ fetch: fetchMock });

			await client.request({ path: "" });

			expect(fetchMock).toHaveBeenCalledWith(
				new URL("https://api.clickup.com/api/"),
				expect.objectContaining({
					method: "GET",
				}),
			);
		});

		test("should support custom method, query, headers", async () => {
			const client = new Clickup({ fetch: fetchMock });

			await client.request({
				method: "POST",
				path: "v2/test",
				query: { page: 1 },
				headers: { "X-Custom": "value" },
			});

			expect(fetchMock).toHaveBeenCalledWith(
				new URL("https://api.clickup.com/api/v2/test?page=1"),
				expect.objectContaining({
					method: "POST",
					headers: expect.objectContaining({
						"X-Custom": "value",
					}),
				}),
			);
		});

		test("should convert camelCase body keys to snake_case and JSON.stringify", async () => {
			const client = new Clickup({ fetch: fetchMock });

			await client.request({
				method: "POST",
				path: "",
				body: { userId: 123, isActive: true },
			});

			expect(fetchMock).toHaveBeenCalledWith(
				expect.any(URL),
				expect.objectContaining({
					body: JSON.stringify({ user_id: 123, is_active: true }),
					headers: expect.objectContaining({ "Content-Type": "application/json" }),
				}),
			);
		});

		test("should not convert FormData body", async () => {
			const client = new Clickup({ fetch: fetchMock });

			const form = new FormData();
			form.append("file", new Blob(["test"], { type: "text/plain" }), "test.txt");

			await client.request({
				method: "POST",
				path: "/v2/upload",
				body: form,
			});

			expect(fetchMock).toHaveBeenCalledWith(
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
				fetch: fetchMock,
				token: "test",
				hooks: { onRequest, onResponse },
			});

			await client.request({ path: "/v2/test" });

			expect(onRequest).toHaveBeenCalled();
			expect(onResponse).toHaveBeenCalled();
		});

		test("should throw ClickupAPIError on non-ok response", async () => {
			const errorFetch = mockFetch({ err: "Rate limit exceeded", ECODE: "RATE_LIMIT" }, 429);
			const client = new Clickup({ fetch: errorFetch });

			await expect(client.request({ path: "/v2/test" })).rejects.toThrow(ClickupAPIError);
		});

		test("should rethrow fetch errors", async () => {
			const failFetch = vi.fn().mockRejectedValue(new Error("Network failure"));
			const client = new Clickup({ fetch: failFetch });

			await expect(client.request({ path: "/v2/test" })).rejects.toThrow("Network failure");
		});

		test("should use custom fetch implementation", async () => {
			const customFetch = mockFetch({ custom: true });
			const client = new Clickup({ fetch: customFetch });

			const data = await client.request({ path: "" });

			expect(customFetch).toHaveBeenCalled();
			expect(data).toEqual({ custom: true });
		});
	});
});
