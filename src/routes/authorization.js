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
	 * Get the access token for the given client
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetAccessToken}
	 *
	 * @param {object} params The query parameters to pass
	 * @param {string} params.client_id The OAuth app client id
	 * @param {string} params.client_secret The OAuth app client secret
	 * @param {string} params.code The code given in redirect url
	 */
	accessToken(params) {
		return this.client.request({
			method: "POST",
			path: "oauth/token",
			params,
		});
	}

	/**
	 * Get the details of the authenticated user's ClickUp account
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetAuthorizedUser}
	 */
	user() {
		return this.client.request({
			path: "user",
		});
	}

	/**
	 * Get the teams (workspaces) available to the authenticated user
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetAuthorizedTeams}
	 */
	teams() {
		return this.client.request({
			path: "team",
		});
	}
}
