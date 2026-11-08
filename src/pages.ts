import { ROUTE, type ClickUpRequestOptions } from "./client.ts";
import type { PaginatedMethodId } from "./generated/routes.gen.ts";
import type { Pagination, Route } from "./route.ts";
import type { MethodArgs, PageParams, PaginatedMethod, Result } from "./types.ts";
import { isObject } from "./utils.ts";

/** A method as `pages()` calls it, untyped. */
type UntypedMethod = (params: Record<string, unknown>, options?: ClickUpRequestOptions) => Promise<unknown>;

/**
 * Calls a paginated method once per page, so a `for await` loop reads every page.
 *
 * Each page is an ordinary call with the same options, so it retries, runs hooks and fills in the
 * workspace like any other. How the next page is requested depends on the endpoint: the next `page`
 * until `last_page` or an empty page; the response's `next_cursor` as `cursor` until there isn't one;
 * or, for comments, `start` and `start_id` from the last comment until a page comes back empty.
 * Breaking out of the loop stops it without another call.
 *
 * @param method A paginated method of a client, like `clickup.list.listTasks`
 * @param args The method's params, then options for every call. It starts at the first page unless the params pick another.
 * @throws TypeError when `method` isn't a paginated method of a client
 * @example
 * ```ts
 * for await (const { tasks } of pages(clickup.list.listTasks, { list_id: 901234 })) {
 * 	for (const task of tasks ?? []) console.log(task.name);
 * }
 * ```
 */
export function pages<N extends PaginatedMethodId, P>(
	method: PaginatedMethod<N, P>,
	...args: MethodArgs<PageParams<N, P>>
): AsyncGenerator<Result<N>, void, undefined> {
	const route = (method as { [ROUTE]?: Route })[ROUTE];

	if (!route?.pagination) {
		throw new TypeError("pages() takes a paginated method of a client, like clickup.list.listTasks");
	}

	const [params = {}, options] = args;

	return walk(method as unknown as UntypedMethod, route.pagination, params, options) as AsyncGenerator<
		Result<N>,
		void,
		undefined
	>;
}

/** Calls the method for each page, from the one `params` asks for to the last. */
async function* walk(
	call: UntypedMethod,
	pagination: Pagination,
	params: Record<string, unknown>,
	options?: ClickUpRequestOptions,
): AsyncGenerator<unknown, void, undefined> {
	// Pages count from 0, and some endpoints require `page`
	let input = pagination.style === "page" ? { ...params, page: params.page ?? 0 } : params;

	while (true) {
		const page = await call(input, options);

		yield page;

		const next = isObject(page) ? nextParams(pagination, page, input) : undefined;

		// Stop if the next page is this one, like a repeated cursor, or it would loop forever
		if (!next || Object.entries(next).every(([name, value]) => input[name] === value)) {
			return;
		}

		input = { ...input, ...next };
	}
}

/** The params to change for the next page, or `undefined` after the last one. */
function nextParams(
	pagination: Pagination,
	page: Record<string, unknown>,
	params: Record<string, unknown>,
): Record<string, unknown> | undefined {
	const items = page[pagination.items];

	switch (pagination.style) {
		case "page": {
			if (!Array.isArray(items) || items.length === 0 || (pagination.last && page[pagination.last])) {
				return undefined;
			}

			return { page: Number(params.page) + 1 };
		}
		case "cursor": {
			const cursor = page.next_cursor;

			return typeof cursor === "string" && cursor !== "" ? { cursor } : undefined;
		}
		case "keyset": {
			const last: unknown = Array.isArray(items) ? items.at(-1) : undefined;
			const fields = Object.entries(pagination.from);

			// Stop at an empty page, or a last item that's missing a keyset field
			if (!isObject(last) || fields.some(([, field]) => last[field] == null)) {
				return undefined;
			}

			return Object.fromEntries(fields.map(([param, field]) => [param, last[field]]));
		}
	}
}
