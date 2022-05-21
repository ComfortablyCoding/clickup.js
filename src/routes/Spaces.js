class Spaces {
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
		this.route = 'space';
	}

	/**
	 * Get a space
	 *
	 * @param {Number} spaceId The space id
	 */
	async get(spaceId) {
		return this._request.get({
			endpoint: `${this.route}/${spaceId}`,
		});
	}

	/**
	 * Update a space
	 *
	 * @param {Number} spaceId The space id
	 * @param {Object} data The space data
	 */
	async update(spaceId, data) {
		return this._request.put({
			endpoint: `${this.route}/${spaceId}`,
			data,
		});
	}

	/**
	 * Delete a space
	 *
	 * @param {Numnber} spaceId The space id
	 */
	async delete(spaceId) {
		return this._request.delete({
			endpoint: `${this.route}/${spaceId}`,
		});
	}

	/**
	 * Create a folder
	 *
	 * @param {Number} spaceId The space id
	 * @param {Object} data The folder data
	 */
	async createFolder(spaceId, data) {
		return this._request.post({
			endpoint: `${this.route}/${spaceId}/folder`,
			data,
		});
	}

	/**
	 * Get all folders in a space
	 *
	 * @param {Number} spaceId The space id
	 * @param {Boolean} [archived=false] If archived folders should be returned or not
	 */
	async getFolders(spaceId, archived = false) {
		return this._request.get({
			endpoint: `${this.route}/${spaceId}/folder`,
			params: {
				archived,
			},
		});
	}

	/**
	 * Create a folderless list
	 *
	 * @param {Number} spaceId The space id
	 * @param {Object} data The folderless list data
	 */
	async createFolderlessList(spaceId, data) {
		return this._request.post({
			endpoint: `${this.route}/${spaceId}/list`,
			data,
		});
	}

	/**
	 * Get all folderless lists in a space
	 *
	 * @param {Number} spaceId The space id
	 * @param {Boolean} [archived=false] If archived folderless lists should be returned or not
	 */
	async getFolderlessLists(spaceId, archived = false) {
		return this._request.get({
			endpoint: `${this.route}/${spaceId}/list`,
			params: {
				archived,
			},
		});
	}

	/**
	 * Get all tags in a space
	 *
	 * @param {Number} spaceId The space id
	 */
	async getTags(spaceId) {
		return this._request.get({
			endpoint: `${this.route}/${spaceId}/tag`,
		});
	}

	/**
	 * Create a space tag
	 *
	 * @param {Number} spaceId The space id
	 * @param {Object} data The space tag data
	 */
	async createTag(spaceId, data) {
		return this._request.post({
			endpoint: `${this.route}/${spaceId}/tag`,
			data,
		});
	}

	/**
	 * Update a space tag
	 *
	 * @param {Number} spaceId The space id
	 * @param {String} tagName The tag name
	 */
	async updateTag(spaceId, tagName) {
		return this._request.put({
			endpoint: `${this.route}/${spaceId}/tag/${tagName}`,
		});
	}

	/**
	 * Delete a space tag
	 *
	 * @param {Number} spaceId The space id
	 * @param {String} tagName The tag name
	 */
	async deleteTag(spaceId, tagName) {
		return this._request.delete({
			endpoint: `${this.route}/${spaceId}/tag/${tagName}`,
		});
	}

	/**
	 * Create a view for a space
	 *
	 * @param {Number} spaceId The space id
	 * @param {Object} data The view data
	 */
	async createView(spaceId, data) {
		return this._request.post({
			endpoint: `${this.route}/${spaceId}/view`,
			data,
		});
	}

	/**
	 * Get all views for a space
	 *
	 * @param {Number} spaceId The space id
	 */
	async getViews(spaceId) {
		return this._request.get({
			endpoint: `${this.route}/${spaceId}/view`,
		});
	}
}

module.exports = Spaces;
