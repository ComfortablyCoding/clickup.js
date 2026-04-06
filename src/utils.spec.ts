import { describe, expect, test } from "vitest";
import { buildRequestUrl, camelToSnakeCase } from "./utils.ts";

describe("utils", () => {
	describe("camelToSnakeCase", () => {
		test.each([
			["userId", "user_id"],
			["isActive", "is_active"],
			["dueDateGt", "due_date_gt"],
			["snake_case", "snake_case"],
			["", ""],
		])("should convert '%s' to '%s'", (input, expected) => {
			expect(camelToSnakeCase(input)).toBe(expected);
		});
	});

	describe("buildRequestUrl", () => {
		test("should return URL instance", () => {
			const url = buildRequestUrl("https://api.clickup.com/api/", "v2/list/123/task");
			expect(url).instanceOf(URL);
		});

		test("should append path to baseURL path", () => {
			const url = buildRequestUrl("https://api.clickup.com/api/", "v2/list/123/task");
			expect(url.pathname).equal("/api/v2/list/123/task");
		});

		test("supports basic searchParams", () => {
			const url = buildRequestUrl("https://api.clickup.com/api", "v2/list/123/task", { archived: false });
			expect(url.searchParams.get("archived")).toEqual("false");
		});

		test("should convert camelCase query keys to snake_case", () => {
			const url = buildRequestUrl("https://api.clickup.com/api", "v2/list/123/task", {
				orderBy: "id",
				includeClosed: true,
			});

			expect(url.searchParams.get("order_by")).toBeDefined();
			expect(url.searchParams.get("orderBy")).toBeNull();
			expect(url.searchParams.get("include_closed")).toBeDefined();
			expect(url.searchParams.get("includeClosed")).toBeNull();
		});

		test("should suffix non [] suffixed keys with [] for array values", () => {
			const url = buildRequestUrl("https://api.clickup.com/api", "v2/list/123/task", {
				assignees: [123, 456],
			});

			expect(url.searchParams.getAll("assignees[]")).toEqual(["123", "456"]);
		});

		test("should convert [] suffixed key array values to LHS bracket notation", () => {
			const url = buildRequestUrl("https://api.clickup.com/api", "v2/list/123/task", {
				"statuses[]": ["completed", "in progress"],
			});

			expect(url.searchParams.getAll("statuses[]").length).toEqual(2);
		});
	});
});
