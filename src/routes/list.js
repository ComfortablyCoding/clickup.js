import { Route } from "./route.js";

export class List extends Route {
	constructor(client) {
		super({
			client,
			route: "list",
		});
	}

	/**
	 * Get a list
	 *
	 * @param {number} listId The list id
	 */
	get(listId) {
		return this.client.request({
			path: `${this.route}/${listId}`,
		});
	}

	/**
	 * Update a list
	 *
	 * @param {string} listId The list id
	 * @param {object} data The list data
	 */
	update(listId, data) {
		return this.client.request({
			method: "PUT",
			path: `${this.route}/${listId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a list
	 *
	 * @param {number} listId The list id
	 */
	delete(listId) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${listId}`,
		});
	}

	/**
	 * Add a comment to a list
	 *
	 * @param {string} listId The list id
	 * @param {object} data The comment data
	 */
	addComment(listId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${listId}/comment`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all comments added to a list
	 *
	 * @param {number} listId The list id
	 * @param {object} [params] The query parameters to use
	 */
	comments(listId, params) {
		return this.client.request({
			path: `${this.route}/${listId}/comment`,
			params,
		});
	}

	/**
	 * Get all Custom Fields available on tasks in a specific list
	 *
	 * @param {number} listId The list id
	 */
	customFields(listId) {
		return this.client.request({
			path: `${this.route}/${listId}/field`,
		});
	}

	/**
	 * Share a list with a guest
	 *
	 * @param {number} listId The list id
	 * @param {number} guestId The guest id
	 * @param {object} data The guest data
	 * @param {object} [params] The query parameters to use
	 */
	addGuest(listId, guestId, data, params) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${listId}/guest/${guestId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a guest's access to a list
	 *
	 * @param {number} listId The list id
	 * @param {number} guestId The guest id
	 * @param {object} params The query parameters to use
	 */
	removeGuest(listId, guestId, params) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${listId}/guest/${guestId}`,
			params,
		});
	}

	/**
	 * Get all members of a list
	 *
	 * @param {number} listId The list id
	 */
	members(listId) {
		return this.client.request({
			path: `${this.route}/${listId}/member`,
		});
	}

	/**
	 * Create a task
	 *
	 * @param {number} listId The list id
	 * @param {object} data The task data
	 * @param {object} [params] The query parameters to use
	 */
	createTask(listId, data, params) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${listId}/task`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all tasks in a list
	 *
	 * @param {number} listId The list id
	 * @param {object} params The query parameters to pass
	 */
	tasks(listId, params) {
		return this.client.request({
			path: `${this.route}/${listId}/task`,
			params,
		});
	}

	/**
	 * Create a task from a template
	 *
	 * @param {number} listId The list id
	 * @param {string} templateId The template id
	 * @param {object} data The task data
	 */
	createTaskFromTemplate(listId, templateId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${listId}/taskTemplate/${templateId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Create a List, Board, Calendar, Table, Timeline, Workload, Activity, Map, Chat, or Gantt view for a List
	 *
	 * @param {number} listId The list id
	 * @param {object} data The view data
	 */
	createView(listId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${listId}/view`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get the task and page views available for a List. Views and required views are separate responses
	 *
	 * @param {number} listId The list id
	 */
	views(listId) {
		return this.client.request({
			path: `${this.route}/${listId}/view`,
		});
	}

	/**
	 * Add task to a list
	 *
	 * @param {number} listId The list id
	 * @param {string} taskId The task id
	 */
	addTask(listId, taskId) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${listId}/task/${taskId}`,
		});
	}

	/**
	 * Remove a task from a list
	 *
	 * @param {number} listId The list id
	 * @param {string} taskId The task id
	 */
	removeTask(listId, taskId) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${listId}/task/${taskId}`,
		});
	}
}
