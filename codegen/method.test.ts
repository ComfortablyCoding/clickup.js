import { describe, expect, test } from "vitest";
import type { Pagination, Route } from "../src/route.ts";
import { toMethod, describeType, type ParamDescription } from "./method.ts";
import type { Spec, Operation, Parameter, PathOperation, Schema } from "./spec.ts";

const NEW_TASK = "#/components/schemas/NewTask";

const listId: Parameter = {
	name: "list_id",
	in: "path",
	required: true,
	schema: { type: "number", examples: [901234567] },
	description: "The List's ID",
};
const customTaskIds: Parameter = { name: "custom_task_ids", in: "query", schema: { type: "boolean" } };

const spec: Spec = {
	components: {
		schemas: {
			NewTask: {
				required: ["name"],
				properties: {
					name: { type: "string", description: "The task's name" },
					tags: { type: "array", items: { type: "string" } },
				},
			},
		},
		requestBodies: {
			NewTask: { content: { "application/json": { schema: { $ref: NEW_TASK } } } },
		},
		parameters: { ListId: listId },
	},
};

const createTask: PathOperation = {
	path: "/v2/list/{list_id}/task",
	method: "post",
	operation: {
		operationId: "CreateTask",
		tags: ["list"],
		"x-sdk-method": "createTask",
		externalDocs: { url: "https://developer.clickup.com/reference/createtask" },
		summary: "Create Task",
		description: "Creates a task in a List.",
		"x-codeSamples": [
			{ lang: "TypeScript", label: "Other SDK", source: "other.createTask(901234567)" },
			{
				lang: "TypeScript",
				label: "clickup.js",
				source: 'await clickup.list.createTask({ list_id: 901234567, name: "Ship v5" });',
			},
		],
		parameters: [listId, customTaskIds],
		requestBody: { content: { "application/json": { schema: { $ref: NEW_TASK } } } },
	},
};

function withBody(requestBody: Operation["requestBody"], parameters = createTask.operation.parameters): PathOperation {
	return { ...createTask, operation: { ...createTask.operation, parameters, requestBody } };
}

