import { beforeAll, describe, expect, it } from "vitest";
import { Clickup } from "../src/index";

let client;

beforeAll(() => {
	client = new Clickup();
});

describe("client instance", () => {
	it("constructs an instance", () => {
		expect(client).instanceOf(Clickup);
	});
});

describe("getRequestURL", () => {
	it("returns URL instance", () => {
		const url = client.getRequestURL("list/123/task");
		expect(url).instanceOf(URL);
	});

	it("appends path to baseURL path", () => {
		const url = client.getRequestURL("list/123/task");
		expect(url.pathname).equal("/api/v2/list/123/task");
	});

	it("supports basic searchParams", () => {
		const url = client.getRequestURL("list/123/task", { archived: false });
		expect(url.searchParams).toEqual(new URLSearchParams([["archived", "false"]]));
	});

	it("converts [] suffixed key array values to LHS bracket notation", () => {
		const url = client.getRequestURL("list/123/task", {
			"statuses[]": ["completed", "in progress"],
		});

		expect(url.searchParams).toEqual(new URLSearchParams("statuses[]=completed&statuses[]=in progress"));
	});

	it("converts non [] suffixed key array values to LHS bracket notation", () => {
		const url = client.getRequestURL("list/123/task", {
			assignees: [123, 456],
		});

		const result = new URLSearchParams("assignees[]=123&assignees[]=456");
		expect(url.searchParams).toEqual(result);
	});
});
