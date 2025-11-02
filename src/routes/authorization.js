import { Route } from "../route.js";

/**
 * @class
 * @extends Route
 */
export default class Authorization extends Route {
	/**
	 * @constructor
	 * @param {import('../client.js').Clickup} client
	 */
	constructor(client) {
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
	createToken(options) {
		return this.client.request({
			method: "POST",
			path: "/oauth/token",
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
	user() {
		return this.client.request({
			path: "/user",
		});
	}

	/**
	 * Get the teams (workspaces) available to the authenticated user
	 */
	teams() {
		return this.client.request({
			path: "/team",
		});
	}
}
