import { describe, expect, test } from "vitest";
import { toRequest, withPath, withWorkspace, type Route } from "./route.ts";

describe("withWorkspace", () => {
	type Case = {
		scenario: string;
		takes: Route["bindings"];
		input: Record<string, unknown>;
		filled: Record<string, unknown>;
	};

	test.each<Case>([
		{
			scenario: "the route takes team_id and the call leaves it out",
			takes: { team_id: "query" },
			input: {},
			filled: { team_id: 9012345 },
		},
		{
			scenario: "the route takes workspace_id and the call leaves it out",
			takes: { workspace_id: "path" },
			input: {},
			filled: { workspace_id: 9012345 },
		},
		{
			scenario: "the call gives its own team_id",
			takes: { team_id: "path" },
			input: { team_id: 1234567 },
			filled: { team_id: 1234567 },
		},
		{
			scenario: "the route takes neither",
			takes: { task_id: "path" },
			input: { task_id: "86a1b2c3d" },
			filled: { task_id: "86a1b2c3d" },
		},
	])("When $scenario, then the params are $filled", ({ takes, input, filled }) => {
		expect(withWorkspace(input, takes, { id: 9012345 })).toEqual(filled);
	});

	test.each<Case>([
		{
			scenario: "the route takes custom_task_ids",
			takes: { custom_task_ids: "query" },
			input: {},
			filled: { custom_task_ids: true },
		},
		{
			scenario: "the call turns it off",
			takes: { custom_task_ids: "query" },
			input: { custom_task_ids: false },
			filled: { custom_task_ids: false },
		},
		{ scenario: "the route doesn't take it", takes: {}, input: {}, filled: {} },
	])("When customTaskIds is on and $scenario, then the params are $filled", ({ takes, input, filled }) => {
		expect(withWorkspace(input, takes, { customTaskIds: true })).toEqual(filled);
	});

	test("When it fills in the workspace, then the call's own params are left as they were", () => {
		const input = { task_id: "86a1b2c3d" };

		withWorkspace(input, { task_id: "path", team_id: "query" }, { id: 9012345 });

		expect(input).toEqual({ task_id: "86a1b2c3d" });
	});
});

describe("toRequest", () => {
	const updateTask: Route = {
		method: "PUT",
		path: "/v2/task/{task_id}",
		bindings: {
			task_id: "path",
			custom_task_ids: "query",
			name: "body",
			archived: "body",
		},
		required: ["task_id"],
		body: "json",
	};

	test("When given params, then each goes in the path, query or body its route binds it to", () => {
		const request = toRequest(updateTask, {
			task_id: "86a1b2c3d",
			custom_task_ids: true,
			name: "Ship v5",
		});

		expect(request).toEqual({
			method: "PUT",
			path: "/v2/task/86a1b2c3d",
			query: { custom_task_ids: true },
			data: { name: "Ship v5" },
		});
	});

	test("When the route has no body, then there's no data", () => {
		const getTask: Route = {
			method: "GET",
			path: "/v2/task/{task_id}",
			bindings: { task_id: "path" },
		};

		expect(toRequest(getTask, { task_id: "86a1b2c3d" }).data).toBeUndefined();
	});

	test("When the route's body isn't an object, then the data param is the whole body", () => {
		const replaceEstimates: Route = {
			method: "PUT",
			path: "/v3/workspaces/{workspace_id}/tasks/{task_id}/time_estimates_by_user",
			bindings: { workspace_id: "path", task_id: "path", data: "body" },
			body: "raw",
		};
		const estimates = [{ assignee: 81234567, time: 3_600_000 }];

		const request = toRequest(replaceEstimates, {
			workspace_id: 9012345,
			task_id: "86a1b2c3d",
			data: estimates,
		});

		expect(request.data).toBe(estimates);
	});

	test("When the route is multipart, then the caller's form is passed whole as data", () => {
		const createAttachment: Route = {
			method: "POST",
			path: "/v2/task/{task_id}/attachment",
			bindings: { task_id: "path", data: "body" },
			required: ["task_id", "data"],
			body: "multipart",
		};
		const form = new FormData();
		form.append("attachment", new File(["Release notes for v5"], "notes.txt"));

		const request = toRequest(createAttachment, {
			task_id: "86a1b2c3d",
			data: form,
		});

		expect(request.data).toBe(form);
	});

	test.each([
		{
			scenario: "a required param is missing",
			route: { ...updateTask, required: ["task_id", "name"] },
			input: { task_id: "86a1b2c3d" },
			message: "PUT /v2/task/{task_id} requires name",
		},
		{
			scenario: "the route doesn't take a param",
			route: updateTask,
			input: { task_id: "86a1b2c3d", include_subtasks: true },
			message: "PUT /v2/task/{task_id} doesn't take include_subtasks",
		},
		{
			scenario: "a path param is missing",
			route: updateTask,
			input: { name: "Ship v5" },
			message: "PUT /v2/task/{task_id} requires task_id",
		},
	])("When $scenario, then it throws a TypeError", ({ route, input, message }) => {
		expect(() => toRequest(route, input)).toThrow(new TypeError(message));
	});
});

describe("withPath", () => {
	test.each([
		{ params: { task_id: "86a1b2c3d" }, path: "/v2/task/86a1b2c3d" },
		{ params: { task_id: "DEV 42/1" }, path: "/v2/task/DEV%2042%2F1" },
		{ params: { task_id: 901234567 }, path: "/v2/task/901234567" },
	])("When the placeholder's value is $params.task_id, then the path is $path", ({ params, path }) => {
		expect(withPath("/v2/task/{task_id}", params)).toBe(path);
	});

	test("When the path has several placeholders, then each is filled from the param with its name", () => {
		const params = { tag_name: "to do", task_id: "86a1b2c3d" };

		expect(withPath("/v2/task/{task_id}/tag/{tag_name}", params)).toBe("/v2/task/86a1b2c3d/tag/to%20do");
	});
});
