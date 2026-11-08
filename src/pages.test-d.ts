import { describe, expectTypeOf, test } from "vitest";
import { createClickUp, pages, type PageParams, type Params, type Result, type WorkspaceParams } from "./index.ts";

const clickup = createClickUp({ workspace: { id: 9012345 } });
const withoutWorkspace = createClickUp();

describe("pages", () => {
	test("When given a paginated method, then it yields the method's responses", () => {
		expectTypeOf(pages(clickup.list.listTasks, { list_id: 901234567 })).toEqualTypeOf<
			AsyncGenerator<Result<"list.listTasks">, void, undefined>
		>();
		expectTypeOf(pages(clickup.task.listComments, { task_id: "86a1b2c3d" })).toEqualTypeOf<
			AsyncGenerator<Result<"task.listComments">, void, undefined>
		>();
	});

	test("When the method requires the page, then pages() doesn't, as it fills it in", () => {
		expectTypeOf<Params<"view.listTasks">>().toHaveProperty("page").toEqualTypeOf<number>();
		expectTypeOf(pages(clickup.view.listTasks, { view_id: "3c-105" })).toEqualTypeOf<
			AsyncGenerator<Result<"view.listTasks">, void, undefined>
		>();
	});

	test("When nothing in the params is required, then they can be left out", () => {
		expectTypeOf(pages(clickup.chatChannel.list)).toEqualTypeOf<
			AsyncGenerator<Result<"chatChannel.list">, void, undefined>
		>();
	});

	test("When the client has no workspace ID, then the workspace's params are required", () => {
		expectTypeOf(pages(withoutWorkspace.chatChannel.list, { workspace_id: 9012345 })).toEqualTypeOf<
			AsyncGenerator<Result<"chatChannel.list">, void, undefined>
		>();
		// @ts-expect-error workspace_id is required without a workspace ID
		expectTypeOf(pages(withoutWorkspace.chatChannel.list)).toBeObject();
	});

	test("When a param is missing, mistyped or unknown, then the call doesn't type-check", () => {
		// @ts-expect-error list_id is required
		expectTypeOf(pages(clickup.list.listTasks, {})).toBeObject();
		// @ts-expect-error page is a number
		expectTypeOf(pages(clickup.list.listTasks, { list_id: 901234567, page: "2" })).toBeObject();
		// @ts-expect-error include_close isn't one of list.listTasks' params
		expectTypeOf(pages(clickup.list.listTasks, { list_id: 901234567, include_close: true })).toBeObject();
	});

	test("When given a method that isn't paginated, then the call doesn't type-check", () => {
		// @ts-expect-error task.get isn't paginated
		expectTypeOf(pages(clickup.task.get, { task_id: "86a1b2c3d" })).toBeObject();
	});

	test("When given options, then they're the per-call options", () => {
		expectTypeOf(
			pages(clickup.list.listTasks, { list_id: 901234567 }, { signal: AbortSignal.timeout(60_000) }),
		).toEqualTypeOf<AsyncGenerator<Result<"list.listTasks">, void, undefined>>();
		// @ts-expect-error retries isn't a request option
		expectTypeOf(pages(clickup.list.listTasks, { list_id: 901234567 }, { retries: 3 })).toBeObject();
	});
});

describe("PageParams", () => {
	test("When a method pages by page, then page is optional", () => {
		expectTypeOf<{ view_id: string }>().toExtend<PageParams<"view.listTasks">>();
		expectTypeOf<PageParams<"view.listTasks">>().toHaveProperty("page").toEqualTypeOf<number | undefined>();
	});

	test("When a method pages by cursor, then cursor is optional", () => {
		expectTypeOf<{ workspace_id: number }>().toExtend<PageParams<"chatChannel.list">>();
		expectTypeOf<PageParams<"chatChannel.list">>().toHaveProperty("cursor").toEqualTypeOf<string | undefined>();
	});

	test("When a method pages by keyset, then start and start_id are optional, and keep their types", () => {
		expectTypeOf<{ task_id: string }>().toExtend<PageParams<"task.listComments">>();
		expectTypeOf<PageParams<"task.listComments">>()
			.toHaveProperty("start")
			.toEqualTypeOf<Params<"task.listComments">["start"]>();
		expectTypeOf<PageParams<"task.listComments">>()
			.toHaveProperty("start_id")
			.toEqualTypeOf<Params<"task.listComments">["start_id"]>();
	});

	test("When the client has a workspace ID, then the workspace params are optional too", () => {
		expectTypeOf<PageParams<"chatChannel.list">>().toHaveProperty("workspace_id").toEqualTypeOf<string | number>();
		expectTypeOf<PageParams<"chatChannel.list", WorkspaceParams<"chatChannel.list">>>()
			.toHaveProperty("workspace_id")
			.toEqualTypeOf<string | number | undefined>();
	});

	test("When the params have variants, then each keeps its own, with the params that pick a page optional", () => {
		type Variants = { cursor: string; value: string } | { cursor: string; value: number };
		expectTypeOf<PageParams<"chatChannel.list", Variants>>().toEqualTypeOf<
			{ cursor?: string; value: string } | { cursor?: string; value: number }
		>();
	});
});
