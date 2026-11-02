import { expect, test } from "vitest";
import type { MethodDefinition } from "./method.ts";
import { renderApiPage, renderRoutesModule, renderSamplesModule } from "./render.ts";

const createTask: MethodDefinition = {
	id: "list.createTask",
	namespace: "list",
	method: "createTask",
	typePrefix: "ListCreateTask",
	route: {
		method: "POST",
		path: "/v2/list/{list_id}/task",
		bindings: { list_id: "path", custom_task_ids: "query", name: "body" },
		required: ["list_id", "name"],
		body: "json",
	},
	docs: {
		summary: "Create Task",
		description: "Creates a task in a List.\n\nIts assignees are notified.",
		referenceUrl: "https://developer.clickup.com/reference/createtask",
		sample: 'await clickup.list.createTask({ list_id: 901234567, name: "Ship v5" });',
		params: [
			{ name: "list_id", in: "path", required: true, type: "number", description: "The List's ID" },
			{ name: "custom_task_ids", in: "query", required: false, type: "boolean", description: "" },
			{
				name: "name",
				in: "body",
				required: true,
				type: "string",
				description: "Its name | title,\nas the List shows it",
			},
		],
	},
};

const listTasks: MethodDefinition = {
	id: "list.listTasks",
	namespace: "list",
	method: "listTasks",
	typePrefix: "ListListTasks",
	route: {
		method: "GET",
		path: "/v2/list/{list_id}/task",
		bindings: { list_id: "path", page: "query" },
		required: ["list_id"],
		pagination: { style: "page", items: "tasks", last: "last_page" },
	},
	docs: {
		summary: "Get Tasks",
		description: "",
		referenceUrl: "https://developer.clickup.com/reference/gettasks",
		sample: "const page = await clickup.list.listTasks({\n\tlist_id: 901234567,\n});\n\nconsole.log(page.tasks);",
		params: [{ name: "list_id", in: "path", required: true, type: "number", description: "The List's ID" }],
	},
};

const getUser: MethodDefinition = {
	id: "user.get",
	namespace: "user",
	method: "get",
	typePrefix: "UserGet",
	route: { method: "GET", path: "/v2/user", bindings: {} },
	docs: {
		summary: "Get Authorized User",
		description: "",
		referenceUrl: "https://developer.clickup.com/reference/getauthorizeduser",
		sample: "await clickup.user.get();",
		params: [],
	},
};

const definitions = [listTasks, getUser, createTask];

test.each([
	{ file: "routes.gen.ts", render: renderRoutesModule },
	{ file: "samples.gen.ts", render: renderSamplesModule },
	{ file: "index.md", render: renderApiPage },
])("When given methods, then $file is rendered as its snapshot", async ({ file, render }) => {
	await expect(render(definitions)).toMatchFileSnapshot(`./__snapshots__/${file}`);
});

test("When no method pages, then PaginatedMethodId is never", () => {
	expect(renderRoutesModule([createTask])).toContain("export type PaginatedMethodId = never;");
});
