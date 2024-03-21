import { ClientOptions, RequestOptions } from './types';
import {
	Authorization,
	Checklist,
	Comment,
	Folder,
	Group,
	Goal,
	KeyResult,
	List,
	Space,
	Task,
	Team,
	View,
	Webhook,
} from './routes/index.js';

/**
 * The default globals supplied to the client
 */
const defaultOptions: Partial<ClientOptions> = {
	globals: {
		fetch: globalThis.fetch,
		URL: globalThis.URL,
	},
	request: {
		baseURL: 'https://api.clickup.com/api/v2/',
	},
};

export class Clickup {
	private options: ClientOptions;
	private access_token?: string;
	authorization: Authorization;
	checklist: Checklist;
	comment: Comment;
	folder: Folder;
	group: Group;
	goal: Goal;
	keyResult: KeyResult;
	list: List;
	space: Space;
	task: Task;
	team: Team;
	view: View;
	webhook: Webhook;

	/**
	 *  Creates a client instance that connects to the Clickup API
	 **/
	constructor(options: Partial<ClientOptions> = {}) {
		this.options = { ...defaultOptions, ...options } as ClientOptions;

		// pull in all routes
		/**
		 * authorization
		 */
		this.authorization = new Authorization(this);
		/**
		 * checklist
		 */
		this.checklist = new Checklist(this);
		/**
		 * comment
		 */
		this.comment = new Comment(this);
		/**
		 * folder
		 */
		this.folder = new Folder(this);
		/**
		 * group
		 */
		this.group = new Group(this);
		/**
		 * goal
		 */
		this.goal = new Goal(this);
		/**
		 * keyResult
		 */
		this.keyResult = new KeyResult(this);
		/**
		 * list
		 */
		this.list = new List(this);
		/**
		 * space
		 */
		this.space = new Space(this);
		/**
		 * task
		 */
		this.task = new Task(this);
		/**
		 * team
		 */
		this.team = new Team(this);
		/**
		 * view
		 */
		this.view = new View(this);
		/**
		 * webhook
		 */
		this.webhook = new Webhook(this);
	}

	get token(): string | undefined {
		return this.access_token;
	}

	set token(token: string) {
		this.access_token = token;
	}

	async request<Output = any>(options: RequestOptions): Promise<Output> {
		if (!options.headers) {
			options.headers = {};
		}

		if ('Content-Type' in options.headers === false) {
			options.headers['Content-Type'] = 'application/json';
		}

		if (this.access_token) {
			options.headers.Authorization = `Bearer ${this.access_token}`;
		}

		const requestURL = this.getRequestURL(options.path, options.params);

		const fetchOptions: RequestInit = {
			method: options.method ?? 'GET',
			headers: options.headers ?? {},
		};

		if (options.body) {
			fetchOptions.body = options.body;
		}

		// apply onRequest hooks
		if (options.onRequest) {
			await options.onRequest(requestURL, fetchOptions);
		}

		if (this.options.request.onRequest) {
			await this.options.request.onRequest(requestURL, fetchOptions);
		}

		const response = await this.options.globals.fetch(requestURL, fetchOptions);

		if (!response.ok) {
			throw response;
		}

		const result = response.json();

		// apply onResponse hooks
		if (options.onResponse) {
			await options.onResponse(result, fetchOptions);
		}

		// apply global onResponse hook
		if (this.options.request.onResponse) {
			await this.options.request.onResponse(result, fetchOptions);
		}

		return result as Output;
	}

	getRequestURL(path: string, params?: Record<string, any>): URL {
		const url = new this.options.globals.URL(path, this.options.request.baseURL);

		if (params) {
			for (let key in params) {
				if (Object.prototype.hasOwnProperty.call(params, key)) {
					const value = params[key];

					if (Array.isArray(value)) {
						// LHS bracket notation requires array values to have a key value pair per element.
						// Each key must be suffixed by []
						if (!key.endsWith('[]')) {
							key += '[]';
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
