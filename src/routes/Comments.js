class Comments {
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
		this.route = 'comment';
	}

	/**
	 * Update a comment
	 *
	 * @param {Number} commentId The comment id
	 * @param {Object} data The comment data
	 */
	async update(commentId, data) {
		return this._request.put({
			endpoint: `${this.route}/${commentId}`,
			data,
		});
	}

	/**
	 * Delete a comment
	 *
	 * @param {Number} commentId The comment id
	 */
	async delete(commentId) {
		return this._request.delete({
			endpoint: `${this.route}/${commentId}`,
		});
	}
}

module.exports = Comments;
