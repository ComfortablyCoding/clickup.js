class KeyResults {
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
		this.route = 'key_result';
	}

	/**
	 * Update a key result
	 *
	 * @param {String} keyResultId The key result id
	 * @param {Object} data The key result data
	 */
	updateKeyResult(keyResultId, data) {
		return this._request.put({
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
		return this._request.delete({
			endpoint: `${this.route}/${keyResultId}`,
		});
	}
}
module.exports = KeyResults;