describe("toMethod", () => {
	test("When given an operation, then it has its names, route, docs and sample from the spec", () => {
		const definition = toMethod(spec, createTask);

		expect(definition).toMatchObject({
			id: "list.createTask",
			namespace: "list",
			method: "createTask",
			typePrefix: "ListCreateTask",
			route: { method: "POST", path: "/v2/list/{list_id}/task", body: "json" },
			docs: {
				summary: "Create Task",
				description: "Creates a task in a List.",
				referenceUrl: "https://developer.clickup.com/reference/createtask",
				sample: 'await clickup.list.createTask({ list_id: 901234567, name: "Ship v5" });',
			},
		});
	});

	test("When the operation has no docs, then its summary is its method name, and the rest are empty", () => {
		const operation: Operation = { tags: ["list"], "x-sdk-method": "createTask" };

		const definition = toMethod(spec, { ...createTask, operation });

		expect(definition.docs).toMatchObject({ summary: "createTask", description: "", referenceUrl: "", sample: "" });
	});

	test("When the operation has params and a JSON body, then its params are the path and query params, then each field", () => {
		const { params } = toMethod(spec, createTask).docs;

		expect(params).toEqual([
			{ name: "list_id", in: "path", required: true, type: "number", description: "The List's ID" },
			{ name: "custom_task_ids", in: "query", required: false, type: "boolean", description: "" },
			{ name: "name", in: "body", required: true, type: "string", description: "The task's name" },
			{ name: "tags", in: "body", required: false, type: "string[]", description: "" },
		]);
	});

	test("When a param is a $ref, then it's the param the ref leads to", () => {
		const { params } = toMethod(spec, withBody(undefined, [{ $ref: "#/components/parameters/ListId" }])).docs;

		expect(params).toEqual([
			{ name: "list_id", in: "path", required: true, type: "number", description: "The List's ID" },
		]);
	});

	test("When a body field is named like a path or query param, then it's listed once, as the param", () => {
		const schema: Schema = { properties: { list_id: { type: "string" }, name: { type: "string" } } };

		const { params } = toMethod(spec, withBody({ content: { "application/json": { schema } } })).docs;

		expect(params.map((param) => `${param.in} ${param.name}`)).toEqual([
			"path list_id",
			"query custom_task_ids",
			"body name",
		]);
	});

	test("When the body's variants give a field different types, then its type is each of them", () => {
		const schema: Schema = {
			anyOf: [{ properties: { assignee: { type: "number" } } }, { properties: { assignee: { type: "string" } } }],
		};

		const { params } = toMethod(spec, withBody({ content: { "application/json": { schema } } })).docs;

		expect(params.at(-1)).toMatchObject({ name: "assignee", type: "number \\| string" });
	});

	test.each<{ scenario: string; requestBody: Operation["requestBody"]; param: ParamDescription }>([
		{
			scenario: "a multipart form",
			requestBody: {
				required: true,
				content: {
					"multipart/form-data": {
						schema: {
							description: "A `FormData` with the file to upload as `attachment`.",
							properties: { attachment: { type: "string", contentMediaType: "application/octet-stream" } },
						},
					},
				},
			},
			param: {
				name: "data",
				in: "body",
				required: true,
				type: "FormData",
				description: "A `FormData` with the file to upload as `attachment`.",
			},
		},
		{
			scenario: "a JSON list",
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: { type: "array", items: { type: "number" }, description: "The assignees' user IDs" },
					},
				},
			},
			param: { name: "data", in: "body", required: true, type: "number[]", description: "The assignees' user IDs" },
		},
	])("When the body is $scenario, then it's one param, data, taken whole", ({ requestBody, param }) => {
		const { params } = toMethod(spec, withBody(requestBody)).docs;

		expect(params.at(-1)).toEqual(param);
	});
});

