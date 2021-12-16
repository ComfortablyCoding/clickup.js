class Webhooks {
	/**
	 * @constructor
	 * @param {Request} request A request instance
	 */
	constructor(request) {
		/**
		 * A request instance
		 * @type {Request}
		 * @private
		 */
		this._request = request;
		/**
		 * The main route for the collection
		 * @type {String}
		 */
		this.route = 'webhook';
	}

	/**
	 * Update a webhook
	 *
	 * @param {String} webhookId The webhook id
	 * @param {Object} data The webhook data
	 */
	async update(webhookId, data) {
		return this._request.put({
			endpoint: `${this.route}/${webhookId}`,
			data,
		});
	}

	/**
	 * Delete a webhook
	 *
	 * @param {String} webhookId The webhook id
	 */
	async delete(webhookId) {
		return this._request.delete({
			endpoint: `${this.route}/${webhookId}`,
		});
	}
}

module.exports = Webhooks;
