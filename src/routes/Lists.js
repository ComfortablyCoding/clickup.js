class Lists {
	/**
	 * @constructor
	 * @param {Client} client A client instance
	 */
	constructor(client) {
		this._client = client;
		this.route = 'list';
	}

	/**
	 * Get a list
	 *
	 * @param {Number} listId The list id
	 */
	async get(listId) {
		return this._client.get({
			endpoint: `${this.route}/${listId}`,
		});
	}

	/**
	 * Update a list
	 *
	 * @param {Number} listId The list id
	 * @param {Object} data The list data
	 */
	async update(listId, data) {
		return this._client.put({
			endpoint: `${this.route}/${listId}`,
			body: data,
		});
	}

	/**
	 * Delete a list
	 *
	 * @param {Number} listId The list id
	 */
	async delete(listId) {
		return this._client.delete({
			endpoint: `${this.route}/${listId}`,
		});
	}

	/**
	 * Add a list comment
	 *
	 * @param {Number} listId The list id
	 * @param {Object} data The comment data
	 */
	async addComment(listId, data) {
		return this._client.post({
			endpoint: `${this.route}/${listId}/comment`,
			body: data,
		});
	}

	/**
	 * Get all comments on a list
	 *
	 * @param {Number} listId The list id
	 */
	async getComments(listId) {
		return this._client.get({
			endpoint: `${this.route}/${listId}/comment`,
		});
	}

	/**
	 * Get all accessible custom fields of a list
	 *
	 * @param {Number} listId The list id
	 */
	async getAccessibleCustomFields(listId) {
		return this._client.get({
			endpoint: `${this.route}/${listId}/field`,
		});
	}

	/**
	 * Add a guest to a list
	 *
	 * @param {Number} listId The list id
	 * @param {Number} guestId The guest id
	 * @param {Object} data The guest data
	 */
	async addGuest(listId, guestId, data) {
		return this._client.post({
			endpoint: `${this.route}/${listId}/guest/${guestId}`,
			body: data,
		});
	}

	/**
	 * Remove a guest from a list
	 *
	 * @param {Number} listId The list id
	 * @param {Number} guestId The guest id
	 */
	async removeGuest(listId, guestId) {
		return this._client.delete({
			endpoint: `${this.route}/${listId}/guest/${guestId}`,
		});
	}

	/**
	 * Get all members of a list
	 *
	 * @param {Number} listId The list id
	 */
	async getMembers(listId) {
		return this._client.get({
			endpoint: `${this.route}/${listId}/member`,
		});
	}

	/**
	 * Create a task
	 *
	 * @param {Number} listId The list id
	 * @param {Object} data The task data
	 */
	async createTask(listId, data) {
		return this._client.post({
			endpoint: `${this.route}/${listId}/task`,
			body: data,
		});
	}

	/**
	 * Get all tasks in a list
	 *
	 * @param {Number} listId The list id
	 * @param {Object} [options] The parameter options to pass in
	 */
	async getTasks(listId, options = {}) {
		// eslint-disable-next-line no-param-reassign
		options.archived = options.archived || false;
		return this._client.get({
			endpoint: `${this.route}/${listId}/task`,
			params: options,
		});
	}

	/**
	 * Create a task from a template
	 *
	 * @param {Number} listId The list id
	 * @param {String} templateId The template id
	 * @param {Object} data The task data
	 */
	async createTaskFromTemplate(listId, templateId, data) {
		return this._client.post({
			endpoint: `${this.route}/${listId}/taskTemplate/${templateId}`,
			body: data,
		});
	}

	/**
	 * Create a view for a list
	 *
	 * @param {Number} listId The list id
	 * @param {Object} data The view data
	 */
	async createView(listId, data) {
		return this._client.post({
			endpoint: `${this.route}/${listId}/view`,
			body: data,
		});
	}

	/**
	 * Get all views for a list
	 *
	 * @param {Number} listId The list id
	 */
	async getViews(listId) {
		return this._client.get({
			endpoint: `${this.route}/${listId}/view`,
		});
	}
}

module.exports = Lists;
