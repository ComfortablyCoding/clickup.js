import { Clickup } from '../client';

export class Lists {
	private client: Clickup;
	route: string;
	constructor(client: Clickup) {
		this.client = client;

		/**
		 * The main route for the collection
		 */
		this.route = 'list';
	}

	/**
	 * Get a list
	 *
	 * @param listId The list id
	 */
	get(listId: number) {
		return this.client.request({
			path: `${this.route}/${listId}`,
		});
	}

	/**
	 * Update a list
	 *
	 * @param listId The list id
	 * @param data The list data
	 */
	update(listId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${listId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a list
	 *
	 * @param listId The list id
	 */
	delete(listId: number) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${listId}`,
		});
	}

	/**
	 * Add a list comment
	 *
	 * @param listId The list id
	 * @param data The comment data
	 */
	addComment(listId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${listId}/comment`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all comments on a list
	 *
	 * @param listId The list id
	 */
	getComments(listId: number) {
		return this.client.request({
			path: `${this.route}/${listId}/comment`,
		});
	}

	/**
	 * Get all accessible custom fields of a list
	 *
	 * @param listId The list id
	 */
	getAccessibleCustomFields(listId: number) {
		return this.client.request({
			path: `${this.route}/${listId}/field`,
		});
	}

	/**
	 * Add a guest to a list
	 *
	 * @param listId The list id
	 * @param guestId The guest id
	 * @param data The guest data
	 */
	addGuest(listId: number, guestId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${listId}/guest/${guestId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a guest from a list
	 *
	 * @param listId The list id
	 * @param guestId The guest id
	 */
	removeGuest(listId: number, guestId: number) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${listId}/guest/${guestId}`,
		});
	}

	/**
	 * Get all members of a list
	 *
	 * @param listId The list id
	 */
	getMembers(listId: number) {
		return this.client.request({
			path: `${this.route}/${listId}/member`,
		});
	}

	/**
	 * Create a task
	 *
	 * @param listId The list id
	 * @param data The task data
	 */
	createTask(listId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${listId}/task`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all tasks in a list
	 *
	 * @param {Number} listId The list id
	 * @param {Object} [options] The parameter options to pass in
	 */
	getTasks(listId: number, options?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${listId}/task`,
			params: options,
		});
	}

	/**
	 * Create a task from a template
	 *
	 * @param listId The list id
	 * @param templateId The template id
	 * @param data The task data
	 */
	createTaskFromTemplate(listId: number, templateId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${listId}/taskTemplate/${templateId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Create a view for a list
	 *
	 * @param listId The list id
	 * @param data The view data
	 */
	createView(listId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${listId}/view`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all views for a list
	 *
	 * @param listId The list id
	 */
	getViews(listId: number) {
		return this.client.request({
			path: `${this.route}/${listId}/view`,
		});
	}

	/**
	 * Add task to a list
	 *
	 * @param listId The list id
	 * @param taskId The task id
	 */
	addTaskToList(listId: number, taskId: string) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${listId}/task/${taskId}`,
		});
	}

	/**
	 * Remove a task from a list
	 *
	 * @param listId The list id
	 * @param taskId The task id
	 */
	removeTaskFromList(listId: number, taskId: string) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${listId}/task/${taskId}`,
		});
	}

	/**
	 * Get list members
	 *
	 * @param listId The list id
	 */
	getListMembers(listId: number) {
		return this.client.request({
			path: `${this.route}/${listId}/member`,
		});
	}
}
