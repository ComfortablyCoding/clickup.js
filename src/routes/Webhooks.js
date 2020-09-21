class Webhooks {
	/**
	 * @constructor
	 * @param {Client} client A client instance
	 */
	constructor(client) {
		this._client = client;
		this.route = 'webhook';
	}

	/**
	 * Update a webhook
	 *
	 * @param {String} webhookId The webhook id
	 * @param {Object} data The webhook data
	 */
	async update(webhookId, data) {
		return this._client.put({
			endpoint: `${this.route}/${webhookId}`,
			json: data,
		});
	}

	/**
	 * Delete a webhook
	 *
	 * @param {String} webhookId The webhook id
	 */
	async delete(webhookId) {
		return this._client.delete({
			endpoint: `${this.route}/${webhookId}`,
		});
	}
}

module.exports = Webhooks;
