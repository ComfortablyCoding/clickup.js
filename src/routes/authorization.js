import { Route } from "./route.js";

export class Authorization extends Route {
	constructor(client) {
		super({
			client,
		});
	}

	/**
	 * Get the access token for the given client
	 * @param {object} params The query parameters to pass
	 * @param {string} params.clientId The Oauth app client id
	 * @param {string} params.clientSecret The Oauth app client secret
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
	 */
	user() {
		return this.client.request({
			path: "user",
		});
	}

	/**
	 * Get the teams (workspaces) available to the authenticated user
	 */
	teams() {
		return this.client.request({
			path: "team",
		});
	}
}
