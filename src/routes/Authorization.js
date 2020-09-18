class Authorization {
	/**
	 * @constructor
	 * @param {Client} client A client instance
	 */
	constructor(client) {
		this._client = client;
	}

	/**
	 * Get the access token for the given client
	 *
	 * @param {String} clientId Oauth app client id
	 * @param {String} clientSecret Oauth app client secret
	 * @param {String} code Code given in redirect url
	 */
	async accessToken(clientId, clientSecret, code) {
		return this._client.post({
			endpoint: 'oauth/token',
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
		return this._client.get({
			endpoint: 'user',
		});
	}

	/**
	 * Get the authorized teams for this token
	 */
	async getAuthorizedTeams() {
		return this._client.get({
			endpoint: 'team',
		});
	}
}

module.exports = Authorization;
