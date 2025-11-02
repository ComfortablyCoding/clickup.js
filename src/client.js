import got from "got";

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

import { camelToSnakeCase } from "./utils/camelToSnakeCase.js";

/**
 * The default globals supplied to the client
 */
const defaultOptions = {
	request: {
		prefixUrl: "https://api.clickup.com/api",
	},
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
	 * @param {object} [options.request.hooks] The request hooks @see {@link https://github.com/sindresorhus/got/blob/main/documentation/9-hooks.md}
	 */
	constructor(options = {}) {
		this.options = { ...defaultOptions, ...options };

		this.token = this.options.token || process.env["CLICKUP_TOKEN"] || null;

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
		};

		if (options.headers) {
			fetchOptions.headers = options.headers;
		}

		// default response type to json
		if ("Content-Type" in fetchOptions.headers === false) {
			fetchOptions.headers["Content-Type"] = "application/json";
		}

		if (this.token) {
			fetchOptions.headers.Authorization = `Bearer ${this.token}`;
		}

		if (options.body) {
			const body = {};
			// convert camel case key to snake_case
			if (fetchOptions.headers["Content-Type"] === "application/json") {
				for (const [key, value] of Object.entries(options.body)) {
					body[camelToSnakeCase(key)] = value;
				}
			} else {
				body = options.body;
			}

			fetchOptions.body = body;
		}

		if (this.options.request.hooks) {
			fetchOptions.hooks = this.options.request.hooks;
		}

		const requestURL = this.getRequestURL(options.path, options.query);

		try {
			const response = await got(requestURL, fetchOptions).json();
			return response;
		} catch (error) {}
	}

	/**
	 * @private
	 *
	 * @param {string} path The request URL path
	 * @param {object} [query] The request URL parameters
	 * @returns {URL}
	 */
	getRequestURL(path, query) {
		const url = new URL(path, this.options.request.prefixUrl);

		for (let [key, value] in Object.entries(query ?? {})) {
			// convert camel case key to snake_case
			key = camelToSnakeCase(key);

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
}
