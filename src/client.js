import { defu } from "defu";
import { pRateLimit } from "p-ratelimit";
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
import { ClickupAPIError } from "./error.js";
import { buildRequestUrl, camelToSnakeCase } from "./utils.js";

/**
 * The default globals supplied to the client
 */
const defaultOptions = {
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
	/**
	 *  Creates a client instance that connects to the Clickup API
	 *
	 * @constructor
	 * @param {object} [options] Clickup Constructor options
	 * @param {string} [options.token] Clickup Access Token
	 * @param {object} [options.request] The request options
	 * @param {string} [options.request.prefixUrl=https://api.clickup.com/api] The clickup API URL
	 * @param {Function} [options.fetch] Custom fetch implementation (defaults to globalThis.fetch)
	 * @param {object} [options.rateLimit] The rate limit config
	 * @param {object} [options.rateLimit.requests] The number of requests allowed during the interval
	 * @param {object} [options.rateLimit.interval] The interval over which the requests cap is applied
	 * @param {object} [options.hooks] The hooks for extending functionality
	 */
	constructor(options = {}) {
		this.options = defu(options, defaultOptions);

		this.limiter = pRateLimit({
			interval: this.options.rateLimit.interval,
			rate: this.options.rateLimit.requests,
		});

		this.fetch = options.fetch ?? globalThis.fetch;
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
		this.keyResult = new KeyResult(this);

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
	setToken(token) {
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
		const fetchOptions = {
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
				const body = {};
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
			const response = await this.fetch(url, fetchOptions);

			if (!response.ok) {
				const data = await response.json().catch(() => null);
				throw new ClickupAPIError({
					status: response.status,
					message: `${response.statusText}${data?.err ? `: ${data.err}` : ""}`,
					code: data?.ECODE ?? null,
				});
			}

			let data = await response.json();

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
