class Folders {
	/**
	 * @constructor
	 * @param {Client} client A client instance
	 */
	constructor(client) {
		this._client = client;
		this.route = 'folder';
	}

	/**
	 * Get a folder
	 *
	 * @param {Number} folderId The folder id
	 */
	async get(folderId) {
		return this._client.get({
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
		return this._client.put({
			endpoint: `${this.route}/${folderId}`,
			body: data,
		});
	}

	/**
	 * Delete a folder
	 *
	 * @param {Number} folderId The folder id
	 */
	async delete(folderId) {
		return this._client.delete({
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
		return this._client.post({
			endpoint: `${this.route}/${folderId}/guest/${guestId}`,
			body: data,
		});
	}

	/**
	 * Remove a guest from a folder
	 *
	 * @param {Number} folderId The folder id
	 * @param {Number} guestId The guest id
	 */
	async removeGuest(folderId, guestId) {
		return this._client.delete({
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
		return this._client.post({
			endpoint: `${this.route}/${folderId}/list`,
			body: data,
		});
	}

	/**
	 * Get all lists in a folder
	 *
	 * @param {Number} folderId The folder id
	 * @param {Boolean} [archived=false] If archived lists should be returned or not
	 */
	async getLists(folderId, archived = false) {
		return this._client.get({
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
		return this._client.post({
			endpoint: `${this.route}/${folderId}/view`,
			body: data,
		});
	}

	/**
	 * Get all views for a folder
	 *
	 * @param {Number} folderId The folder id
	 */
	async getViews(folderId) {
		return this._client.get({
			endpoint: `${this.route}/${folderId}/view`,
		});
	}
}

module.exports = Folders;
