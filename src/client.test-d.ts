import { describe, expectTypeOf, test } from "vitest";
import {
	ClickUpError,
	createClickUp,
	type ClickUp,
	type ClickUpOptions,
	type Hooks,
	type Params,
	type ClickUpRequestOptions,
	type WithWorkspace,
	type WorkspaceParams,
} from "./index.ts";

const clickup = createClickUp({ workspace: { id: 9012345 } });

describe("methods", () => {
	test("When called, then they take the endpoint's params, then per-call options", () => {
		expectTypeOf(clickup.task.get).parameter(0).toEqualTypeOf<WorkspaceParams<"task.get">>();
		expectTypeOf(clickup.task.get).parameter(1).toEqualTypeOf<ClickUpRequestOptions | undefined>();
	});

	test("When a param is missing, mistyped or unknown, then the call doesn't type-check", () => {
		// @ts-expect-error task_id is required
		expectTypeOf(clickup.task.get).toBeCallableWith({});
		// @ts-expect-error task_id is a string
		expectTypeOf(clickup.task.get).toBeCallableWith({ task_id: 86 });
		// @ts-expect-error name is required
		expectTypeOf(clickup.list.createTask).toBeCallableWith({ list_id: 901234567 });
		expectTypeOf<Params<"task.get">>().not.toHaveProperty("include_subtask");
	});

	test("When given a workspace ID, then the client is re-typed for it, and otherwise it's a ClickUp", () => {
		expectTypeOf(clickup).toEqualTypeOf<WithWorkspace<ClickUp>>();
		expectTypeOf(createClickUp({ workspace: { customTaskIds: true } })).toEqualTypeOf<ClickUp>();
		expectTypeOf(clickup.request).toEqualTypeOf<ClickUp["request"]>();
	});

	test.each([
		{ scenario: "no options", client: createClickUp() },
		{ scenario: "a workspace without an ID", client: createClickUp({ workspace: { customTaskIds: true } }) },
		{
			scenario: "options typed ClickUpOptions",
			client: createClickUp({ workspace: { id: 9012345 } } as ClickUpOptions),
		},
	])("When the client is given $scenario, then team_id and workspace_id are required", ({ client }) => {
		expectTypeOf(client.workspace.listCustomFields)
			.parameter(0)
			.toHaveProperty("team_id")
			.toEqualTypeOf<string | number>();
		expectTypeOf(client.task.replaceTimeEstimatesByUser)
			.parameter(0)
			.toHaveProperty("workspace_id")
			.toEqualTypeOf<string | number>();
	});

	test("When an ID is all digits, then it can be a string, as ClickUp sends it, or a number", () => {
		expectTypeOf(clickup.list.get).toBeCallableWith({ list_id: "901707707338" });
		expectTypeOf(clickup.list.get).toBeCallableWith({ list_id: 901707707338 });
		// @ts-expect-error a time entry's ID is past Number.MAX_SAFE_INTEGER, so a number would round it
		expectTypeOf(clickup.timeEntry.get).toBeCallableWith({ timer_id: 5319944 });
	});

	test("When an option is misspelled, then it doesn't compile", () => {
		// @ts-expect-error worksapce isn't an option
		expectTypeOf(createClickUp({ worksapce: { id: 9012345 } })).toBeObject();
		// @ts-expect-error retries isn't a request option
		expectTypeOf(createClickUp({ workspace: { id: 9012345 }, request: { retries: 3 } })).toBeObject();
	});
});

describe("request()", () => {
	test("When calling any path, then it takes a method, path, query and body, and resolves to the parsed body", () => {
		expectTypeOf(clickup.request).toBeCallableWith({ method: "GET", path: "/v2/user" });
		expectTypeOf(clickup.request).toBeCallableWith({
			method: "POST",
			path: "/v2/list/901234567/task",
			query: { custom_task_ids: true },
			data: { name: "Ship v5" },
		});
		expectTypeOf(clickup.request).returns.resolves.toEqualTypeOf<null | string | Record<string, any>>();
	});

	test("When the method isn't one ClickUp uses, then the call doesn't type-check", () => {
		// @ts-expect-error OPTIONS isn't a ClickUp method
		expectTypeOf(clickup.request).toBeCallableWith({ method: "OPTIONS", path: "/v2/user" });
	});
});

describe("options", () => {
	test("When given a token, then it's a string or a function that returns one", () => {
		expectTypeOf<ClickUpOptions["token"]>().toEqualTypeOf<string | (() => string | Promise<string>) | undefined>();
	});

	test("When given hooks, then onRequest may replace the request, and onResponse the response", () => {
		expectTypeOf<NonNullable<Hooks["onRequest"]>>().returns.toEqualTypeOf<Request | void | Promise<Request | void>>();
		expectTypeOf<NonNullable<Hooks["onResponse"]>>().parameters.toEqualTypeOf<[Response, Request]>();
		expectTypeOf<NonNullable<Hooks["onResponse"]>>().returns.toEqualTypeOf<
			Response | void | Promise<Response | void>
		>();
	});

	test("When setting the client's request defaults, then a signal isn't one, as it belongs to a call", () => {
		expectTypeOf<ClickUpRequestOptions>().toHaveProperty("signal").toEqualTypeOf<AbortSignal | undefined>();
		// @ts-expect-error a signal is per call
		expectTypeOf(createClickUp).toBeCallableWith({ request: { signal: AbortSignal.abort() } });
	});
});

describe("ClickUpError", () => {
	test("When ClickUp answers with an error, then it has the status, ECODE and the request's method and URL", () => {
		expectTypeOf<ClickUpError>().toExtend<Error>();
		expectTypeOf<ClickUpError>().toHaveProperty("status").toEqualTypeOf<number>();
		expectTypeOf<ClickUpError>().toHaveProperty("code").toEqualTypeOf<string | undefined>();
		expectTypeOf<ClickUpError>().toHaveProperty("method").toEqualTypeOf<string>();
		expectTypeOf<ClickUpError>().toHaveProperty("url").toEqualTypeOf<string>();
	});

	test("When made from a response, then it takes the response, the request, and options with the body", () => {
		expectTypeOf(ClickUpError.fromResponse).parameters.toEqualTypeOf<[Response, Request, { body?: unknown }?]>();
		expectTypeOf(ClickUpError.fromResponse).returns.toEqualTypeOf<ClickUpError>();
	});
});