describe("toMethod's route", () => {
	test("When the operation has a JSON body, then each of its fields is a body param, after the path and query params", () => {
		const { route } = toMethod(spec, createTask);

		expect(route).toEqual({
			method: "POST",
			path: "/v2/list/{list_id}/task",
			bindings: { list_id: "path", custom_task_ids: "query", name: "body", tags: "body" },
			required: ["list_id", "name"],
			body: "json",
		});
	});

	test("When the operation has several path params, then they come first, in the URL's order, and are required", () => {
		const parameters: Parameter[] = [
			{ name: "task_id", in: "path", required: true },
			{ name: "tag_name", in: "path", required: true },
			customTaskIds,
		];

		const { route } = toMethod(spec, {
			...withBody(undefined, parameters),
			path: "/v2/task/{task_id}/tag/{tag_name}",
		});

		expect(Object.keys(route.bindings)).toEqual(["task_id", "tag_name", "custom_task_ids"]);
		expect(route.required).toEqual(["task_id", "tag_name"]);
	});

	test.each<{ scenario: string; requestBody: Operation["requestBody"]; expected: Partial<Route> }>([
		{
			scenario: "is multipart",
			requestBody: { required: true, content: { "multipart/form-data": {} } },
			expected: {
				body: "multipart",
				bindings: { list_id: "path", custom_task_ids: "query", data: "body" },
				required: ["list_id", "data"],
			},
		},
		{
			scenario: "is a required JSON list",
			requestBody: { required: true, content: { "application/json": { schema: { type: "array" } } } },
			expected: {
				body: "raw",
				bindings: { list_id: "path", custom_task_ids: "query", data: "body" },
				required: ["list_id", "data"],
			},
		},
		{
			scenario: "is an optional JSON list",
			requestBody: { content: { "application/json": { schema: { type: "array" } } } },
			expected: {
				body: "raw",
				bindings: { list_id: "path", custom_task_ids: "query", data: "body" },
				required: ["list_id"],
			},
		},
		{
			scenario: "is offered as multipart and JSON",
			requestBody: { content: { "multipart/form-data": {}, "application/json": { schema: { $ref: NEW_TASK } } } },
			expected: {
				body: "json",
				bindings: { list_id: "path", custom_task_ids: "query", name: "body", tags: "body" },
				required: ["list_id", "name"],
			},
		},
		{
			scenario: "is a $ref",
			requestBody: { $ref: "#/components/requestBodies/NewTask" },
			expected: {
				body: "json",
				bindings: { list_id: "path", custom_task_ids: "query", name: "body", tags: "body" },
				required: ["list_id", "name"],
			},
		},
		{
			scenario: "is missing",
			requestBody: undefined,
			expected: { bindings: { list_id: "path", custom_task_ids: "query" }, required: ["list_id"] },
		},
	])("When the body $scenario, then the route says how it's taken and what's required", ({ requestBody, expected }) => {
		const { body, bindings, required } = toMethod(spec, withBody(requestBody)).route;

		expect({ body, bindings, required }).toEqual(expected);
	});

	test("When the body has variants, then the fields of every variant are params", () => {
		const schema: Schema = { anyOf: [{ properties: { assignees: {} } }, { allOf: [{ $ref: NEW_TASK }] }] };

		const { route } = toMethod(spec, withBody({ content: { "application/json": { schema } } }));

		expect(route.bindings).toMatchObject({ assignees: "body", name: "body", tags: "body" });
	});

	test("When the body has variants, then only the fields it always needs are required, not those only some variants do", () => {
		const schema: Schema = {
			required: ["status"],
			allOf: [{ $ref: NEW_TASK }],
			anyOf: [{ required: ["assignees"] }],
		};

		const { route } = toMethod(spec, withBody({ content: { "application/json": { schema } } }));

		expect(route.required).toEqual(["list_id", "status", "name"]);
	});

	test("When the operation has a header param, then the route doesn't take it", () => {
		const signature: Parameter = { name: "X-Signature", in: "header", required: true };

		const { route } = toMethod(spec, withBody(undefined, [listId, signature]));

		expect(route).toMatchObject({ bindings: { list_id: "path" }, required: ["list_id"] });
		expect(route.bindings).not.toHaveProperty("X-Signature");
	});

	test.each<{ scenario: string; pagination?: Pagination }>([
		{ scenario: "pages", pagination: { style: "page", items: "tasks", last: "last_page" } },
		{ scenario: "doesn't page", pagination: undefined },
	])("When the operation $scenario, then the route pages as its x-sdk-pagination says", ({ pagination }) => {
		const operation: Operation = { ...createTask.operation, "x-sdk-pagination": pagination };

		const { route } = toMethod(spec, { ...createTask, operation });

		expect(route.pagination).toEqual(pagination);
	});
});

describe("describeType", () => {
	test.each<{ schema: Schema | boolean | undefined; type: string }>([
		{ schema: { type: "integer" }, type: "number" },
		{ schema: { type: ["string", "null"] }, type: "string \\| null" },
		{ schema: { type: "array", items: { type: "string" } }, type: "string[]" },
		{ schema: { type: "array", items: { type: ["string", "null"] } }, type: "(string \\| null)[]" },
		{ schema: { $ref: "#/components/schemas/Status" }, type: "Status" },
		{ schema: { enum: ["open", "closed"] }, type: '"open" \\| "closed"' },
		{ schema: { anyOf: [{ type: "string" }, { type: "number" }, { type: "string" }] }, type: "string \\| number" },
		{ schema: { properties: {} }, type: "object" },
		{ schema: {}, type: "unknown" },
		{ schema: true, type: "unknown" },
		{ schema: undefined, type: "unknown" },
	])("When the schema is $schema, then the type is $type", ({ schema, type }) => {
		expect(describeType(schema)).toBe(type);
	});
});
