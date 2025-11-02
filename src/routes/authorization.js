import { Route } from "./route.js";

/**
 * @class
 * @extends Route
 */
export class Authorization extends Route {
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
	 * @param {object} params The query parameters to pass
	 * @param {string} params.clientId The OAuth app client id
	 * @param {string} params.clientSecret The OAuth app client secret
	 * @param {string} params.code The code given in redirect url
	 */
	createToken(params) {
		return this.client.request({
			method: "POST",
			path: "/oauth/token",
			params: {
				client_id: params.clientId,
				client_secret: params.clientSecret,
				code: params.code,
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
