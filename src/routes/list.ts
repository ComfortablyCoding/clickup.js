import { Route } from "../route.ts";
import type { Clickup } from "../client.ts";

/**
 * @module
 * @class
 * @extends Route
 */
export default class List extends Route {
	/**
	 * @constructor
	 * @param {Clickup} client
	 */
	constructor(client: Clickup) {
		super({
			client,
			route: "list",
		});
	}

	/**
	 * Get a list
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetList}
	 *
	 * @param {number} listId The list id
	 */
	get(listId: number): Promise<unknown> {
		return this.client.request({
			path: `${this.version}/${this.route}/${listId}`,
		});
	}

	/**
	 * Update a list
	 * @see {@link https://clickup.com/api/clickupreference/operation/UpdateList}
	 *
	 * @param {string} listId The list id
	 * @param {object} data The list data
	 */
	update(listId: string, data: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			method: "PUT",
			path: `${this.version}/${this.route}/${listId}`,
			body: data,
		});
	}

	/**
	 * Delete a list
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteList}
	 *
	 * @param {number} listId The list id
	 */
	delete(listId: number): Promise<unknown> {
		return this.client.request({
			method: "DELETE",
			path: `${this.version}/${this.route}/${listId}`,
		});
	}

	/**
	 * Add a comment to a list
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateListComment}
	 *
	 * @param {string} listId The list id
	 * @param {object} data The comment data
	 */
	addComment(listId: string, data: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			method: "POST",
			path: `${this.version}/${this.route}/${listId}/comment`,
			body: data,
		});
	}

	/**
	 * Get all comments added to a list
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetListComments}
	 *
	 * @param {number} listId The list id
	 * @param {object} [options] The query parameters to use
	 */
	comments(listId: number, options?: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			path: `${this.version}/${this.route}/${listId}/comment`,
			query: options,
		});
	}

	/**
	 * Get all Custom Fields available on tasks in a specific list
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetAccessibleCustomFields}
	 *
	 * @param {number} listId The list id
	 */
	customFields(listId: number): Promise<unknown> {
		return this.client.request({
			path: `${this.version}/${this.route}/${listId}/field`,
		});
	}

	/**
	 * Share a list with a guest
	 * @see {@link https://clickup.com/api/clickupreference/operation/AddGuestToList}
	 *
	 * @param {number} listId The list id
	 * @param {number} guestId The guest id
	 * @param {object} data The guest data
	 * @param {object} [options] The query parameters to use
	 */
	addGuest(
		listId: number,
		guestId: number,
		data: Record<string, unknown>,
		options?: Record<string, unknown>,
	): Promise<unknown> {
		return this.client.request({
			method: "POST",
			path: `${this.version}/${this.route}/${listId}/guest/${guestId}`,
			query: options,
			body: data,
		});
	}

	/**
	 * Remove a guest's access to a list
	 * @see {@link https://clickup.com/api/clickupreference/operation/RemoveGuestFromList}
	 *
	 * @param {number} listId The list id
	 * @param {number} guestId The guest id
	 * @param {object} options The query parameters to use
	 */
	removeGuest(listId: number, guestId: number, options: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			method: "DELETE",
			path: `${this.version}/${this.route}/${listId}/guest/${guestId}`,
			query: options,
		});
	}

	/**
	 * Get all members of a list
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetListMembers}
	 *
	 * @param {number} listId The list id
	 */
	members(listId: number): Promise<unknown> {
		return this.client.request({
			path: `${this.version}/${this.route}/${listId}/member`,
		});
	}

	/**
	 * Create a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateTask}
	 *
	 * @param {number} listId The list id
	 * @param {object} data The task data
	 * @param {object} [options] The query parameters to use
	 */
	createTask(listId: number, data: Record<string, unknown>, options?: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			method: "POST",
			path: `${this.version}/${this.route}/${listId}/task`,
			query: options,
			body: data,
		});
	}

	/**
	 * Get all tasks in a list
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetTasks}
	 *
	 * @param {number} listId The list id
	 * @param {object} options The query parameters to pass
	 */
	tasks(listId: number, options: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			path: `${this.version}/${this.route}/${listId}/task`,
			query: options,
		});
	}

	/**
	 * Create a task from a template
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateTaskFromTemplate/#tag/Task-Templates/operation/CreateTaskFromTemplat}
	 *
	 * @param {number} listId The list id
	 * @param {string} templateId The template id
	 * @param {object} data The task data
	 */
	createTaskFromTemplate(listId: number, templateId: string, data: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			method: "POST",
			path: `${this.version}/${this.route}/${listId}/taskTemplate/${templateId}`,
			body: data,
		});
	}

	/**
	 * Create a List, Board, Calendar, Table, Timeline, Workload, Activity, Map, Chat, or Gantt view for a List
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateListView}
	 *
	 * @param {number} listId The list id
	 * @param {object} data The view data
	 */
	createView(listId: number, data: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			method: "POST",
			path: `${this.version}/${this.route}/${listId}/view`,
			body: data,
		});
	}

	/**
	 * Get the task and page views available for a List. Views and required views are separate responses
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetListViews}
	 *
	 * @param {number} listId The list id
	 */
	views(listId: number): Promise<unknown> {
		return this.client.request({
			path: `${this.version}/${this.route}/${listId}/view`,
		});
	}

	/**
	 * Add task to a list
	 * @see {@link https://clickup.com/api/clickupreference/operation/AddTaskToList}
	 *
	 * @param {number} listId The list id
	 * @param {string} taskId The task id
	 */
	addTask(listId: number, taskId: string): Promise<unknown> {
		return this.client.request({
			method: "POST",
			path: `${this.version}/${this.route}/${listId}/task/${taskId}`,
		});
	}

	/**
	 * Remove a task from a list
	 * @see {@link https://clickup.com/api/clickupreference/operation/RemoveTaskFromList}
	 *
	 * @param {number} listId The list id
	 * @param {string} taskId The task id
	 */
	removeTask(listId: number, taskId: string): Promise<unknown> {
		return this.client.request({
			method: "DELETE",
			path: `${this.version}/${this.route}/${listId}/task/${taskId}`,
		});
	}
}
