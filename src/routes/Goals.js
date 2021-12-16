class Goals {
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
		this.route = 'goal';
	}

	/**
	 * Get a goal
	 *
	 * @param {String} goalId The goal id
	 */
	async get(goalId) {
		return this._request.get({
			endpoint: `${this.route}/${goalId}`,
		});
	}

	/**
	 * Update a goal
	 *
	 * @param {String} goalId The goal id
	 * @param {Object} data The goal data
	 */
	async update(goalId, data) {
		return this._request.put({
			endpoint: `${this.route}/${goalId}`,
			data,
		});
	}

	/**
	 * Delete a goal
	 *
	 * @param {String} goalId The goal id
	 */
	async delete(goalId) {
		return this._request.delete({
			endpoint: `${this.route}/${goalId}`,
		});
	}

	/**
	 * Create a key result
	 *
	 * @param {String} goalId The goal id
	 * @param {Object} data The key result data
	 */
	async createKeyResult(goalId, data) {
		return this._request.post({
			endpoint: `${this.route}/${goalId}/key_result`,
			data,
		});
	}
}

module.exports = Goals;
