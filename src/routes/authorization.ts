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
	async accessToken(clientId: string, clientSecret: string, code: string) {
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
	 * Get the user that this token belongs to
	 */
	async getAuthorizedUser() {
		return this.client.request({
			path: 'user',
		});
	}

	/**
	 * Get the authorized teams for this token
	 */
	async getAuthorizedTeams() {
		return this.client.request({
			path: 'team',
		});
	}
}
