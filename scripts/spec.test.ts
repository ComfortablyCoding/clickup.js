import { describe, expect, test } from "vitest";
import { resolveRef, listSchemaVariants, type Spec, type Schema } from "./spec.ts";

const Status: Schema = { type: "string" };

const spec = {
	components: {
		schemas: {
			Status,
			StatusAlias: { $ref: "#/components/schemas/Status" },
			MaybeStatus: { anyOf: [{ type: "null" }, Status] },
			"a/b": { type: "boolean" },
			"a~b": { type: "number" },
		},
	},
} satisfies Spec;

describe("resolveRef", () => {
	test.each([
		{ scenario: "a node without a $ref", node: Status, expected: Status },
		{ scenario: "a $ref", node: { $ref: "#/components/schemas/Status" }, expected: Status },
		{ scenario: "a $ref to a $ref", node: { $ref: "#/components/schemas/StatusAlias" }, expected: Status },
		{
			scenario: "a $ref with an escaped /",
			node: { $ref: "#/components/schemas/a~1b" },
			expected: { type: "boolean" },
		},
		{ scenario: "a $ref with an escaped ~", node: { $ref: "#/components/schemas/a~0b" }, expected: { type: "number" } },
		{ scenario: "a $ref into a list", node: { $ref: "#/components/schemas/MaybeStatus/anyOf/1" }, expected: Status },
		{ scenario: "a $ref that leads nowhere", node: { $ref: "#/components/schemas/Missing" }, expected: undefined },
		{ scenario: "undefined", node: undefined, expected: undefined },
	])("When given $scenario, then it's what the refs lead to", ({ node, expected }) => {
		expect(resolveRef(spec, node)).toEqual(expected);
	});
});

describe("listSchemaVariants", () => {
	test("When a schema has variants, then it's listed, then each variant, through refs, allOf, anyOf and oneOf", () => {
		const [a, b, c] = [{ title: "a" }, { title: "b" }, { title: "c" }];
		const schema = { allOf: [a], anyOf: [{ oneOf: [b, { $ref: "#/components/schemas/Status" }] }, c] };

		expect(listSchemaVariants(spec, schema)).toEqual([schema, a, schema.anyOf[0], b, Status, c]);
	});

	test("When there's no schema, then there are no variants", () => {
		expect(listSchemaVariants(spec, undefined)).toEqual([]);
	});
});
