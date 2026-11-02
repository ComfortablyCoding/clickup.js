/**
 * The client: `createClickUp`, its options and types, `pages` and `ClickUpError`.
 *
 * @module clickup.js
 * @mergeModuleWith <project>
 */
export {
	createClickUp,
	type ClickUp,
	type ClickUpOptions,
	type ClickUpRequestOptions,
	type Hooks,
	type RequestDefaults,
	type WorkspaceOptions,
} from "./client.ts";
export { ClickUpError, type ClickUpErrorOptions } from "./error.ts";
export { pages } from "./pages.ts";
export type { ClickUpResponseBody } from "./transport/request.ts";
export type { ClickUpRequestInput } from "./transport/http.ts";
export type {
	Method,
	PageItem,
	PageParams,
	PaginatedMethod,
	Params,
	Result,
	WithWorkspace,
	WorkspaceParams,
} from "./types.ts";
export type { MethodId, PaginatedMethodId } from "./generated/routes.gen.ts";
export type { Folder, List, Space, Task } from "./generated/types.gen.ts";
