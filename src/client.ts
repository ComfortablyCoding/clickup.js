import { defu } from "defu";
import { pRateLimit } from "p-ratelimit";
import Authorization from "./routes/authorization.ts";
import Checklist from "./routes/checklist.ts";
import Comment from "./routes/comment.ts";
import Folder from "./routes/folder.ts";
import Goal from "./routes/goal.ts";
import Group from "./routes/group.ts";
import KeyResult from "./routes/key-result.ts";
import List from "./routes/list.ts";
import Space from "./routes/space.ts";
import Task from "./routes/task.ts";
import Team from "./routes/team.ts";
import View from "./routes/view.ts";
import Webhook from "./routes/webhook.ts";
import { ClickupAPIError } from "./error.ts";
import { buildRequestUrl, camelToSnakeCase } from "./utils.ts";
import type { ClickupOptions, FetchOptions, ResolvedOptions, RequestOptions } from "./types.ts";

/**
 * The default globals supplied to the client
 */
const defaultOptions: ResolvedOptions = {
	request: {
		prefixUrl: "https://api.clickup.com/api/",
	},
	rateLimit: {
		requests: 100,
		interval: 60_000,
	},
	hooks: {},
};

/**
 * @class
 */
export class Clickup {
	options: ResolvedOptions;
	limiter: <T>(fn: () => Promise<T>) => Promise<T>;
	fetch: typeof globalThis.fetch;
	token: string | null;

	/** @type {Authorization} @public */
	authorization: Authorization;
	/** @type {Checklist} @public */
	checklist: Checklist;
	/** @type {Comment} @public */
	comment: Comment;
	/** @type {Folder} @public */
	folder: Folder;
	/** @type {Goal} @public */
	goal: Goal;
	/** @type {Group} @public */
	group: Group;
	/** @type {KeyResult} @public */
	keyResult: KeyResult;
	/** @type {List} @public */
	list: List;
	/** @type {Space} @public */
	space: Space;
	/** @type {Task} @public */
	task: Task;
	/** @type {Team} @public */
	team: Team;
	/** @type {View} @public */
	view: View;
	/** @type {Webhook} @public */
	webhook: Webhook;

	/**
	 * Creates a client instance that connects to the Clickup API
	 *
	 * @constructor
	 * @param {ClickupOptions} [options] Clickup Constructor options
	 * @param {string} [options.token] Clickup Access Token
	 * @param {object} [options.request] The request options
	 * @param {string} [options.request.prefixUrl=https://api.clickup.com/api] The clickup API URL
	 * @param {Function} [options.fetch] Custom fetch implementation (defaults to globalThis.fetch)
	 * @param {object} [options.rateLimit] The rate limit config
	 * @param {number} [options.rateLimit.requests] The number of requests allowed during the interval
	 * @param {number} [options.rateLimit.interval] The interval over which the requests cap is applied
	 * @param {object} [options.hooks] The hooks for extending functionality
	 */
	constructor(options: ClickupOptions = {}) {
		this.options = defu(options, defaultOptions) as ResolvedOptions;

		this.limiter = pRateLimit({
			interval: this.options.rateLimit.interval,
			rate: this.options.rateLimit.requests,
		});

		this.fetch = options.fetch ?? globalThis.fetch;
		this.token = this.options.token ?? process.env["CLICKUP_TOKEN"] ?? null;

		// routes
		this.authorization = new Authorization(this);
		this.checklist = new Checklist(this);
		this.comment = new Comment(this);
		this.folder = new Folder(this);
		this.goal = new Goal(this);
		this.group = new Group(this);
		this.keyResult = new KeyResult(this);
		this.list = new List(this);
		this.space = new Space(this);
		this.task = new Task(this);
		this.team = new Team(this);
		this.view = new View(this);
		this.webhook = new Webhook(this);
	}

	/**
	 * Set the access token
	 *
	 * @param {string} token
	 * @returns {void}
	 */
	setToken(token: string): void {
		this.token = token;
	}

	/**
	 * Make a request to the ClickUp API
	 *
	 * @param {RequestOptions} options
	 * @param {string} [options.method] The request method
	 * @param {string} options.path The request url path
	 * @param {Record<string, string>} [options.headers] The request headers
	 * @param {Record<string, unknown>} [options.query] The request parameters
	 * @param {Record<string, unknown> | FormData} [options.body] The request body
	 */
	async request(options: RequestOptions): Promise<unknown> {
		const fetchOptions: FetchOptions = {
			method: options.method ?? "GET",
			headers: { ...options.headers },
		};

		if (!("Content-Type" in fetchOptions.headers)) {
			fetchOptions.headers["Content-Type"] = "application/json";
		}

		if (this.token) {
			fetchOptions.headers.Authorization = this.token;
		}

		if (options.body) {
			if (options.body instanceof FormData) {
				fetchOptions.body = options.body;
			} else {
				const body: Record<string, unknown> = {};
				for (const [key, value] of Object.entries(options.body)) {
					body[camelToSnakeCase(key)] = value;
				}
				fetchOptions.body = JSON.stringify(body);
			}
		}

		if (this.options.hooks?.onRequest) {
			await this.options.hooks.onRequest({ request: fetchOptions });
		}

		const url = buildRequestUrl(this.options.request.prefixUrl, options.path, options.query);

		return this.limiter(async () => {
			const response = await this.fetch(url, fetchOptions as RequestInit);

			if (!response.ok) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const data: any = await response.json().catch(() => null);
				throw new ClickupAPIError({
					status: response.status,
					message: `${response.statusText}${data?.err ? `: ${data.err}` : ""}`,
					code: data?.ECODE ?? null,
				});
			}

			let data: unknown = await response.json();

			if (this.options.hooks?.onResponse) {
				data = await this.options.hooks.onResponse({
					request: fetchOptions,
					data,
				});
			}

			return data;
		});
	}
}
