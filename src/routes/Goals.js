class Goals {
	/**
	 * @constructor
	 * @param {Client} client A client instance
	 */
	constructor(client) {
		this._client = client;
		this.route = 'goal';
	}

	/**
	 * Get a goal
	 *
	 * @param {String} goalId The goal id
	 */
	async get(goalId) {
		return this._client.get({
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
		return this._client.put({
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
		return this._client.delete({
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
		return this._client.post({
			endpoint: `${this.route}/${goalId}/key_result`,
			data,
		});
	}
}

module.exports = Goals;
