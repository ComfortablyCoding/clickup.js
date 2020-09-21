class Teams {
	/**
	 * @constructor
	 * @param {Client} client A client instance
	 */
	constructor(client) {
		this._client = client;
		this.route = 'team';
	}

	/**
	 * Get teams
	 */
	async get() {
		return this._client.get({
			endpoint: `${this.route}`,
		});
	}

	/**
	 * Create a goal
	 *
	 * @param {Number} teamId The team id
	 * @param {Object} data Goal data
	 */
	async createGoal(teamId, data) {
		return this._client.post({
			endpoint: `${this.route}/${teamId}/goal`,
			json: data,
		});
	}

	/**
	 * Get all goals for a team
	 *
	 * @param {Number} teamId The team id
	 */
	async getGoals(teamId) {
		return this._client.get({
			endpoint: `${this.route}/${teamId}/goal`,
		});
	}

	/**
	 * Invite a guest to a workspace/team
	 *
	 * @param {Number} teamId The team id
	 * @param {Object} data The guest data
	 */
	async inviteGuest(teamId, data) {
		return this._client.post({
			endpoint: `${this.route}/${teamId}/guest`,
			json: data,
		});
	}

	/**
	 * Get a guest in a workspace/team
	 *
	 * @param {Number} teamId The team id
	 * @param {Number} guestId The guest id
	 */
	async getGuest(teamId, guestId) {
		return this._client.get({
			endpoint: `${this.route}/${teamId}/guest/${guestId}`,
		});
	}

	/**
	 *
	 * @param {Number} teamId The team id
	 * @param {Number} guestId The guest id
	 * @param {Object} data The guest data
	 */
	async editGuest(teamId, guestId, data) {
		return this._client.put({
			endpoint: `${this.route}/${teamId}/guest/${guestId}`,
			json: data,
		});
	}

	/**
	 * Remove a guest from a workspace/team
	 *
	 * @param {Number} teamId The team id
	 * @param {Number} guestId The guest id
	 */
	async removeGuest(teamId, guestId) {
		return this._client.delete({
			endpoint: `${this.route}/${teamId}/guest/${guestId}`,
		});
	}

	/**
	 * Returns all resources you have access to where you don't have access to its parent.
	 *
	 * @param {Number} teamId
	 */
	async sharedHierarchy(teamId) {
		return this._client.get({
			endpoint: `${this.route}/${teamId}/shared`,
		});
	}

	/**
	 * Create a space for a team
	 *
	 * @param {Number} teamId The team id
	 * @param {Object} data The space data
	 */
	async createSpace(teamId, data) {
		return this._client.post({
			endpoint: `${this.route}/${teamId}/space`,
			json: data,
		});
	}

	/**
	 * Get spaces for a team
	 *
	 * @param {Number} teamId The team id
	 * @param {Boolean} [archived=false] If archived spaces should be returned or not
	 */
	async getSpaces(teamId, archived = false) {
		return this._client.get({
			endpoint: `${this.route}/${teamId}/space`,
			params: {
				archived,
			},
		});
	}

	/**
	 * Get filtered tasks for a team
	 *
	 * @param {Number} teamId The team id
	 * @param {Object} [options] The parameter options to pass in
	 */
	async getFilteredTasks(teamId, options = {}) {
		// eslint-disable-next-line no-param-reassign
		options.page = options.page || 0;
		return this._client.get({
			endpoint: `${this.route}/${teamId}/task`,
			params: options,
		});
	}

	/**
	 * Get task templates for a team
	 *
	 * @param {Number} teamId The team id
	 * @param {Integer} [page=0] The page to get
	 */
	async getTaskTemplates(teamId, page = 0) {
		return this._client.get({
			endpoint: `${this.route}/${teamId}/taskTemplate`,
			params: {
				page,
			},
		});
	}

	/**
	 * Get a user for a team. Only available to enterprise teams
	 *
	 * @param {Number} teamId The team id
	 * @param {Number} userId The user id
	 */
	async getUser(teamId, userId) {
		return this._client.get({
			endpoint: `${this.route}/${teamId}/user/${userId}`,
		});
	}

	/**
	 * Invite a user to a workspace/team. Only available to enterprise teams
	 *
	 * @param {Number} teamId The team id
	 * @param {Object} data The user data
	 */
	async inviteUser(teamId, data) {
		return this._client.post({
			endpoint: `${this.route}/${teamId}/user`,
			json: data,
		});
	}

	/**
	 * Edit a user for a workspace/team.  Only available to enterprise teams
	 *
	 * @param {Number} teamId The team id
	 * @param {Number} userId The user id
	 * @param {Object} data The user data
	 */
	async editUser(teamId, userId, data) {
		return this._client.put({
			endpoint: `${this.route}/${teamId}/user/${userId}`,
			json: data,
		});
	}

	/**
	 * Remove a user from a workspace/team.  Only available to enterprise teams
	 *
	 * @param {Number} teamId The team id
	 * @param {Number} userId The team id
	 */
	async removeUser(teamId, userId) {
		return this._client.delete({
			endpoint: `${this.route}/${teamId}/user/${userId}`,
		});
	}

	/**
	 * Create a team view for a team
	 *
	 * @param {Number} teamId The team id
	 * @param {Object} data The view data
	 */
	async createView(teamId, data) {
		return this._client.post({
			endpoint: `${this.route}/${teamId}/view`,
			json: data,
		});
	}

	/**
	 * Get all team views for a team
	 *
	 * @param {Number} teamId The team id
	 */
	async getViews(teamId) {
		return this._client.get({
			endpoint: `${this.route}/${teamId}/view`,
		});
	}

	/**
	 * Create a webhook
	 *
	 * @param {Number} teamId The team id
	 * @param {Object} data The webhook data
	 */
	async createWebhook(teamId, data) {
		return this._client.post({
			endpoint: `${this.route}/${teamId}/webhook`,
			json: data,
		});
	}

	/**
	 * Get all webhooks
	 *
	 * @param {Number} teamId the team id
	 */
	async getWebhooks(teamId) {
		return this._client.get({
			endpoint: `${this.route}/${teamId}/webhook`,
		});
	}

	/**
	 * Get time entries within a data range
	 *
	 * @param {Number} teamId The team id
	 * @param {Object} [options] The parameter options to pass in
	 */
	async getTimeEntries(teamId, options) {
		return this._client.get({
			endpoint: `${this.route}/${teamId}/time_entries`,
			params: options,
		});
	}

	/**
	 * Get a single time entry
	 *
	 * @param {Number} teamId The team id
	 * @param {String} timerId The timer id
	 * @param {Object} [options] The parameter options to pass in
	 */
	async getSingleTimeEntry(teamId, timerId, options) {
		return this._client.get({
			endpoint: `${this.route}/${teamId}/time_entries/${timerId}`,
			params: options,
		});
	}

	/**
	 * Get running time entry
	 *
	 * @param {Number} teamId The team id
	 * @param {Object} [options] The parameter options to pass in
	 */
	async getRunningTimeEntry(teamId, options) {
		return this._client.get({
			endpoint: `${this.route}/${teamId}/time_entries/current`,
			params: options,
		});
	}

	/**
	 * Create a time entry
	 *
	 * @param {Number} teamId The team id
	 * @param {Object} data The time entry data
	 * @param {Object} [options] The parameter options to pass in
	 */
	async createTimeEntry(teamId, data, options) {
		return this._client.post({
			endpoint: `${this.route}/${teamId}/time_entries`,
			params: options,
			json: data,
		});
	}

	/**
	 * Remove tags from time entries
	 *
	 * @param {Number} teamId The team id
	 * @param {Object} data The time entries data
	 */
	async removeTagsFromTimeEntries(teamId, data) {
		return this._client.delete({
			endpoint: `${this.route}/${teamId}/time_entries/tags`,
			json: data,
		});
	}

	/**
	 * Get all tags from time entries
	 *
	 * @param {Number} teamId The team id
	 */
	async getAllTagsFromTimeEntries(teamId) {
		return this._client.get({
			endpoint: `${this.route}/${teamId}/time_entries/tags`,
		});
	}

	/**
	 * Add tags from time entries
	 *
	 * @param {Number} teamId The team id
	 * @param {Object} data The time entries and tag data
	 */
	async addTagsFromTimeEntries(teamId, data) {
		return this._client.post({
			endpoint: `${this.route}/${teamId}/time_entries/tags`,
			json: data,
		});
	}

	/**
	 * Change tag names from time entries
	 *
	 * @param {Number} teamId The team id
	 * @param {Object} data The tag data
	 */
	async changeTagsFromTimeEntries(teamId, data) {
		return this._client.put({
			endpoint: `${this.route}/${teamId}/time_entries/tags`,
			json: data,
		});
	}

	/**
	 * Start a time entry
	 *
	 * @param {Number} teamId The team id
	 * @param {Number} timerId The timer id
	 * @param {Object} data The time entry data
	 * @param {Object} [options] The parameter options to pass in
	 */
	async startTimeEntry(teamId, timerId, data, options) {
		return this._client.post({
			endpoint: `${this.route}/${teamId}/time_entries/start/${timerId}`,
			params: options,
			json: data,
		});
	}

	/**
	 * Stop a time entry
	 *
	 * @param {Number} teamId The team id
	 */
	async stopTimeEntry(teamId) {
		return this._client.post({
			endpoint: `${this.route}/${teamId}/time_entries/stop`,
		});
	}

	/**
	 * Delete a time entry
	 *
	 * @param {Number} teamId The team id
	 * @param {Number} timerId The timer id
	 */
	async deleteTimeEntry(teamId, timerId) {
		return this._client.delete({
			endpoint: `${this.route}/${teamId}/time_entries/${timerId}`,
		});
	}

	/**
	 * Update a time entry
	 *
	 * @param {Number} teamId The team id
	 * @param {Number} timerId The timer id
	 * @param {Object} data The time entry data
	 * @param {Object} [options] The parameter options to pass in
	 */
	async updateTimeEntry(teamId, timerId, data, options) {
		return this._client.put({
			endpoint: `${this.route}/${teamId}/time_entries/${timerId}`,
			params: options,
			json: data,
		});
	}
}
module.exports = Teams;
