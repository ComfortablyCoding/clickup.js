import { Clickup } from '../client';

export class Teams {
	private client: Clickup;
	route: string;
	constructor(client: Clickup) {
		this.client = client;

		/**
		 * The main route for the collection
		 */
		this.route = 'team';
	}

	/**
	 * Get teams
	 */
	async get() {
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
	async createGoal(teamId: number, data: Record<string, unknown>) {
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
	 */
	async getGoals(teamId: number) {
		return this.client.request({
			path: `${this.route}/${teamId}/goal`,
		});
	}

	/**
	 * Invite a guest to a workspace/team
	 *
	 * @param teamId The team id
	 * @param data The guest data
	 */
	async inviteGuest(teamId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/guest`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get a guest in a workspace/team
	 *
	 * @param teamId The team id
	 * @param guestId The guest id
	 */
	async getGuest(teamId: number, guestId: number) {
		return this.client.request({
			path: `${this.route}/${teamId}/guest/${guestId}`,
		});
	}

	/**
	 * Edit a guest in a workspace/team
	 *
	 * @param teamId The team id
	 * @param guestId The guest id
	 * @param data The guest data
	 */
	async editGuest(teamId: number, guestId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${teamId}/guest/${guestId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a guest from a workspace/team
	 *
	 * @param teamId The team id
	 * @param guestId The guest id
	 */
	async removeGuest(teamId: number, guestId: number) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${teamId}/guest/${guestId}`,
		});
	}

	/**
	 * Returns all resources you have access to where you don't have access to its parent.
	 *
	 * @param teamId The team id
	 */
	async sharedHierarchy(teamId: number) {
		return this.client.request({
			path: `${this.route}/${teamId}/shared`,
		});
	}

	/**
	 * Create a space for a team
	 *
	 * @param teamId The team id
	 * @param data The space data
	 */
	async createSpace(teamId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/space`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get spaces for a team
	 *
	 * @param teamId The team id
	 * @param params The query parameters to pass
	 * @param params.archived If archived lists should be returned or not
	 */
	async getSpaces(teamId: number, params?: Record<string, unknown>) {
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
	 * @param params.page The page to get
	 */
	async getFilteredTasks(teamId: number, params: Record<string, unknown> = { page: 0 }) {
		return this.client.request({
			path: `${this.route}/${teamId}/task`,
			params,
		});
	}

	/**
	 * Get task templates for a team
	 *
	 * @param teamId The team id
	 * @param params The query parameters to pass
	 * @param params.page The page to get
	 */
	async getTaskTemplates(teamId: number, params: Record<string, unknown> = { page: 0 }) {
		return this.client.request({
			path: `${this.route}/${teamId}/taskTemplate`,
			params,
		});
	}

	/**
	 * Get a user for a team. Only available to enterprise teams
	 *
	 * @param teamId The team id
	 * @param userId The user id
	 */
	async getUser(teamId: number, userId: number) {
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
	async inviteUser(teamId: number, data: Record<string, unknown>) {
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
	async editUser(teamId: number, userId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${teamId}/user/${userId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a user from a workspace/team.  Only available to enterprise teams
	 *
	 * @param teamId The team id
	 * @param userId The team id
	 */
	async removeUser(teamId: number, userId: number) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${teamId}/user/${userId}`,
		});
	}

	/**
	 * Create a team view for a team
	 *
	 * @param teamId The team id
	 * @param data The view data
	 */
	async createView(teamId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/view`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all team views for a team
	 *
	 * @param teamId The team id
	 */
	async getViews(teamId: number) {
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
	async createWebhook(teamId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/webhook`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all webhooks
	 *
	 * @param teamId the team id
	 */
	async getWebhooks(teamId: number) {
		return this.client.request({
			path: `${this.route}/${teamId}/webhook`,
		});
	}

	/**
	 * Get time entries within a data range
	 *
	 * @param teamId The team id
	 * @param params The parameter options to pass in
	 */
	async getTimeEntries(teamId: number, params?: Record<string, unknown>) {
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
	 * @param params The parameter options to pass in
	 */
	async getSingleTimeEntry(teamId: number, timerId: number, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${teamId}/time_entries/${timerId}`,
			params,
		});
	}

	/**
	 * Get running time entry
	 *
	 * @param teamId The team id
	 * @param params The parameter options to pass in
	 */
	async getRunningTimeEntry(teamId: number, params?: Record<string, unknown>) {
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
	 * @param params The parameter options to pass in
	 */
	async createTimeEntry(teamId: number, data: Record<string, unknown>, params?: Record<string, unknown>) {
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
	async removeTagsFromTimeEntries(teamId: number, data: Record<string, unknown>) {
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
	async getAllTagsFromTimeEntries(teamId: number) {
		return this.client.request({
			path: `${this.route}/${teamId}/time_entries/tags`,
		});
	}

	/**
	 * Add tags from time entries
	 *
	 * @param teamId The team id
	 * @param data The time entries and tag data
	 */
	async addTagsFromTimeEntries(teamId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/time_entries/tags`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Change tag names from time entries
	 *
	 * @param teamId The team id
	 * @param data The tag data
	 */
	async changeTagsFromTimeEntries(teamId: number, data: Record<string, unknown>) {
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
	 * @param timerId The timer id
	 * @param data The time entry data
	 * @param params The parameter options to pass in
	 */
	async startTimeEntry(
		teamId: number,
		timerId: number,
		data: Record<string, unknown>,
		params?: Record<string, unknown>
	) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${teamId}/time_entries/start/${timerId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Stop a time entry
	 *
	 * @param teamId The team id
	 */
	async stopTimeEntry(teamId: number) {
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
	async deleteTimeEntry(teamId: number, timerId: number) {
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
	 * @param params The parameter options to pass in
	 */
	async updateTimeEntry(
		teamId: number,
		timerId: number,
		data: Record<string, unknown>,
		params?: Record<string, unknown>
	) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${teamId}/time_entries/${timerId}`,
			params,
			body: JSON.stringify(data),
		});
	}
}
