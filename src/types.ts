import type { ClickUpRequestOptions } from "./client.ts";
import type { MethodId, MethodTypeMap, Namespaces, PaginatedMethodId } from "./generated/routes.gen.ts";
import type { Pagination, Route } from "./route.ts";

/** Filled in from the client's workspace when left out. */
type WorkspaceDefaulted = "team_id" | "workspace_id";

/** `T` as a single object type, so editors show its fields instead of `A & B`. Applied to each member of a union. */
type Flatten<T> = T extends unknown ? { [K in keyof T]: T[K] } : never;

/** type-fest's `SetOptional`, flattened and applied to each member of a union, since `Omit` on a union keeps only shared keys. */
type SetOptional<T, K extends PropertyKey> = T extends unknown
	? Flatten<Omit<T, K> & Partial<Pick<T, Extract<keyof T, K>>>>
	: never;

/** The element type of the list in response field `K`. */
type ItemOf<R, K extends string> = R extends { [P in K]?: infer A }
	? NonNullable<A> extends readonly (infer T)[]
		? T
		: never
	: never;

/** hey-api's `XxxData`: an endpoint's params, grouped by where they go. */
type EndpointData = { path?: unknown; query?: unknown; body?: unknown };

/** One part of an `XxxData`, or `{}` where hey-api has `never`. */
type Part<T> = [NonNullable<T>] extends [never] ? {} : NonNullable<T>;

/** The params a route requires. */
type RequiredBy<R> = R extends { required: readonly (infer K)[] } ? K : never;

/** A body passed whole as `data`, required when the route requires it. */
type WholeBody<B, R> = "data" extends RequiredBy<R> ? { data: B } : { data?: B };

/** A body as the route takes it: a JSON object's fields, or the body whole as `data`. */
type BodyParams<B, R> = R extends { body: "json" }
	? Part<B>
	: R extends { body: "raw" }
		? WholeBody<NonNullable<B>, R>
		: R extends { body: "multipart" }
			? WholeBody<FormData, R>
			: {};

/** An endpoint's params, from hey-api's `XxxData` as its route takes them. */
type ParamsOf<Data extends EndpointData, R> = Part<Data["path"]> & Part<Data["query"]> & BodyParams<Data["body"], R>;

/** A route's pagination, or `never` if it doesn't page. */
type PagingOf<R> = R extends { pagination: infer P extends Pagination } ? P : never;

/** The params that pick a page: a keyset's fields, or the param named after the style. */
type PageParamOf<P extends Pagination> = P extends { from: infer From } ? keyof From : P["style"];

/**
 * One method's types, built from hey-api's types and its route. The generated `MethodTypeMap`
 * instantiates it once per method, so they're never computed over the union of every method.
 */
export interface MethodTypes<Data extends EndpointData, Responses, R extends Route> {
	/** Its params, as ClickUp requires them */
	params: Flatten<ParamsOf<Data, R>>;
	/** Its params for a client that auto-fills its workspace ID */
	workspaceParams: SetOptional<ParamsOf<Data, R>, WorkspaceDefaulted>;
	/** The params that pick a page */
	pageParam: PageParamOf<PagingOf<R>>;
	/** Its response, or `unknown` where the spec has no schema */
	response: Responses[keyof Responses];
	/** One item from its pages, or `never` if it isn't paginated */
	item: ItemOf<Responses[keyof Responses], PagingOf<R>["items"]>;
}

/** A method's parameters, as ClickUp requires them, e.g. `Params<"task.get">`. */
export type Params<N extends MethodId> = MethodTypeMap[N]["params"];

/** A method's parameters on a client that auto-fills its workspace ID, e.g. `WorkspaceParams<"task.get">`. */
export type WorkspaceParams<N extends MethodId> = MethodTypeMap[N]["workspaceParams"];

/** A method's response, e.g. `Result<"task.get">`. */
export type Result<N extends MethodId> = MethodTypeMap[N]["response"];

/** One item of a paginated method's pages, e.g. `PageItem<"list.listTasks">`. */
export type PageItem<N extends MethodId> = MethodTypeMap[N]["item"];

/** A method's arguments: its params, optional when none are required, then options. */
export type MethodArgs<P> = {} extends P
	? [params?: P, options?: ClickUpRequestOptions]
	: [params: P, options?: ClickUpRequestOptions];

/** A generated method, e.g. `task.get()`. */
export interface Method<N extends MethodId, P = Params<N>> {
	(...args: MethodArgs<P>): Promise<Result<N>>;
}

/** Brands {@link PaginatedMethod}; it exists only in the types. */
declare const paginated: unique symbol;

/** A paginated method, which {@link pages} calls for each page. */
export interface PaginatedMethod<N extends PaginatedMethodId, P = Params<N>> extends Method<N, P> {
	/** Marks the method as paginated. */
	readonly [paginated]: N;
}

/** A paginated method's params for {@link pages}, e.g. `PageParams<"list.listTasks">`. */
export type PageParams<N extends PaginatedMethodId, P = Params<N>> = SetOptional<P, MethodTypeMap[N]["pageParam"]>;

/** A method, re-typed for a client that auto-fills its workspace ID. */
type WorkspaceMethod<F> =
	// `any` params, as matching against the default `Params<N>` would compute every method's params
	F extends PaginatedMethod<infer N extends PaginatedMethodId, any>
		? PaginatedMethod<N, WorkspaceParams<N>>
		: F extends Method<infer N extends MethodId, any>
			? Method<N, WorkspaceParams<N>>
			: F;

/** A client re-typed for auto-filling its workspace ID. */
export type WithWorkspace<C> = {
	[K in keyof C]: K extends keyof Namespaces ? { [M in keyof C[K]]: WorkspaceMethod<C[K][M]> } : C[K];
};
