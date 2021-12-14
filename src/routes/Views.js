class Views {
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
		this.route = 'view';
	}

	/**
	 * Get a view
	 *
	 * @param {String} viewId The view id
	 */
	async get(viewId) {
		return this._request.get({
			endpoint: `${this.route}/${viewId}`,
		});
	}

	/**
	 * Update a view
	 *
	 * @param {String} viewId The view id
	 * @param {Object} data The view data
	 */
	async update(viewId, data) {
		return this._request.put({
			endpoint: `${this.route}/${viewId}`,
			data,
		});
	}

	/**
	 * Delete a view
	 *
	 * @param {String} viewId The view id
	 */
	async delete(viewId) {
		return this._request.delete({
			endpoint: `${this.route}/${viewId}`,
		});
	}

	/**
	 * Add a comment on a view
	 *
	 * @param {String} viewId The view id
	 * @param {Object} data The comment data
	 */
	async addComment(viewId, data) {
		return this._request.post({
			endpoint: `${this.route}/${viewId}/comment`,
			data,
		});
	}

	/**
	 * Get all comments on a view
	 *
	 * @param {String} viewId The view id
	 */
	async getComments(viewId) {
		return this._request.get({
			endpoint: `${this.route}/${viewId}/comment`,
		});
	}

	/**
	 * Get all tasks in a view
	 *
	 * @param {String} viewId The view id
	 * @param {Integer} [page=0] The page to get
	 */
	async getTasks(viewId, page = 0) {
		return this._request.get({
			endpoint: `${this.route}/${viewId}/task`,
			params: {
				page,
			},
		});
	}
}

module.exports = Views;
