import { describe, expectTypeOf, test } from "vitest";
import type { ClickUpRequestOptions } from "./client.ts";
import type { MethodTypes, Method, Params, Result, WorkspaceParams } from "./types.ts";
import type { Route } from "./route.ts";

type UpdateTaskData = {
	body: { name?: string; archived?: boolean };
	path: { task_id: string };
	query?: { custom_task_ids?: boolean; team_id?: number };
	url: "/v2/task/{task_id}";
};
type ListCustomFieldsData = { body?: never; path: { team_id: number }; query?: never; url: "/v2/team/{team_id}/field" };
type ReplaceEstimatesData = {
	body: Array<{ assignee: number | "unassigned"; time: number }>;
	path: { workspace_id: string; task_id: string };
	query?: never;
	url: "/v3/workspaces/{workspace_id}/tasks/{task_id}/time_estimates_by_user";
};
type CreateAttachmentData = {
	body: { attachment?: Array<Blob | File> };
	path: { task_id: string };
	query?: never;
	url: "/v2/task/{task_id}/attachment";
};
type SetCustomFieldValueData = {
	body: { value: string } | { value: number; value_options?: { time?: boolean } };
	path: { task_id: string; field_id: string };
	query?: { team_id?: number };
	url: "/v2/task/{task_id}/field/{field_id}";
};
type GetUserData = { body?: never; path?: never; query?: never; url: "/v2/user" };
type ListTasksResponse = { tasks?: Array<{ id: string; name: string }> | null; last_page?: boolean | null };
type ListTasksResponses = { 200: ListTasksResponse };
type RouteWith<R extends Partial<Route>> = { method: "GET"; path: string; bindings: {} } & R;
type ReplaceEstimates = MethodTypes<ReplaceEstimatesData, unknown, RouteWith<{ body: "raw"; required: ["data"] }>>;

describe("MethodTypes", () => {
	test("When an endpoint has path, query and body params, then its params are one object of all three", () => {
		expectTypeOf<MethodTypes<UpdateTaskData, unknown, RouteWith<{ body: "json" }>>["params"]>().toEqualTypeOf<{
			task_id: string;
			custom_task_ids?: boolean;
			team_id?: number;
			name?: string;
			archived?: boolean;
		}>();
	});

	test("When team_id or workspace_id is required, then it stays required in params, but is optional in workspaceParams", () => {
		type ListCustomFields = MethodTypes<ListCustomFieldsData, unknown, RouteWith<{}>>;

		expectTypeOf<ListCustomFields["params"]>().toEqualTypeOf<{ team_id: number }>();
		expectTypeOf<ListCustomFields["workspaceParams"]>().toEqualTypeOf<{ team_id?: number }>();
		expectTypeOf<ReplaceEstimates["workspaceParams"]>()
			.toHaveProperty("workspace_id")
			.toEqualTypeOf<string | undefined>();
	});

	test("When the body is taken whole, then it's the data param, required when the route requires it, and FormData when multipart", () => {
		expectTypeOf<ReplaceEstimates["params"]>().toEqualTypeOf<{
			task_id: string;
			workspace_id: string;
			data: ReplaceEstimatesData["body"];
		}>();
		expectTypeOf<MethodTypes<ReplaceEstimatesData, unknown, RouteWith<{ body: "raw" }>>["params"]>()
			.toHaveProperty("data")
			.toEqualTypeOf<ReplaceEstimatesData["body"] | undefined>();
		expectTypeOf<
			MethodTypes<CreateAttachmentData, unknown, RouteWith<{ body: "multipart"; required: ["data"] }>>["params"]
		>().toEqualTypeOf<{ task_id: string; data: FormData }>();
	});

	test("When the body has variants, then the params are one of each, and each keeps its own params", () => {
		expectTypeOf<MethodTypes<SetCustomFieldValueData, unknown, RouteWith<{ body: "json" }>>["params"]>().toEqualTypeOf<
			| { task_id: string; field_id: string; team_id?: number; value: string }
			| { task_id: string; field_id: string; team_id?: number; value: number; value_options?: { time?: boolean } }
		>();
	});

	test("When an endpoint takes no params, then its params are empty", () => {
		expectTypeOf<MethodTypes<GetUserData, unknown, RouteWith<{}>>["params"]>().toEqualTypeOf<{}>();
	});

	test("When an endpoint has several success responses, then its response is any of them", () => {
		expectTypeOf<
			MethodTypes<{}, { 200: ListTasksResponse; 201: { id: string } }, RouteWith<{}>>["response"]
		>().toEqualTypeOf<ListTasksResponse | { id: string }>();
	});

	test("When it's paginated by a list field, then its item is one element of that list", () => {
		type Paged = RouteWith<{ pagination: { style: "page"; items: "tasks" } }>;

		expectTypeOf<MethodTypes<{}, ListTasksResponses, Paged>["item"]>().toEqualTypeOf<{ id: string; name: string }>();
	});

	test("When it isn't paginated, then its item is never", () => {
		expectTypeOf<MethodTypes<{}, ListTasksResponses, RouteWith<{}>>["item"]>().toBeNever();
	});

	test("When it's paginated, then pageParam is the keyset's params, or the param named after its style", () => {
		type PagedBy<P extends Route["pagination"]> = MethodTypes<{}, ListTasksResponses, RouteWith<{ pagination: P }>>;
		type Keyset = { style: "keyset"; items: "tasks"; from: { start: "date"; start_id: "id" } };

		expectTypeOf<PagedBy<{ style: "page"; items: "tasks" }>["pageParam"]>().toEqualTypeOf<"page">();
		expectTypeOf<PagedBy<{ style: "cursor"; items: "tasks" }>["pageParam"]>().toEqualTypeOf<"cursor">();
		expectTypeOf<PagedBy<Keyset>["pageParam"]>().toEqualTypeOf<"start" | "start_id">();
		expectTypeOf<MethodTypes<{}, ListTasksResponses, RouteWith<{}>>["pageParam"]>().toBeNever();
	});
});

describe("Method", () => {
	test("When nothing in the params is required, then they may be left out", () => {
		expectTypeOf<Method<"authorization.getUser">>().toEqualTypeOf<
			(
				params?: Params<"authorization.getUser">,
				options?: ClickUpRequestOptions,
			) => Promise<Result<"authorization.getUser">>
		>();
	});

	test("When a param is required, then the params object is too", () => {
		expectTypeOf<Method<"task.get">>().toEqualTypeOf<
			(params: Params<"task.get">, options?: ClickUpRequestOptions) => Promise<Result<"task.get">>
		>();
	});

	test("When a workspace param is required, then so are the params, unless the client has a workspace ID", () => {
		expectTypeOf<Method<"workspace.listCustomFields">>()
			.parameter(0)
			.toEqualTypeOf<Params<"workspace.listCustomFields">>();
		expectTypeOf<Params<"workspace.listCustomFields">>().toHaveProperty("team_id").toEqualTypeOf<string | number>();
		type ForWorkspace = Method<"workspace.listCustomFields", WorkspaceParams<"workspace.listCustomFields">>;
		expectTypeOf<ForWorkspace>()
			.parameter(0)
			.toEqualTypeOf<WorkspaceParams<"workspace.listCustomFields"> | undefined>();
	});
});
