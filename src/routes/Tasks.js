const { createReadStream } = require('fs');
const FormData = require('form-data');

class Tasks {
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
		this.route = 'task';
	}

	/**
	 * Get a task
	 *
	 * @param {String} taskId The task id
	 * @param {Object} [options] The parameter options to pass in
	 */
	async get(taskId, options) {
		return this._request.get({
			endpoint: `${this.route}/${taskId}`,
			params: options,
		});
	}

	/**
	 * Update a task
	 *
	 * @param {String} taskId The task id
	 * @param {Object} data The task data
	 * @param {Object} [options] The parameter options to pass in
	 */
	async update(taskId, data, options) {
		return this._request.put({
			endpoint: `${this.route}/${taskId}`,
			params: options,
			data,
		});
	}

	/**
	 * Delete a task
	 *
	 * @param {String} taskId The task id
	 * @param {Object} [options] The parameter options to pass in
	 */
	async delete(taskId, options) {
		return this._request.delete({
			endpoint: `${this.route}/${taskId}`,
			params: options,
		});
	}

	/**
	 * Add an attachment to a task
	 *
	 * @param {String} taskId The task id
	 * @param {Object} fileSettings The file settings
	 * @param {String} fileSettings.filePath The path to the file
	 * @param {String} fileSettings.fileName The name of the attachment file along with its extension type. Example: 'notes.txt'
	 * @param {Object} [options] The parameter options to pass in
	 */
	async addAttachment(taskId, fileSettings, options) {
		// ensure fileSettings are provided
		if (fileSettings) {
			if (!fileSettings.filePath) {
				throw new Error('A file path must be provided');
			}
			if (!fileSettings.fileName) {
				throw new Error('A file name must be provided');
			}
		} else {
			throw new Error('File settings must be provided');
		}

		// building form-data
		const form = new FormData();
		form.append('filename', fileSettings.fileName);
		form.append('attachment', createReadStream(fileSettings.filePath));

		// setting headers
		const headers = form.getHeaders();
		headers.authorization = this._request.getToken();

		return this._request.post({
			endpoint: `${this.route}/${taskId}/attachment`,
			params: options,
			data: form,
			headers,
		});
	}

	/**
	 * Add a comment to as task
	 *
	 * @param {String} taskId The task id
	 * @param {Object} data The comment data
	 * @param {Object} [options] The parameter options to pass in
	 */
	async addComment(taskId, data, options) {
		return this._request.post({
			endpoint: `${this.route}/${taskId}/comment`,
			params: options,
			data,
		});
	}

	/**
	 * Get all comments on a task
	 *
	 * @param {String} taskId The task id
	 * @param {Object} [options] The parameter options to pass in
	 */
	async getComments(taskId, options) {
		return this._request.get({
			endpoint: `${this.route}/${taskId}/comment`,
			params: options,
		});
	}

	/**
	 * Create a checklist in a task
	 *
	 * @param {String} taskId The task id
	 * @param {Object} data The checklist data
	 * @param {Object} [options] The parameter options to pass in
	 */
	async createChecklist(taskId, data, options) {
		return this._request.post({
			endpoint: `${this.route}/${taskId}/checklist`,
			params: options,
			data,
		});
	}

	/**
	 * Add a custom field value for a task
	 *
	 * @param {String} taskId The task id
	 * @param {String} fieldId The custom field id
	 * @param {Object} data The custom field data
	 * @param {Object} [options] The parameter options to pass in
	 */
	async addCustomFieldValue(taskId, fieldId, data, options) {
		return this._request.post({
			endpoint: `${this.route}/${taskId}/field/${fieldId}`,
			params: options,
			data,
		});
	}

	/**
	 * Delete a custom field value for a task
	 *
	 * @param {String} taskId The task id
	 * @param {String} fieldId The custom field id
	 * @param {Object} [options] The parameter options to pass in
	 */
	async deleteCustomFieldValue(taskId, fieldId, options) {
		return this._request.delete({
			endpoint: `${this.route}/${taskId}/field/${fieldId}`,
			params: options,
		});
	}

	/**
	 * Create a dependancy for a task
	 *
	 * @param {String} taskId The task id
	 * @param {Object} data The dependency data
	 * @param {Object} [options] The parameter options to pass in
	 */
	async addDependency(taskId, data, options) {
		return this._request.post({
			endpoint: `${this.route}/${taskId}/dependency`,
			params: options,
			data,
		});
	}

	/**
	 * Delete a dependancy for a task
	 *
	 * @param {String} taskId The task id
	 * @param {Object} options The parameter options to pass in
	 */
	async deleteDependency(taskId, options) {
		return this._request.delete({
			endpoint: `${this.route}/${taskId}/dependency`,
			params: options,
		});
	}

	/**
	 * Add a task link
	 *
	 * @param {String} taskId The task id
	 * @param {String} linksTo The id of the task to link to
	 * @param {Object} [options] The parameter options to pass in
	 */
	async addTaskLink(taskId, linksTo, options) {
		return this._request.post({
			endpoint: `${this.route}/${taskId}/link/${linksTo}`,
			params: options,
		});
	}

	/**
	 * Delete a task link
	 *
	 * @param {String} taskId The task id
	 * @param {String} linksTo The id of the task to link to
	 * @param {String} [options] The parameter options to pass in
	 */
	async deleteTaskLink(taskId, linksTo, options) {
		return this._request.delete({
			endpoint: `${this.route}/${taskId}/link/${linksTo}`,
			params: options,
		});
	}

	/**
	 * Add a guest to a task
	 *
	 * @param {String} taskId The task id
	 * @param {Number} guestId The guest id
	 * @param {Object} data The guest data
	 * @param {Object} [options] The parameter options to pass in
	 */
	async addGuest(taskId, guestId, data, options) {
		return this._request.post({
			endpoint: `${this.route}/${taskId}/guest/${guestId}`,
			params: options,
			data,
		});
	}

	/**
	 * Remove a guest from a task
	 *
	 * @param {String} taskId The task id
	 * @param {Number} guestId The guest id
	 * @param {Object} [options] The parameter options to pass in
	 */
	async removeGuest(taskId, guestId, options) {
		return this._request.delete({
			endpoint: `${this.route}/${taskId}/guest/${guestId}`,
			params: options,
		});
	}

	/**
	 * Get all members of a task
	 *
	 * @param {String} taskId The task id
	 */
	async getMembers(taskId) {
		return this._request.get({
			endpoint: `${this.route}/${taskId}/member`,
		});
	}

	/**
	 * Add a tag to a task
	 *
	 * @param {String} taskId The task id
	 * @param {String} tagName The tag name
	 * @param {Object} [options] The parameter options to pass in
	 */
	async addTag(taskId, tagName, options) {
		return this._request.post({
			endpoint: `${this.route}/${taskId}/tag/${tagName}`,
			params: options,
		});
	}

	/**
	 * Remove a tag from a task
	 *
	 * @param {String} taskId The task id
	 * @param {String} tagName The tag name
	 * @param {Object} [options] The parameter options to pass in
	 */
	async removeTag(taskId, tagName, options) {
		return this._request.delete({
			endpoint: `${this.route}/${taskId}/tag/${tagName}`,
			params: options,
		});
	}

	/**
	 * Track time for a task (Time Tracking Legacy API)
	 *
	 * @param {String} taskId The task id
	 * @param {Object} data The time tracking data
	 * @param {Object} [options] The parameter options to pass in
	 */
	async trackTime(taskId, data, options) {
		return this._request.post({
			endpoint: `${this.route}/${taskId}/time`,
			params: options,
			data,
		});
	}

	/**
	 * Get tracked time for a task (Time Tracking Legacy API)
	 *
	 * @param {String} taskId The task id
	 * @param {Object} [options] The parameter options to pass in
	 */
	async getTrackedTime(taskId, options) {
		return this._request.get({
			endpoint: `${this.route}/${taskId}/time`,
			params: options,
		});
	}

	/**
	 * Edit tracked time for a task (Time Tracking Legacy API)
	 *
	 * @param {String} taskId The task id
	 * @param {String} intervalId The interval id
	 * @param {Object} data The time tracking data
	 * @param {Object} [options] The parameter options to pass in
	 */
	async editTrackedTime(taskId, intervalId, data, options) {
		return this._request.put({
			endpoint: `${this.route}/${taskId}/time/${intervalId}`,
			params: options,
			data,
		});
	}

	/**
	 * Delete tracked time for a task
	 *
	 * @param {String} taskId The task id
	 * @param {String} intervalId The interval id
	 * @param {Object} [options] The parameter options to pass in
	 */
	async deleteTrackedTime(taskId, intervalId, options) {
		return this._request.delete({
			endpoint: `${this.route}/${taskId}/time/${intervalId}`,
			params: options,
		});
	}

	/**
	 * Get tasks time in status
	 *
	 * @param {String} taskId The task id
	 * @param {Object} options The parameter options to pass in
	 */
	async getTimeInStatus(taskId, options) {
		return this._request.get({
			endpoint: `${this.route}/${taskId}/time_in_status`,
			params: options,
		});
	}

	/**
	 * Get bulk tasks time in status
	 *
	 * @param {Object} options The parameter options to pass in
	 */
	async getBulkTimeInStatus(options) {
		return this._request.get({
			endpoint: `${this.route}/bulk_time_in_status/task_ids`,
			params: options,
		});
	}
}

module.exports = Tasks;
