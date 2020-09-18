class Comments {
	/**
	 * @constructor
	 * @param {Client} client A client instance
	 */
	constructor(client) {
		this._client = client;
		this.route = 'comment';
	}

	/**
	 * Update a comment
	 *
	 * @param {Number} commentId The comment id
	 * @param {Object} data The comment data
	 */
	async update(commentId, data) {
		return this._client.put({
			endpoint: `${this.route}/${commentId}`,
			body: data,
		});
	}

	/**
	 * Delete a comment
	 *
	 * @param {Number} commentId The comment id
	 */
	async delete(commentId) {
		return this._client.delete({
			endpoint: `${this.route}/${commentId}`,
		});
	}
}

module.exports = Comments;
