import { routes, type Namespaces } from "./generated/routes.gen.ts";
import { toRequest, withWorkspace } from "./route.ts";
import { createTransport, type Transport } from "./transport/http.ts";
import type { WithWorkspace } from "./types.ts";
import { readFromEnv, withDefaults } from "./utils.ts";

/** The symbol each method keeps its route under, so `pages()` can find it. */
export const ROUTE: unique symbol = Symbol("route");

/** Options for {@link createClickUp}. */
export interface ClickUpOptions {
	/**
	 * A personal (`pk_...`) or OAuth token, or a function that's called before each request to get one.
	 * @default process.env.CLICKUP_TOKEN, where `process` exists
	 */
	token?: string | (() => string | Promise<string>);
	/** The workspace your calls run in. */
	workspace?: WorkspaceOptions;
	/** Defaults for every call, which a method's second argument can override. */
	request?: RequestDefaults;
	/** Functions that see, and can replace, every request and response. */
	hooks?: Hooks;
}

/** Options for the workspace a client's calls run in. */
export interface WorkspaceOptions {
	/** Fills in `team_id` and `workspace_id`, making them optional in the methods' types. */
	id?: string | number;
	/** Sends `custom_task_ids=true` wherever a task ID is taken, so IDs like `DEV-42` work. */
	customTaskIds?: boolean;
}

/** Options for a single call, passed as every method's second argument. */
export interface ClickUpRequestOptions {
	/** Cancels the call, including any retries and waits. The call rejects with the signal's reason. */
	signal?: AbortSignal;
	/** Milliseconds per attempt, including reading the response. @default 30_000 */
	timeout?: number;
	/** How many times to retry a 429, or a 408, 5xx (except 501 and 505) or network error on GET, PUT and DELETE. @default 2 */
	maxRetries?: number;
	/** Added to the client's headers. A `User-Agent` here replaces the default, `clickup.js/<version>`. */
	headers?: Record<string, string>;
}

/** Defaults for every call: the request options except `signal`, plus where calls are sent. */
export interface RequestDefaults extends Omit<ClickUpRequestOptions, "signal"> {
	/** Where calls are sent, with or without a trailing slash. @default "https://api.clickup.com/api" */
	baseUrl?: string;
}

/** Called on every attempt, retries included. */
export interface Hooks {
	/** Sees each request before it's sent, and can return a replacement. */
	onRequest?: (request: Request) => Request | void | Promise<Request | void>;
	/**
	 * Sees a copy of each response, so it can read the body, and may return a replacement for the
	 * call to read instead. The rate limit is still read from ClickUp's own response.
	 */
	onResponse?: (response: Response, request: Request) => Response | void | Promise<Response | void>;
}

/**
 * A ClickUp client with every endpoint as `clickup.<namespace>.<method>(params, options)`.
 * The [API reference](https://comfortablycoding.github.io/clickup.js/api/) lists every method.
 */
export interface ClickUp extends Namespaces {
	/** Calls any endpoint by path, untyped, for those ClickUp's spec doesn't describe yet. */
	request: Transport["request"];
}

/**
 * Creates a ClickUp client.
 *
 * @param options The token, workspace, request defaults and hooks
 * @example
 * ```ts
 * const clickup = createClickUp({ workspace: { id: 1234567 } });
 * const task = await clickup.task.get({ task_id: "86a1b2c3d" });
 * ```
 */
export function createClickUp(options: ClickUpOptions & { workspace: { id: string | number } }): WithWorkspace<ClickUp>;
export function createClickUp(options?: ClickUpOptions): ClickUp;
export function createClickUp(options: ClickUpOptions = {}): ClickUp | WithWorkspace<ClickUp> {
	const transport = createTransport({
		...withDefaults(REQUEST_DEFAULTS, options.request),
		token: options.token || readFromEnv("CLICKUP_TOKEN"),
		hooks: options.hooks ?? {},
	});

	const namespaces: Record<string, Record<string, unknown>> = {};

	for (const [name, route] of Object.entries(routes)) {
		const [namespace, method] = name.split(".");
		const call = (input: Record<string, unknown> = {}, callOptions?: ClickUpRequestOptions) =>
			transport.request(toRequest(route, withWorkspace(input, route.bindings, options.workspace)), callOptions);

		(namespaces[namespace] ??= {})[method] = Object.defineProperty(call, ROUTE, { value: route });
	}

	return { ...namespaces, request: transport.request } as unknown as ClickUp | WithWorkspace<ClickUp>;
}

/** What `options.request` falls back to. */
const REQUEST_DEFAULTS: Required<RequestDefaults> = {
	baseUrl: "https://api.clickup.com/api",
	timeout: 30_000,
	maxRetries: 2,
	headers: {},
};
