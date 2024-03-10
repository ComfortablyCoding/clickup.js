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
	 * @param params The query parameters to use
	 */
	get(taskId: string, params?: Record<string, unknown>) {
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
	 * @param params The query parameters to use
	 */
	update(taskId: string, data: Record<string, unknown>, params?: Record<string, unknown>) {
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
	 * @param params The query parameters to use
	 */
	delete(taskId: string, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${taskId}`,
			params,
		});
	}

	/**
	 * Upload a file to a task as an attachment.
	 *
	 * @param taskId The task id
	 * @param attachment The attachments to add
	 * @param params The query parameters to use
	 */
	addAttachment(taskId: string, attachment: FormData, params?: Record<string, unknown>) {
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
	 * @param params The query parameters to use
	 */
	addComment(taskId: string, data: Record<string, unknown>, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${taskId}/comment`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all task comments
	 *
	 * @param taskId The task id
	 * @param params The query parameters to use
	 */
	getComments(taskId: string, params?: Record<string, unknown>) {
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
	 * @param params The query parameters to use
	 */
	createChecklist(taskId: string, data: Record<string, unknown>, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${taskId}/checklist`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Add data to a custom field on a task
	 *
	 * @param taskId The task id
	 * @param fieldId The uuid of the custom field
	 * @param data The custom field data
	 * @param params The query parameters to use
	 */
	addCustomFieldValue(
		taskId: string,
		fieldId: string,
		data: Record<string, unknown>,
		params?: Record<string, unknown>,
	) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${taskId}/field/${fieldId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a custom field value on a task
	 *
	 * @param taskId The task id
	 * @param fieldId The uuid of the custom field
	 * @param params The query parameters to use
	 */
	deleteCustomFieldValue(taskId: string, fieldId: string, params?: Record<string, unknown>) {
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
	 * @param params The query parameters to use
	 */
	addDependency(taskId: string, data: Record<string, unknown>, params?: Record<string, unknown>) {
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
	deleteDependency(taskId: string, params?: Record<string, unknown>) {
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
	 * @param params The query parameters to use
	 */
	addTaskLink(taskId: string, linksTo: string, params?: Record<string, unknown>) {
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
	 * @param params The query parameters to use
	 */
	deleteTaskLink(taskId: string, linksTo: string, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${taskId}/link/${linksTo}`,
			params,
		});
	}

	/**
	 * Share a task with a guest
	 *
	 * @param taskId The task id
	 * @param guestId The guest id
	 * @param data The guest data
	 * @param params The query parameters to use
	 */
	addGuest(taskId: string, guestId: number, data: Record<string, unknown>, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${taskId}/guest/${guestId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a guest's access to a task
	 *
	 * @param taskId The task id
	 * @param guestId The guest id
	 * @param params The query parameters to use
	 */
	removeGuest(taskId: string, guestId: number, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${taskId}/guest/${guestId}`,
			params,
		});
	}

	/**
	 * Get all members who have access to a task
	 *
	 * @param taskId The task id
	 */
	getMembers(taskId: string) {
		return this.client.request({
			path: `${this.route}/${taskId}/member`,
		});
	}

	/**
	 * Add a tag to a task
	 *
	 * @param taskId The task id
	 * @param tagName The tag name
	 * @param params The query parameters to use
	 */
	addTag(taskId: string, tagName: string, params?: Record<string, unknown>) {
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
	 * @param params The query parameters to use
	 */
	removeTag(taskId: string, tagName: string, params?: Record<string, unknown>) {
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
	 * @param params The query parameters to use
	 */
	trackTime(taskId: string, data: Record<string, unknown>, params?: Record<string, unknown>) {
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
	 * @param params The query parameters to use
	 */
	getTrackedTime(taskId: string, params?: Record<string, unknown>) {
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
	 * @param params The query parameters to use
	 */
	editTrackedTime(taskId: string, intervalId: string, data: Record<string, unknown>, params?: Record<string, unknown>) {
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
	 * @param params The query parameters to use
	 */
	deleteTrackedTime(taskId: string, intervalId: string, params?: Record<string, unknown>) {
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
	getTimeInStatus(taskId: string, params?: Record<string, unknown>) {
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
	getBulkTimeInStatus(params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/bulk_time_in_status/task_ids`,
			params,
		});
	}
}
