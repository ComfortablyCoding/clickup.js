import type { WorkspaceOptions } from "./client.ts";
import type { ClickUpRequestInput } from "./transport/http.ts";

/** A list endpoint's `x-sdk-pagination`: how `pages()` asks for the next page. */
export type Pagination =
	| {
			/** The next `page`, counting from 0, until `last` or an empty page */
			style: "page";
			/** The response field that holds a page's items */
			items: string;
			/** The response field that's true on the last page */
			last?: string;
	  }
	| {
			/** Fields of the page's last item, sent as params, until a page is empty */
			style: "keyset";
			/** The response field that holds a page's items */
			items: string;
			/** Each param, mapped to the field of the last item it's read from */
			from: Record<string, string>;
	  }
	| {
			/** The response's `next_cursor`, sent as `cursor`, until there isn't one */
			style: "cursor";
			/** The response field that holds a page's items */
			items: string;
	  };

/** How to send a method's calls. The generated route table has one for each method. */
export interface Route {
	/** The HTTP method */
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	/** Relative to the base URL, with `{param}` placeholders */
	path: string;
	/** Every param the route takes, and where it goes */
	bindings: Record<string, "path" | "query" | "body">;
	/** The params a call must include, path params first in the URL's order */
	required?: readonly string[];
	/** How the body is taken: `json` makes each field a param, while `raw` (like a list) and `multipart` (a `FormData`) take it whole as `data` */
	body?: "json" | "raw" | "multipart";
	/** How the endpoint pages, for `pages()` */
	pagination?: Pagination;
}

/** Fills in the client's workspace where the route takes it and the call leaves it out. */
export function withWorkspace(
	input: Record<string, unknown>,
	takes: Route["bindings"],
	workspace: WorkspaceOptions = {},
): Record<string, unknown> {
	const filled = { ...input };

	if (workspace.id !== undefined) {
		if (takes.team_id) {
			filled.team_id ??= workspace.id;
		}

		if (takes.workspace_id) {
			filled.workspace_id ??= workspace.id;
		}
	}

	if (workspace.customTaskIds && takes.custom_task_ids) {
		filled.custom_task_ids ??= true;
	}

	return filled;
}

/** Puts each of a call's params where its route binds it, throwing a TypeError for a missing or unknown one. */
export function toRequest(route: Route, input: Record<string, unknown>): ClickUpRequestInput {
	const values: Record<"path" | "query" | "body", Record<string, unknown>> = {
		path: {},
		query: {},
		body: {},
	};

	for (const name of route.required ?? []) {
		if (input[name] === undefined) {
			throw new TypeError(`${route.method} ${route.path} requires ${name}`);
		}
	}

	for (const [key, value] of Object.entries(input)) {
		const binding = route.bindings[key];

		if (!binding) {
			throw new TypeError(`${route.method} ${route.path} doesn't take ${key}`);
		}

		values[binding][key] = value;
	}

	let data: ClickUpRequestInput["data"];

	if (route.body === "json") {
		data = values.body;
	} else if (route.body) {
		data = values.body.data as ClickUpRequestInput["data"];
	}

	return {
		method: route.method,
		path: withPath(route.path, values.path),
		query: values.query,
		data,
	};
}

/** Fills a path's `{name}` placeholders, URL-encoding each value. */
export function withPath(path: string, params: Record<string, unknown>): string {
	return Object.entries(params).reduce(
		(filled, [name, value]) => filled.replace(`{${name}}`, encodeURIComponent(String(value))),
		path,
	);
}
