import { Clickup } from '../client';

export class Tasks {
	private client: Clickup;
	route: string;
	constructor(client: Clickup) {
		this.client = client;

		/**
		 * The main route for the collection
		 */
		this.route = 'task';
	}

	/**
	 * Get a task
	 *
	 * @param taskId The task id
	 * @param params The parameter options to pass in
	 */
	async get(taskId: string, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${taskId}`,
			params,
		});
	}

	/**
	 * Update a task
	 *
	 * @param taskId The task id
	 * @param data The task data
	 * @param params The parameter options to pass in
	 */
	async update(taskId: string, data: Record<string, unknown>, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${taskId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a task
	 *
	 * @param taskId The task id
	 * @param params The parameter options to pass in
	 */
	async delete(taskId: string, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${taskId}`,
			params,
		});
	}

	/**
	 * Add an attachment to a task
	 *
	 * @param taskId The task id
	 * @param attachment The attachments to add
	 * @param params The parameter options to pass in
	 */
	async addAttachment(taskId: string, attachment: FormData, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${taskId}/attachment`,
			params,
			body: attachment,
		});
	}

	/**
	 * Add a comment to as task
	 *
	 * @param taskId The task id
	 * @param data The comment data
	 * @param params The parameter options to pass in
	 */
	async addComment(taskId: string, data: Record<string, unknown>, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${taskId}/comment`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all comments on a task
	 *
	 * @param taskId The task id
	 * @param params The parameter options to pass in
	 */
	async getComments(taskId: string, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${taskId}/comment`,
			params,
		});
	}

	/**
	 * Create a checklist in a task
	 *
	 * @param taskId The task id
	 * @param data The checklist data
	 * @param params The parameter options to pass in
	 */
	async createChecklist(taskId: string, data: Record<string, unknown>, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${taskId}/checklist`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Add a custom field value for a task
	 *
	 * @param taskId The task id
	 * @param fieldId The custom field id
	 * @param data The custom field data
	 * @param params The parameter options to pass in
	 */
	async addCustomFieldValue(
		taskId: string,
		fieldId: string,
		data: Record<string, unknown>,
		params?: Record<string, unknown>
	) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${taskId}/field/${fieldId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a custom field value for a task
	 *
	 * @param taskId The task id
	 * @param fieldId The custom field id
	 * @param params The parameter options to pass in
	 */
	async deleteCustomFieldValue(taskId: string, fieldId: string, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${taskId}/field/${fieldId}`,
			params,
		});
	}

	/**
	 * Create a dependancy for a task
	 *
	 * @param taskId The task id
	 * @param data The dependency data
	 * @param params The parameter options to pass in
	 */
	async addDependency(taskId: string, data: Record<string, unknown>, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${taskId}/dependency`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a dependancy for a task
	 *
	 * @param taskId The task id
	 * @param options The parameter options to pass in
	 */
	async deleteDependency(taskId: string, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${taskId}/dependency`,
			params,
		});
	}

	/**
	 * Add a task link
	 *
	 * @param taskId The task id
	 * @param linksTo The id of the task to link to
	 * @param params The parameter options to pass in
	 */
	async addTaskLink(taskId: string, linksTo: string, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${taskId}/link/${linksTo}`,
			params,
		});
	}

	/**
	 * Delete a task link
	 *
	 * @param taskId The task id
	 * @param linksTo The id of the task to link to
	 * @param params The parameter options to pass in
	 */
	async deleteTaskLink(taskId: string, linksTo: string, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${taskId}/link/${linksTo}`,
			params,
		});
	}

	/**
	 * Add a guest to a task
	 *
	 * @param taskId The task id
	 * @param guestId The guest id
	 * @param data The guest data
	 * @param params The parameter options to pass in
	 */
	async addGuest(taskId: string, guestId: number, data: Record<string, unknown>, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${taskId}/guest/${guestId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a guest from a task
	 *
	 * @param taskId The task id
	 * @param guestId The guest id
	 * @param params The parameter options to pass in
	 */
	async removeGuest(taskId: string, guestId: number, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${taskId}/guest/${guestId}`,
			params,
		});
	}

	/**
	 * Get all members of a task
	 *
	 * @param taskId The task id
	 */
	async getMembers(taskId: string) {
		return this.client.request({
			path: `${this.route}/${taskId}/member`,
		});
	}

	/**
	 * Add a tag to a task
	 *
	 * @param taskId The task id
	 * @param tagName The tag name
	 * @param params The parameter options to pass in
	 */
	async addTag(taskId: string, tagName: string, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${taskId}/tag/${tagName}`,
			params,
		});
	}

	/**
	 * Remove a tag from a task
	 *
	 * @param taskId The task id
	 * @param tagName The tag name
	 * @param params The parameter options to pass in
	 */
	async removeTag(taskId: string, tagName: string, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${taskId}/tag/${tagName}`,
			params,
		});
	}

	/**
	 * Track time for a task (Time Tracking Legacy API)
	 *
	 * @param taskId The task id
	 * @param data The time tracking data
	 * @param params The parameter options to pass in
	 */
	async trackTime(taskId: string, data: Record<string, unknown>, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${taskId}/time`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get tracked time for a task (Time Tracking Legacy API)
	 *
	 * @param taskId The task id
	 * @param params The parameter options to pass in
	 */
	async getTrackedTime(taskId: string, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${taskId}/time`,
			params,
		});
	}

	/**
	 * Edit tracked time for a task (Time Tracking Legacy API)
	 *
	 * @param taskId The task id
	 * @param intervalId The interval id
	 * @param data The time tracking data
	 * @param params The parameter options to pass in
	 */
	async editTrackedTime(
		taskId: string,
		intervalId: string,
		data: Record<string, unknown>,
		params?: Record<string, unknown>
	) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${taskId}/time/${intervalId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete tracked time for a task
	 *
	 * @param taskId The task id
	 * @param intervalId The interval id
	 * @param params The parameter options to pass in
	 */
	async deleteTrackedTime(taskId: string, intervalId: string, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${taskId}/time/${intervalId}`,
			params,
		});
	}

	/**
	 * Get tasks time in status
	 *
	 * @param taskId The task id
	 * @param options The parameter options to pass in
	 */
	async getTimeInStatus(taskId: string, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${taskId}/time_in_status`,
			params,
		});
	}

	/**
	 * Get bulk tasks time in status
	 *
	 * @param options The parameter options to pass in
	 */
	async getBulkTimeInStatus(params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/bulk_time_in_status/task_ids`,
			params,
		});
	}
}
