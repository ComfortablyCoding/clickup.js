class Lists {
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
		this.route = 'list';
	}

	/**
	 * Get a list
	 *
	 * @param {Number} listId The list id
	 */
	async get(listId) {
		return this._request.get({
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
		return this._request.put({
			endpoint: `${this.route}/${listId}`,
			data,
		});
	}

	/**
	 * Delete a list
	 *
	 * @param {Number} listId The list id
	 */
	async delete(listId) {
		return this._request.delete({
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
		return this._request.post({
			endpoint: `${this.route}/${listId}/comment`,
			data,
		});
	}

	/**
	 * Get all comments on a list
	 *
	 * @param {Number} listId The list id
	 */
	async getComments(listId) {
		return this._request.get({
			endpoint: `${this.route}/${listId}/comment`,
		});
	}

	/**
	 * Get all accessible custom fields of a list
	 *
	 * @param {Number} listId The list id
	 */
	async getAccessibleCustomFields(listId) {
		return this._request.get({
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
		return this._request.post({
			endpoint: `${this.route}/${listId}/guest/${guestId}`,
			data,
		});
	}

	/**
	 * Remove a guest from a list
	 *
	 * @param {Number} listId The list id
	 * @param {Number} guestId The guest id
	 */
	async removeGuest(listId, guestId) {
		return this._request.delete({
			endpoint: `${this.route}/${listId}/guest/${guestId}`,
		});
	}

	/**
	 * Get all members of a list
	 *
	 * @param {Number} listId The list id
	 */
	async getMembers(listId) {
		return this._request.get({
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
		return this._request.post({
			endpoint: `${this.route}/${listId}/task`,
			data,
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
		return this._request.get({
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
		return this._request.post({
			endpoint: `${this.route}/${listId}/taskTemplate/${templateId}`,
			data,
		});
	}

	/**
	 * Create a view for a list
	 *
	 * @param {Number} listId The list id
	 * @param {Object} data The view data
	 */
	async createView(listId, data) {
		return this._request.post({
			endpoint: `${this.route}/${listId}/view`,
			data,
		});
	}

	/**
	 * Get all views for a list
	 *
	 * @param {Number} listId The list id
	 */
	async getViews(listId) {
		return this._request.get({
			endpoint: `${this.route}/${listId}/view`,
		});
	}

	/**
	 * Add task to a list
	 *
	 * @param {String} listId The list id
	 * @param {String} taskId The task id
	 */
	async addTaskToList(listId, taskId) {
		return this._request.post({
			endpoint: `${this.route}/${listId}/task/${taskId}`,
		});
	}

	/**
	 * Remove a task from a list
	 *
	 * @param {Sting} listId The list id
	 * @param {String} taskId The task id
	 */
	async removeTaskFromList(listId, taskId) {
		return this._request.delete({
			endpoint: `${this.route}/${listId}/task/${taskId}`,
		});
	}

	/**
	 * Get list members
	 *
	 * @param {String} listId The list id
	 */
	async getListMembers(listId) {
		return this._request.get({
			endpoint: `${this.route}/${listId}/member`,
		});
	}
}

module.exports = Lists;
