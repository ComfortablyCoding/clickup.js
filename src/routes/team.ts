import { Clickup } from '../client';
import { Route } from './route';

export class Team extends Route {
	constructor(client: Clickup) {
		super({
			client,
			route: 'team',
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
	 * @param teamId The team id
	 * @param data Goal data
	 */
	createGoal(teamId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/goal`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all goals for a team
	 *
	 * @param teamId The team id
	 * @param params The query parameters to use
	 */
	goals(teamId: number, params: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${teamId}/goal`,
			params,
		});
	}

	/**
	 * Invite a guest to a team (workspace)
	 *
	 * @param teamId The team id
	 * @param data The guest data
	 */
	inviteGuest(teamId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/guest`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get information about a team (workspace) guest
	 *
	 * @param teamId The team id
	 * @param guestId The guest id
	 */
	guest(teamId: number, guestId: number) {
		return this.client.request({
			path: `${this.route}/${teamId}/guest/${guestId}`,
		});
	}

	/**
	 * Edit a guest in a team (workspace)
	 *
	 * @param teamId The team id
	 * @param guestId The guest id
	 * @param data The guest data
	 */
	editGuest(teamId: number, guestId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${teamId}/guest/${guestId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a guest from a team (workspace)
	 *
	 * @param teamId The team id
	 * @param guestId The guest id
	 */
	removeGuest(teamId: number, guestId: number) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${teamId}/guest/${guestId}`,
		});
	}

	/**
	 * Get the tasks, lists, and folders that have been shared with the authenticated user
	 *
	 * @param teamId The team id
	 */
	sharedHierarchy(teamId: number) {
		return this.client.request({
			path: `${this.route}/${teamId}/shared`,
		});
	}

	/**
	 * Create a space for a team (workspace)
	 *
	 * @param teamId The team id
	 * @param data The space data
	 */
	createSpace(teamId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/space`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get available spaces for a team (workspace)
	 *
	 * @param teamId The team id
	 * @param params The query parameters to pass
	 * @param params.archived If archived lists should be returned or not
	 */
	spaces(teamId: number, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${teamId}/space`,
			params,
		});
	}

	/**
	 * Get filtered tasks for a team
	 *
	 * @param teamId The team id
	 * @param params The query parameters to pass
	 */
	filteredTasks(teamId: number, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${teamId}/task`,
			params: { page: 0, ...params },
		});
	}

	/**
	 * Get task templates for a team
	 *
	 * @param teamId The team id
	 * @param params The query parameters to pass
	 */
	taskTemplates(teamId: number, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${teamId}/taskTemplate`,
			params: { page: 0, ...params },
		});
	}

	/**
	 * Get a user for a team. Only available to enterprise teams
	 *
	 * @param teamId The team id
	 * @param userId The user id
	 */
	user(teamId: number, userId: number) {
		return this.client.request({
			path: `${this.route}/${teamId}/user/${userId}`,
		});
	}

	/**
	 * Invite a user to a workspace/team. Only available to enterprise teams
	 *
	 * @param teamId The team id
	 * @param data The user data
	 */
	inviteUser(teamId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/user`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Edit a user for a workspace/team.  Only available to enterprise teams
	 *
	 * @param teamId The team id
	 * @param userId The user id
	 * @param data The user data
	 */
	editUser(teamId: number, userId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${teamId}/user/${userId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove (deactivate) a user from a workspace/team.  Only available to enterprise teams
	 *
	 * @param teamId The team id
	 * @param userId The team id
	 */
	removeUser(teamId: number, userId: number) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${teamId}/user/${userId}`,
		});
	}

	/**
	 * Create a List, Board, Calendar, Table, Timeline, Workload, Activity, Map, Chat, or Gantt view at the Everything Level of a Workspace.
	 *
	 * @param teamId The team id
	 * @param data The view data
	 */
	createView(teamId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/view`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get the  task and page views available at the Everything Level of a Workspace.
	 *
	 * @param teamId The team id
	 */
	views(teamId: number) {
		return this.client.request({
			path: `${this.route}/${teamId}/view`,
		});
	}

	/**
	 * Create a webhook
	 *
	 * @param teamId The team id
	 * @param data The webhook data
	 */
	createWebhook(teamId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/webhook`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get the webhooks created via the API for a Workspace. This endpoint returns webhooks created by the authenticated user
	 *
	 * @param teamId the team id
	 */
	webhooks(teamId: number) {
		return this.client.request({
			path: `${this.route}/${teamId}/webhook`,
		});
	}

	/**
	 * Get time entries within a data range
	 *
	 * @param teamId The team id
	 * @param params The query parameters to use
	 */
	timeEntries(teamId: number, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${teamId}/time_entries`,
			params,
		});
	}

	/**
	 * Get a single time entry
	 *
	 * @param teamId The team id
	 * @param timerId The timer id
	 * @param params The query parameters to use
	 */
	timeEntry(teamId: number, timerId: number, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${teamId}/time_entries/${timerId}`,
			params,
		});
	}

	/**
	 * Get time entry that's currently tracking time for the authenticated user.
	 *
	 * @param teamId The team id
	 * @param params The query parameters to use
	 */
	runningTimeEntry(teamId: number, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${teamId}/time_entries/current`,
			params,
		});
	}

	/**
	 * Create a time entry
	 *
	 * @param teamId The team id
	 * @param data The time entry data
	 * @param params The query parameters to use
	 */
	addTimeEntry(teamId: number, data: Record<string, unknown>, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/time_entries`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove tags from time entries
	 *
	 * @param teamId The team id
	 * @param data The time entries data
	 */
	removeTimeEntryTags(teamId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${teamId}/time_entries/tags`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all tags from time entries
	 *
	 * @param teamId The team id
	 */
	timeEntryTags(teamId: number) {
		return this.client.request({
			path: `${this.route}/${teamId}/time_entries/tags`,
		});
	}

	/**
	 * Add a label to time entries
	 *
	 * @param teamId The team id
	 * @param data The time entries and tag data
	 */
	addTimeEntryTags(teamId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/time_entries/tags`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Rename an time entry label
	 *
	 * @param teamId The team id
	 * @param data The tag data
	 */
	editTimeEntryTag(teamId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${teamId}/time_entries/tags`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Start a time entry
	 *
	 * @param teamId The team id
	 * @param data The time entry data
	 * @param params The query parameters to use
	 */
	startTimeEntry(teamId: number, data: Record<string, unknown>, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/time_entries/start`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Stop a time entry
	 *
	 * @param teamId The team id
	 */
	stopTimeEntry(teamId: number) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/time_entries/stop`,
		});
	}

	/**
	 * Delete a time entry
	 *
	 * @param teamId The team id
	 * @param timerId The timer id
	 */
	removeTimeEntry(teamId: number, timerId: number) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${teamId}/time_entries/${timerId}`,
		});
	}

	/**
	 * Update a time entry
	 *
	 * @param teamId The team id
	 * @param timerId The timer id
	 * @param data The time entry data
	 * @param params The query parameters to use
	 */
	editTimeEntry(teamId: number, timerId: number, data: Record<string, unknown>, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${teamId}/time_entries/${timerId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get a list of changes made to a time entry
	 *
	 * @param teamId The team id
	 * @param timerId The timer id
	 */
	timeEntryHistory(teamId: number, timerId: number) {
		return this.client.request({
			path: `${this.route}/${teamId}/time_entries/${timerId}/history`,
		});
	}

	/**
	 * Retrieve the used, total, and available member and guest seats for a team (workspace).
	 *
	 * @param teamId The team id
	 */
	seats(teamId: string) {
		return this.client.request({
			path: `${this.route}/${teamId}/seats`,
		});
	}

	/**
	 * Retrieve the current Plan for the specified team (workspace).
	 *
	 * @param teamId The team id
	 */
	plan(teamId: string) {
		return this.client.request({
			path: `${this.route}/${teamId}/plan`,
		});
	}

	/**
	 * Get the custom task types available in a team (workspace).
	 *
	 * @param teamId The team id
	 */
	customTaskTypes(teamId: number) {
		return this.client.request({
			path: `${this.route}/${teamId}/custom_item`,
		});
	}

	/**
	 * Get the custom roles available in a team (workspace).
	 *
	 * @param teamId The team id
	 * @param params The query parameters to use
	 */
	customRoles(teamId: number) {
		return this.client.request({
			path: `${this.route}/${teamId}/customroles`,
		});
	}

	/**
	 * Create a team user group.
	 *
	 * @param teamId The team id
	 * @param data The team data
	 */
	createUserGroup(teamId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/group`,
			body: JSON.stringify(data),
		});
	}
}
