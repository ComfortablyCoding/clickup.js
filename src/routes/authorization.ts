import { Clickup } from '../client';

export class Authorization {
	private client: Clickup;
	constructor(client: Clickup) {
		this.client = client;
	}

	/**
	 * Get the access token for the given client
	 *
	 * @param clientId Oauth app client id
	 * @param clientSecret Oauth app client secret
	 * @param code Code given in redirect url
	 */
	accessToken(clientId: string, clientSecret: string, code: string) {
		return this.client.request({
			method: 'POST',
			path: 'oauth/token',
			params: {
				client_id: clientId,
				client_secret: clientSecret,
				code,
			},
		});
	}

	/**
	 * Get the details of the authenticated user's ClickUp account
	 */
	getAuthorizedUser() {
		return this.client.request({
			path: 'user',
		});
	}

	/**
	 * Get the teams (workspaces) available to the authenticated user
	 */
	getAuthorizedTeams() {
		return this.client.request({
			path: 'team',
		});
	}
}