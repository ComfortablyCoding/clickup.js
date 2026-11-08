import { expect, test } from "vitest";
import { routes } from "./generated/routes.gen.ts";
import type { Route } from "./route.ts";

const table: [string, Route][] = Object.entries(routes);

function bound(route: Route, where: "path" | "query" | "body"): string[] {
	return Object.keys(route.bindings)
		.filter((name) => route.bindings[name] === where)
		.sort();
}

test("When the routes are generated, then they match their snapshot, so any change shows up in review", async () => {
	const lines = table
		.toSorted(([a], [b]) => (a < b ? -1 : 1))
		.map(([id, route]) => `\t${JSON.stringify(id)}: ${JSON.stringify(route)}`);

	await expect(`{\n${lines.join(",\n")}\n}\n`).toMatchFileSnapshot("./__snapshots__/routes.json");
});

test("When a path has placeholders, then each is a path param, and no other param is", () => {
	const mismatched = table
		.map(([id, route]) => ({
			id,
			placeholders: Array.from(route.path.matchAll(/\{(\w+)\}/g), ([, name]) => name).sort(),
			pathParams: bound(route, "path"),
		}))
		.filter(({ placeholders, pathParams }) => placeholders.join() !== pathParams.join());

	expect(mismatched).toEqual([]);
});

test("When a route requires params, then it takes each of them", () => {
	const untaken = table.flatMap(([id, route]) =>
		(route.required ?? []).filter((name) => !(name in route.bindings)).map((name) => `${id} ${name}`),
	);

	expect(untaken).toEqual([]);
});

test("When a body is passed whole, then data is its one body param", () => {
	const mismatched = table
		.filter(([, route]) => route.body === "raw" || route.body === "multipart")
		.filter(([, route]) => bound(route, "body").join() !== "data")
		.map(([id]) => id);

	expect(mismatched).toEqual([]);
});

test("When a route has a body type, then it has body params, and only then", () => {
	const mismatched = table
		.filter(([, route]) => bound(route, "body").length > 0 !== (route.body !== undefined))
		.map(([id]) => id);

	expect(mismatched).toEqual([]);
});
