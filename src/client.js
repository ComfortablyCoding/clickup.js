import got from "got";

import {
	Authorization,
	Checklist,
	Comment,
	Folder,
	Goal,
	Group,
	KeyResult,
	List,
	Space,
	Task,
	Team,
	View,
	Webhook,
} from "./routes/index.js";

/**
 * The default globals supplied to the client
 */
const defaultOptions = {
	request: {
		prefixUrl: "https://api.clickup.com/api/v2/",
	},
};

export class Clickup {
	/**
	 *  Creates a client instance that connects to the Clickup API
	 *
	 * @constructor
	 * @param {string} token Clickup API Access Token
	 * @param {object} options Clickup Constructor options
	 */
	constructor(options) {
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
		this.accessToken = token;
	}

	/**
	 *
	 * @param {object} options
	 * @param {string} [options.method] The request method
	 * @param {string} [options.path] The request url path
	 * @param {object} [options.headers] The request headers
	 * @param {object} [options.params] The request parameters
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
			fetchOptions.body = options.body;
		}

		if (this.options.request.hooks) {
			fetchOptions.hooks = this.options.request.hooks;
		}

		const requestURL = this.getRequestURL(options.path, options.params);

		try {
			const response = await got(requestURL, fetchOptions).json();
			return response;
		} catch (error) {}
	}

	/**
	 * @private
	 *
	 * @param {string} path The request URL path
	 * @param {object} [params] The request URL parameters
	 * @returns {URL}
	 */
	getRequestURL(path, params) {
		const url = new URL(path, this.options.request.prefixUrl);

		if (params) {
			for (let key in params) {
				if (Object.prototype.hasOwnProperty.call(params, key)) {
					const value = params[key];

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
			}
		}

		return url;
	}
}
