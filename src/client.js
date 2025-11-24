import PQueue from "p-queue";
import Authorization from "./routes/authorization.js";
import Checklist from "./routes/checklist.js";
import Comment from "./routes/comment.js";
import Folder from "./routes/folder.js";
import Goal from "./routes/goal.js";
import Group from "./routes/group.js";
import KeyResult from "./routes/key-result.js";
import List from "./routes/list.js";
import Space from "./routes/space.js";
import Task from "./routes/task.js";
import Team from "./routes/team.js";
import View from "./routes/view.js";
import Webhook from "./routes/webhook.js";
import { FetchError, ofetch } from "ofetch";
import { ClickupAPIError } from "./error.js";

/**
 * The default globals supplied to the client
 */
const defaultOptions = {
	request: {
		prefixUrl: "https://api.clickup.com/api/",
	},
	rateLimit: {
		requests: 100,
		interval: 60_00,
	},
	hooks: {},
};

/**
 * @class
 */
export class Clickup {
	/**
	 *  Creates a client instance that connects to the Clickup API
	 *
	 * @constructor
	 * @param {object} [options] Clickup Constructor options
	 * @param {string} [options.token] Clickup Access Token
	 * @param {object} [options.request] The request options
	 * @param {string} [options.request.prefixUrl=https://api.clickup.com/api] The clickup API URL
	 * @param {string} [options.rateLimit] The clickup API URL
	 * @param {object} [options.hooks] The hooks for extending functionality
	 */
	constructor(options = {}) {
		this.options = { ...defaultOptions, ...options };

		this.queue = new PQueue({
			concurrency: options.rateLimit?.requests ?? 100,
			interval: options.rateLimit?.interval ?? 60_000,
			carryoverConcurrencyCount: true,
		});

		this.token = this.options.token ?? process.env["CLICKUP_TOKEN"] ?? null;

		// routes

		/**
		 * authorization
		 *
		 * @type {Authorization}
		 * @public
		 */
		this.authorization = new Authorization(this);

		/**
		 * checklist
		 *
		 * @type {Checklist}
		 * @public
		 */
		this.checklist = new Checklist(this);

		/**
		 * comment
		 *
		 * @type {Comment}
		 * @public
		 */
		this.comment = new Comment(this);

		/**
		 * folder
		 *
		 * @type {Folder}
		 * @public
		 */
		this.folder = new Folder(this);

		/**
		 * goal
		 *
		 * @type {Goal}
		 * @public
		 */
		this.goal = new Goal(this);

		/**
		 * group
		 *
		 * @type {Group}
		 * @public
		 */
		this.group = new Group(this);

		/**
		 * keyResult
		 *
		 * @type {KeyResult}
		 * @public
		 */
		this.keyResults = new KeyResult(this);

		/**
		 * list
		 *
		 * @type {List}
		 * @public
		 */
		this.list = new List(this);

		/**
		 * space
		 *
		 * @type {Space}
		 * @public
		 */
		this.space = new Space(this);

		/**
		 * task
		 *
		 * @type {Task}
		 * @public
		 */
		this.task = new Task(this);

		/**
		 * team
		 *
		 * @type {Team}
		 * @public
		 */
		this.team = new Team(this);

		/**
		 * view
		 *
		 * @type {View}
		 * @public
		 */
		this.view = new View(this);

		/**
		 * webhook
		 *
		 * @type {Webhook}
		 * @public
		 */
		this.webhook = new Webhook(this);
	}

	/**
	 * Set the access token
	 *
	 * @param {string} token
	 * @returns {void}
	 */
	seToken(token) {
		this.token = token;
	}

	/**
	 *
	 * @param {object} options
	 * @param {string} [options.method] The request method
	 * @param {string} [options.path] The request url path
	 * @param {object} [options.headers] The request headers
	 * @param {object} [options.query] The request parameters
	 * @param {object} [options.body] The request body
	 */
	async request(options) {
		let fetchOptions = {
			method: options.method ?? "GET",
			path: options.path,
			query: options.query,
			headers: {},
		};

		if (options.headers) {
			fetchOptions.headers = options.headers;
		}

		// default response type to json
		if ("Content-Type" in fetchOptions.headers === false) {
			fetchOptions.headers["Content-Type"] = "application/json";
		}

		if (this.token) {
			fetchOptions.headers.Authorization = this.token;
		}

		if (options.body) {
			fetchOptions.body = options.body;

			if (!(options.body instanceof FormData)) {
				// convert camel case key to snake_case
				const body = {};
				for (const [key, value] of Object.entries(options.body)) {
					body[this.cameltoSnakeCase(key)] = value;
				}

				fetchOptions.body = body;
			}
		}

		if (this.options.hooks?.onRequest) {
			await this.options.hooks.onRequest({ request: fetchOptions });
		}

		const { path, query, ...ofetchOptions } = fetchOptions;

		const requestURL = this.buildRequestUrl(this.options.request.prefixUrl, path, query);

		return this.queue.add(async () => {
			try {
				let data = await ofetch(requestURL, ofetchOptions);

				if (this.options.hooks?.onResponse) {
					data = await this.options.hooks.onResponse({ request: fetchOptions, data });
				}

				return data;
			} catch (error) {
				if (error instanceof FetchError) {
					throw new ClickupAPIError({
						status: error.status,
						message: `${error.statusText}${error.data?.err ? `: ${error.data.err}` : ""}`,
						code: error.data?.code,
					});
				}

				throw error;
			}
		});
	}

	/**
	 *
	 * @param {string} prefixUrl The base URL
	 * @param {string} path The request URL path
	 * @param {object} [query] The request URL parameters
	 * @returns {URL}
	 */
	buildRequestUrl(prefixUrl, path, query) {
		const url = new URL(path, prefixUrl);

		for (let [key, value] of Object.entries(query ?? {})) {
			// convert camel case key to snake_case
			key = this.cameltoSnakeCase(key);

			if (Array.isArray(value)) {
				// LHS bracket notation requires array values to have a key value pair per element.
				// Each key must be suffixed by []
				if (!key.endsWith("[]")) {
					key += "[]";
				}

				for (const entry of value) {
					url.searchParams.append(key, entry);
				}
			} else {
				url.searchParams.set(key, value);
			}
		}

		return url;
	}

	/**
	 *
	 * Convert a camel case string to snake case
	 *
	 * @param {string} value
	 * @returns {string}
	 */
	cameltoSnakeCase(value) {
		return value.replace(/([A-Z])/g, "_$1").toLowerCase();
	}
}
