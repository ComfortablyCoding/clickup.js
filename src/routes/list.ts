import { Clickup } from '../client';

export class List {
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
	update(listId: string, data: Record<string, unknown>) {
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
	 * Add a comment to a list
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
	 * Get all comments added to a list
	 *
	 * @param listId The list id
	 */
	getComments(listId: number, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${listId}/comment`,
			params,
		});
	}

	/**
	 * Get all Custom Fields available on tasks in a specific list
	 *
	 * @param listId The list id
	 */
	getAccessibleCustomFields(listId: number) {
		return this.client.request({
			path: `${this.route}/${listId}/field`,
		});
	}

	/**
	 * Share a lit with a guest
	 *
	 * @param listId The list id
	 * @param guestId The guest id
	 * @param data The guest data
	 * @param params The query parameters to use
	 */
	addGuest(listId: number, guestId: number, data: Record<string, unknown>, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${listId}/guest/${guestId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a guest's access to a list
	 *
	 * @param listId The list id
	 * @param guestId The guest id
	 * @param params The query parameters to use
	 */
	removeGuest(listId: number, guestId: number, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${listId}/guest/${guestId}`,
			params,
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
	 * @param params The query parameters to use
	 */
	createTask(listId: number, data: Record<string, unknown>, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${listId}/task`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all tasks in a list
	 *
	 * @param listId The list id
	 * @param params The query parameters to pass
	 */
	getTasks(listId: number, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${listId}/task`,
			params,
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
	 * Create a List, Board, Calendar, Table, Timeline, Workload, Activity, Map, Chat, or Gantt view for a List
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
	 * Get the task and page views available for a List. Views and required views are separate responses
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
