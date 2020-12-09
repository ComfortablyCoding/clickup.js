class KeyResults {
	/**
	 * @constructor
	 * @param {Client} client A client instance
	 */
	constructor(client) {
		this._client = client;
		this.route = 'key_result';
	}

	/**
	 * Update a key result
	 *
	 * @param {String} keyResultId The key result id
	 * @param {Object} data The key result data
	 */
	updateKeyResult(keyResultId, data) {
		return this._client.put({
			endpoint: `${this.route}/${keyResultId}`,
			data,
		});
	}

	/**
	 * Delete a key result
	 *
	 * @param {String} keyResultId The key result id
	 */
	deleteKeyResult(keyResultId) {
		return this._client.delete({
			endpoint: `${this.route}/${keyResultId}`,
		});
	}
}
module.exports = KeyResults;
