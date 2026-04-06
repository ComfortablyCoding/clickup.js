import { Route } from "../route.ts";
import type { Clickup } from "../client.ts";

/**
 * @module
 * @class
 * @extends Route
 */
export default class Authorization extends Route {
	/**
	 * @constructor
	 * @param {Clickup} client
	 */
	constructor(client: Clickup) {
		super({
			client,
		});
	}

	/**
	 * Create an access token for the given client
	 *
	 * @param {object} options The query parameters to pass
	 * @param {string} options.clientId The OAuth app client id
	 * @param {string} options.clientSecret The OAuth app client secret
	 * @param {string} options.code The code given in redirect url
	 */
	createToken(options: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			method: "POST",
			path: `${this.version}/oauth/token`,
			query: {
				client_id: options.clientId,
				client_secret: options.clientSecret,
				code: options.code,
			},
		});
	}

	/**
	 * Get the details of the authenticated user's ClickUp account
	 */
	user(): Promise<unknown> {
		return this.client.request({
			path: `${this.version}/user`,
		});
	}

	/**
	 * Get the teams (workspaces) available to the authenticated user
	 */
	teams(): Promise<unknown> {
		return this.client.request({
			path: `${this.version}/team`,
		});
	}
}
