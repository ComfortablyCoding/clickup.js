import { ClientOptions, RequestOptions } from './types';
import {
	Authorization,
	Checklists,
	Comments,
	Folders,
	Goals,
	KeyResults,
	Lists,
	Spaces,
	Tasks,
	Teams,
	Views,
	Webhooks,
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
		baseURL: 'https://api.clickup.com/api/v2',
	},
};

export class Clickup {
	private options: ClientOptions;
	private access_token?: string;
	authorization: Authorization;
	checklists: Checklists;
	comments: Comments;
	folders: Folders;
	goals: Goals;
	keyResults: KeyResults;
	lists: Lists;
	spaces: Spaces;
	tasks: Tasks;
	teams: Teams;
	views: Views;
	webhooks: Webhooks;

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
		 * checklists
		 */
		this.checklists = new Checklists(this);
		/**
		 * comments
		 */
		this.comments = new Comments(this);
		/**
		 * folders
		 */
		this.folders = new Folders(this);
		/**
		 * goals
		 */
		this.goals = new Goals(this);
		/**
		 * keyResults
		 */
		this.keyResults = new KeyResults(this);
		/**
		 * lists
		 */
		this.lists = new Lists(this);
		/**
		 * spaces
		 */
		this.spaces = new Spaces(this);
		/**
		 * tasks
		 */
		this.tasks = new Tasks(this);
		/**
		 * teams
		 */
		this.teams = new Teams(this);
		/**
		 * views
		 */
		this.views = new Views(this);
		/**
		 * webhooks
		 */
		this.webhooks = new Webhooks(this);
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
			options.headers['Authorization'] = `Bearer ${this.access_token}`;
		}

		let requestURL = this.getRequestURL(options.path, options.params);

		let fetchOptions: RequestInit = {
			method: options.method ?? 'GET',
			headers: options.headers ?? {},
		};

		if (options.body) {
			fetchOptions['body'] = options.body;
		}

		// apply onRequest hooks
		if (options.onRequest) {
			await options.onRequest(requestURL, fetchOptions);
		}

		if (this.options.request.onRequest) {
			await this.options.request.onRequest(requestURL, fetchOptions);
		}

		let response = await this.options.globals.fetch(requestURL, fetchOptions);

		if (!response.ok) {
			throw response;
		}

		let result = response.json();

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
						// LHS array values should have a key value pair per element.
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
