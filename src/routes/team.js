import { Route } from "./route.js";

export class Team extends Route {
	constructor(client) {
		super({
			client,
			route: "team",
		});
	}

	/**
	 * Get teams
	 */
	get() {
		return this.client.request({
			path: `${this.route}`,
		});
	}

	/**
	 * Create a goal
	 *
	 * @param {number} teamId The team id
	 * @param {object} data Goal data
	 */
	createGoal(teamId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${teamId}/goal`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all goals for a team
	 *
	 * @param {number} teamId The team id
	 * @param {object} params The query parameters to use
	 */
	goals(teamId, params) {
		return this.client.request({
			path: `${this.route}/${teamId}/goal`,
			params,
		});
	}

	/**
	 * Invite a guest to a team (workspace)
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The guest data
	 */
	inviteGuest(teamId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${teamId}/guest`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get information about a team (workspace) guest
	 *
	 * @param {number} teamId The team id
	 * @param {number} guestId The guest id
	 */
	guest(teamId, guestId) {
		return this.client.request({
			path: `${this.route}/${teamId}/guest/${guestId}`,
		});
	}

	/**
	 * Edit a guest in a team (workspace)
	 *
	 * @param {number} teamId The team id
	 * @param {number} guestId The guest id
	 * @param {object} data The guest data
	 */
	editGuest(teamId, guestId, data) {
		return this.client.request({
			method: "PUT",
			path: `${this.route}/${teamId}/guest/${guestId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a guest from a team (workspace)
	 *
	 * @param {number} teamId The team id
	 * @param {number} guestId The guest id
	 */
	removeGuest(teamId, guestId) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${teamId}/guest/${guestId}`,
		});
	}

	/**
	 * Get the tasks, lists, and folders that have been shared with the authenticated user
	 *
	 * @param {number} teamId The team id
	 */
	sharedHierarchy(teamId) {
		return this.client.request({
			path: `${this.route}/${teamId}/shared`,
		});
	}

	/**
	 * Create a space for a team (workspace)
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The space data
	 */
	createSpace(teamId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${teamId}/space`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get available spaces for a team (workspace)
	 *
	 * @param {number} teamId The team id
	 * @param {object} [params] The query parameters to pass
	 * @param {boolean} params.archived If archived lists should be returned or not
	 */
	spaces(teamId, params) {
		return this.client.request({
			path: `${this.route}/${teamId}/space`,
			params,
		});
	}

	/**
	 * Get filtered tasks for a team
	 *
	 * @param {number} teamId The team id
	 * @param {object} [params] The query parameters to pass
	 */
	filteredTasks(teamId, params) {
		return this.client.request({
			path: `${this.route}/${teamId}/task`,
			params: { page: 0, ...params },
		});
	}

	/**
	 * Get task templates for a team
	 *
	 * @param {number} teamId The team id
	 * @param {object} [params] The query parameters to pass
	 */
	taskTemplates(teamId, params) {
		return this.client.request({
			path: `${this.route}/${teamId}/taskTemplate`,
			params: { page: 0, ...params },
		});
	}

	/**
	 * Get a user for a team. Only available to enterprise teams
	 *
	 * @param {number} teamId The team id
	 * @param {number} userId The user id
	 */
	user(teamId, userId) {
		return this.client.request({
			path: `${this.route}/${teamId}/user/${userId}`,
		});
	}

	/**
	 * Invite a user to a workspace/team. Only available to enterprise teams
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The user data
	 */
	inviteUser(teamId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${teamId}/user`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Edit a user for a workspace/team.  Only available to enterprise teams
	 *
	 * @param {number} teamId The team id
	 * @param {number} userId The user id
	 * @param {object} data The user data
	 */
	editUser(teamId, userId, data) {
		return this.client.request({
			method: "PUT",
			path: `${this.route}/${teamId}/user/${userId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove (deactivate) a user from a workspace/team.  Only available to enterprise teams
	 *
	 * @param {number} teamId The team id
	 * @param {number} userId The team id
	 */
	removeUser(teamId, userId) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${teamId}/user/${userId}`,
		});
	}

	/**
	 * Create a List, Board, Calendar, Table, Timeline, Workload, Activity, Map, Chat,
	 * or Gantt view at the Everything Level of a Workspace.
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The view data
	 */
	createView(teamId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${teamId}/view`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get the  task and page views available at the Everything Level of a Workspace.
	 *
	 * @param {number} teamId The team id
	 */
	views(teamId) {
		return this.client.request({
			path: `${this.route}/${teamId}/view`,
		});
	}

	/**
	 * Create a webhook
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The webhook data
	 */
	createWebhook(teamId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${teamId}/webhook`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get the webhooks created via the API for a Workspace.
	 * This endpoint returns webhooks created by the authenticated user
	 *
	 * @param {number} teamId the team id
	 */
	webhooks(teamId) {
		return this.client.request({
			path: `${this.route}/${teamId}/webhook`,
		});
	}

	/**
	 * Get time entries within a data range
	 *
	 * @param {number} teamId The team id
	 * @param {object} [params] The query parameters to use
	 */
	timeEntries(teamId, params) {
		return this.client.request({
			path: `${this.route}/${teamId}/time_entries`,
			params,
		});
	}

	/**
	 * Get a single time entry
	 *
	 * @param {number} teamId The team id
	 * @param {number} timerId The timer id
	 * @param {object} [params] The query parameters to use
	 */
	timeEntry(teamId, timerId, params) {
		return this.client.request({
			path: `${this.route}/${teamId}/time_entries/${timerId}`,
			params,
		});
	}

	/**
	 * Get time entry that's currently tracking time for the authenticated user.
	 *
	 * @param {number} teamId The team id
	 * @param {object} [params] The query parameters to use
	 */
	runningTimeEntry(teamId, params) {
		return this.client.request({
			path: `${this.route}/${teamId}/time_entries/current`,
			params,
		});
	}

	/**
	 * Create a time entry
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The time entry data
	 * @param {object} [params] The query parameters to use
	 */
	addTimeEntry(teamId, data, params) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${teamId}/time_entries`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove tags from time entries
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The time entries data
	 */
	removeTimeEntryTags(teamId, data) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${teamId}/time_entries/tags`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all tags from time entries
	 *
	 * @param {number} teamId The team id
	 */
	timeEntryTags(teamId) {
		return this.client.request({
			path: `${this.route}/${teamId}/time_entries/tags`,
		});
	}

	/**
	 * Add a label to time entries
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The time entries and tag data
	 */
	addTimeEntryTags(teamId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${teamId}/time_entries/tags`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Rename an time entry label
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The tag data
	 */
	editTimeEntryTag(teamId, data) {
		return this.client.request({
			method: "PUT",
			path: `${this.route}/${teamId}/time_entries/tags`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Start a time entry
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The time entry data
	 * @param {object} [params] The query parameters to use
	 */
	startTimeEntry(teamId, data, params) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${teamId}/time_entries/start`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Stop a time entry
	 *
	 * @param {number} teamId The team id
	 */
	stopTimeEntry(teamId) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${teamId}/time_entries/stop`,
		});
	}

	/**
	 * Delete a time entry
	 *
	 * @param {number} teamId The team id
	 * @param {number} timerId The timer id
	 */
	removeTimeEntry(teamId, timerId) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${teamId}/time_entries/${timerId}`,
		});
	}

	/**
	 * Update a time entry
	 *
	 * @param {number} teamId The team id
	 * @param {number} timerId The timer id
	 * @param {object} data The time entry data
	 * @param {object} [params] The query parameters to use
	 */
	editTimeEntry(teamId, timerId, data, params) {
		return this.client.request({
			method: "PUT",
			path: `${this.route}/${teamId}/time_entries/${timerId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get a list of changes made to a time entry
	 *
	 * @param {number} teamId The team id
	 * @param {number} timerId The timer id
	 */
	timeEntryHistory(teamId, timerId) {
		return this.client.request({
			path: `${this.route}/${teamId}/time_entries/${timerId}/history`,
		});
	}

	/**
	 * Retrieve the used, total, and available member and guest seats for a team (workspace).
	 *
	 * @param {string} teamId The team id
	 */
	seats(teamId) {
		return this.client.request({
			path: `${this.route}/${teamId}/seats`,
		});
	}

	/**
	 * Retrieve the current Plan for the specified team (workspace).
	 *
	 * @param {string} teamId The team id
	 */
	plan(teamId) {
		return this.client.request({
			path: `${this.route}/${teamId}/plan`,
		});
	}

	/**
	 * Get the custom task types available in a team (workspace).
	 *
	 * @param {string} teamId The team id
	 */
	customTaskTypes(teamId) {
		return this.client.request({
			path: `${this.route}/${teamId}/custom_item`,
		});
	}

	/**
	 * Get the custom roles available in a team (workspace).
	 *
	 * @param {string} teamId The team id
	 * @param {object} [params] The query parameters to use
	 */
	customRoles(teamId, params) {
		return this.client.request({
			path: `${this.route}/${teamId}/customroles`,
			params,
		});
	}

	/**
	 * Create a team user group.
	 *
	 * @param {string} teamId The team id
	 * @param {object} data The team data
	 */
	createUserGroup(teamId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${teamId}/group`,
			body: JSON.stringify(data),
		});
	}
}
