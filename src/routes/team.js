import { Route } from "./route.js";

/**
 * @class
 * @extends Route
 */
export class Team extends Route {
	/**
	 * @constructor
	 * @param {import('../client.js').Clickup} client
	 */
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
			path: `/${this.version}/${this.route}`,
		});
	}

	/**
	 * Create a goal
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateGoal}
	 *
	 * @param {number} teamId The team id
	 * @param {object} data Goal data
	 */
	createGoal(teamId, data) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${teamId}/goal`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all goals for a team
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetGoals}
	 *
	 * @param {number} teamId The team id
	 * @param {object} params The query parameters to use
	 */
	goals(teamId, params) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/goal`,
			params,
		});
	}

	/**
	 * Invite a guest to a team (workspace)
	 * @see {@link https://clickup.com/api/clickupreference/operation/InviteGuestToWorkspace}
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The guest data
	 */
	inviteGuest(teamId, data) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${teamId}/guest`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get information about a team (workspace) guest
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetGuest}
	 *
	 * @param {number} teamId The team id
	 * @param {number} guestId The guest id
	 */
	guest(teamId, guestId) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/guest/${guestId}`,
		});
	}

	/**
	 * Edit a guest in a team (workspace)
	 * @see {@link https://clickup.com/api/clickupreference/operation/EditGuestOnWorkspace}
	 *
	 * @param {number} teamId The team id
	 * @param {number} guestId The guest id
	 * @param {object} data The guest data
	 */
	editGuest(teamId, guestId, data) {
		return this.client.request({
			method: "PUT",
			path: `/${this.version}/${this.route}/${teamId}/guest/${guestId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a guest from a team (workspace)
	 * @see {@link https://clickup.com/api/clickupreference/operation/RemoveGuestFromWorkspace}
	 *
	 * @param {number} teamId The team id
	 * @param {number} guestId The guest id
	 */
	removeGuest(teamId, guestId) {
		return this.client.request({
			method: "DELETE",
			path: `/${this.version}/${this.route}/${teamId}/guest/${guestId}`,
		});
	}

	/**
	 * Get the tasks, lists, and folders that have been shared with the authenticated user
	 * @see {@link https://clickup.com/api/clickupreference/operation/SharedHierarchy}
	 *
	 * @param {number} teamId The team id
	 */
	sharedHierarchy(teamId) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/shared`,
		});
	}

	/**
	 * Create a space for a team (workspace)
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateSpace}
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The space data
	 */
	createSpace(teamId, data) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${teamId}/space`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get available spaces for a team (workspace)
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetSpaces}
	 *
	 * @param {number} teamId The team id
	 * @param {object} [params] The query parameters to pass
	 * @param {boolean} params.archived If archived lists should be returned or not
	 */
	spaces(teamId, params) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/space`,
			params,
		});
	}

	/**
	 * Get filtered tasks for a team
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetFilteredTeamTasks}
	 *
	 * @param {number} teamId The team id
	 * @param {object} [params] The query parameters to pass
	 */
	filteredTasks(teamId, params) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/task`,
			params: { page: 0, ...params },
		});
	}

	/**
	 * Get task templates for a team
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetTaskTemplates}
	 *
	 * @param {number} teamId The team id
	 * @param {object} [params] The query parameters to pass
	 */
	taskTemplates(teamId, params) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/taskTemplate`,
			params: { page: 0, ...params },
		});
	}

	/**
	 * Get a user for a team. Only available to enterprise teams
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetUser}
	 *
	 * @param {number} teamId The team id
	 * @param {number} userId The user id
	 */
	user(teamId, userId) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/user/${userId}`,
		});
	}

	/**
	 * Invite a user to a workspace/team. Only available to enterprise teams
	 * @see {@link https://clickup.com/api/clickupreference/operation/InviteUserToWorkspace}
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The user data
	 */
	inviteUser(teamId, data) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${teamId}/user`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Edit a user for a workspace/team.  Only available to enterprise teams
	 * @see {@link https://clickup.com/api/clickupreference/operation/EditUserOnWorkspace}
	 *
	 * @param {number} teamId The team id
	 * @param {number} userId The user id
	 * @param {object} data The user data
	 */
	editUser(teamId, userId, data) {
		return this.client.request({
			method: "PUT",
			path: `/${this.version}/${this.route}/${teamId}/user/${userId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove (deactivate) a user from a workspace/team.  Only available to enterprise teams
	 * @see {@link https://clickup.com/api/clickupreference/operation/RemoveUserFromWorkspace}
	 *
	 * @param {number} teamId The team id
	 * @param {number} userId The team id
	 */
	removeUser(teamId, userId) {
		return this.client.request({
			method: "DELETE",
			path: `/${this.version}/${this.route}/${teamId}/user/${userId}`,
		});
	}

	/**
	 * Create a List, Board, Calendar, Table, Timeline, Workload, Activity, Map, Chat,
	 * or Gantt view at the Everything Level of a Workspace.
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateTeamView}
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The view data
	 */
	createView(teamId, data) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${teamId}/view`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get the  task and page views available at the Everything Level of a Workspace.
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetTeamViews}
	 *
	 * @param {number} teamId The team id
	 */
	views(teamId) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/view`,
		});
	}

	/**
	 * Create a webhook
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateWebhook}
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The webhook data
	 */
	createWebhook(teamId, data) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${teamId}/webhook`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get the webhooks created via the API for a Workspace.
	 * This endpoint returns webhooks created by the authenticated user
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetWebhooks}
	 *
	 * @param {number} teamId the team id
	 */
	webhooks(teamId) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/webhook`,
		});
	}

	/**
	 * Get time entries within a data range
	 * @see {@link https://clickup.com/api/clickupreference/operation/Gettimeentrieswithinadaterange}
	 *
	 * @param {number} teamId The team id
	 * @param {object} [params] The query parameters to use
	 */
	timeEntries(teamId, params) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/time_entries`,
			params,
		});
	}

	/**
	 * Get a single time entry
	 * @see {@link https://clickup.com/api/clickupreference/operation/Getsingulartimeentry}
	 *
	 * @param {number} teamId The team id
	 * @param {string} timerId The timer id
	 * @param {object} [params] The query parameters to use
	 */
	timeEntry(teamId, timerId, params) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/time_entries/${timerId}`,
			params,
		});
	}

	/**
	 * Get time entry that's currently tracking time for the authenticated user.
	 * @see {@link https://clickup.com/api/clickupreference/operation/Getrunningtimeentry}
	 *
	 * @param {number} teamId The team id
	 * @param {object} [params] The query parameters to use
	 */
	runningTimeEntry(teamId, params) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/time_entries/current`,
			params,
		});
	}

	/**
	 * Create a time entry
	 * @see {@link https://clickup.com/api/clickupreference/operation/Createatimeentry}
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The time entry data
	 * @param {object} [params] The query parameters to use
	 */
	addTimeEntry(teamId, data, params) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${teamId}/time_entries`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove tags from time entries
	 * @see {@link https://clickup.com/api/clickupreference/operation/Removetagsfromtimeentries}
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The time entries data
	 */
	removeTimeEntryTags(teamId, data) {
		return this.client.request({
			method: "DELETE",
			path: `/${this.version}/${this.route}/${teamId}/time_entries/tags`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all tags from time entries
	 * @see {@link https://clickup.com/api/clickupreference/operation/Getalltagsfromtimeentries}
	 *
	 * @param {number} teamId The team id
	 */
	timeEntryTags(teamId) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/time_entries/tags`,
		});
	}

	/**
	 * Add a label to time entries
	 * @see {@link https://clickup.com/api/clickupreference/operation/Addtagsfromtimeentries}
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The time entries and tag data
	 */
	addTimeEntryTags(teamId, data) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${teamId}/time_entries/tags`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Rename an time entry label
	 * @see {@link https://clickup.com/api/clickupreference/operation/Changetagnamesfromtimeentries}
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The tag data
	 */
	editTimeEntryTag(teamId, data) {
		return this.client.request({
			method: "PUT",
			path: `/${this.version}/${this.route}/${teamId}/time_entries/tags`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Start a time entry
	 * @see {@link https://clickup.com/api/clickupreference/operation/StartatimeEntry}
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The time entry data
	 * @param {object} [params] The query parameters to use
	 */
	startTimeEntry(teamId, data, params) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${teamId}/time_entries/start`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Stop a time entry
	 * @see {@link https://clickup.com/api/clickupreference/operation/StopatimeEntry}
	 *
	 * @param {number} teamId The team id
	 */
	stopTimeEntry(teamId) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${teamId}/time_entries/stop`,
		});
	}

	/**
	 * Delete a time entry
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteatimeEntry}
	 *
	 * @param {number} teamId The team id
	 * @param {number} timerId The timer id
	 */
	removeTimeEntry(teamId, timerId) {
		return this.client.request({
			method: "DELETE",
			path: `/${this.version}/${this.route}/${teamId}/time_entries/${timerId}`,
		});
	}

	/**
	 * Update a time entry
	 * @see {@link https://clickup.com/api/clickupreference/operation/UpdateatimeEntry}
	 *
	 * @param {number} teamId The team id
	 * @param {number} timerId The timer id
	 * @param {object} data The time entry data
	 * @param {object} [params] The query parameters to use
	 */
	editTimeEntry(teamId, timerId, data, params) {
		return this.client.request({
			method: "PUT",
			path: `/${this.version}/${this.route}/${teamId}/time_entries/${timerId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get a list of changes made to a time entry
	 * @see {@link https://clickup.com/api/clickupreference/operation/Gettimeentryhistory}
	 *
	 * @param {number} teamId The team id
	 * @param {string} timerId The timer id
	 */
	timeEntryHistory(teamId, timerId) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/time_entries/${timerId}/history`,
		});
	}

	/**
	 * Retrieve the used, total, and available member and guest seats for a team (workspace).
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetWorkspaceseats}
	 *
	 * @param {string} teamId The team id
	 */
	seats(teamId) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/seats`,
		});
	}

	/**
	 * Retrieve the current Plan for the specified team (workspace).
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetWorkspaceplan}
	 *
	 * @param {string} teamId The team id
	 */
	plan(teamId) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/plan`,
		});
	}

	/**
	 * Get the custom task types available in a team (workspace).
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetCustomItems}
	 *
	 * @param {string} teamId The team id
	 */
	customTaskTypes(teamId) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/custom_item`,
		});
	}

	/**
	 * Get the custom roles available in a team (workspace).
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetCustomRoles}
	 *
	 * @param {string} teamId The team id
	 * @param {object} [params] The query parameters to use
	 */
	customRoles(teamId, params) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/customroles`,
			params,
		});
	}

	/**
	 * Add a team user group.
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateTeam}
	 *
	 * @param {number} teamId The team id
	 * @param {object} data The team data
	 */
	addUserGroup(teamId, data) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${teamId}/group`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all Custom Fields available in a team (workspace)

	 *
	 * @param {number} teamId The team id
	 */
	customFields(teamId) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${teamId}/field`,
		});
	}
}
