class Folders {
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
		this.route = 'folder';
	}

	/**
	 * Get a folder
	 *
	 * @param {Number} folderId The folder id
	 */
	async get(folderId) {
		return this._request.get({
			endpoint: `${this.route}/${folderId}`,
		});
	}

	/**
	 * Update a folder
	 *
	 * @param {Number} folderId The folder id
	 * @param {Object} data The folder data
	 */
	async update(folderId, data) {
		return this._request.put({
			endpoint: `${this.route}/${folderId}`,
			data,
		});
	}

	/**
	 * Delete a folder
	 *
	 * @param {Number} folderId The folder id
	 */
	async delete(folderId) {
		return this._request.delete({
			endpoint: `${this.route}/${folderId}`,
		});
	}

	/**
	 *Add a guest to a folder
	 *
	 * @param {Number} folderId The folder id
	 * @param {Number} guestId The guest id
	 * @param {Object} data The guest data
	 */
	async addGuest(folderId, guestId, data) {
		return this._request.post({
			endpoint: `${this.route}/${folderId}/guest/${guestId}`,
			data,
		});
	}

	/**
	 * Remove a guest from a folder
	 *
	 * @param {Number} folderId The folder id
	 * @param {Number} guestId The guest id
	 */
	async removeGuest(folderId, guestId) {
		return this._request.delete({
			endpoint: `${this.route}/${folderId}/guest/${guestId}`,
		});
	}

	/**
	 * Create a list
	 *
	 * @param {Number} folderId The folder id
	 * @param {Object} data The list data
	 */
	async createList(folderId, data) {
		return this._request.post({
			endpoint: `${this.route}/${folderId}/list`,
			data,
		});
	}

	/**
	 * Get all lists in a folder
	 *
	 * @param {Number} folderId The folder id
	 * @param {Boolean} [archived=false] If archived lists should be returned or not
	 */
	async getLists(folderId, archived = false) {
		return this._request.get({
			endpoint: `${this.route}/${folderId}/list`,
			params: {
				archived,
			},
		});
	}

	/**
	 * Create a view for a folder
	 *
	 * @param {Number} folderId The folder id
	 * @param {Object} data The view data
	 */
	async createView(folderId, data) {
		return this._request.post({
			endpoint: `${this.route}/${folderId}/view`,
			data,
		});
	}

	/**
	 * Get all views for a folder
	 *
	 * @param {Number} folderId The folder id
	 */
	async getViews(folderId) {
		return this._request.get({
			endpoint: `${this.route}/${folderId}/view`,
		});
	}
}

module.exports = Folders;
