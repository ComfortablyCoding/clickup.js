import { Route } from "./route.js";

export class Folder extends Route {
	constructor(client) {
		super({
			client,
			route: "folder",
		});
	}

	/**
	 * Get a folder
	 *
	 * @param {string} folderId The folder id
	 */
	get(folderId) {
		return this.client.request({
			path: `${this.route}/${folderId}`,
		});
	}

	/**
	 * Update a folder
	 *
	 * @param {number} folderId The folder id
	 * @param {object} data The folder data
	 */
	update(folderId, data) {
		return this.client.request({
			method: "PUT",
			path: `${this.route}/${folderId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a folder
	 *
	 * @param {number} folderId The folder id
	 */
	delete(folderId) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${folderId}`,
		});
	}

	/**
	 *Add a guest to a folder
	 *
	 * @param {number} folderId The folder id
	 * @param {number} guestId The guest id
	 * @param {object} data The guest data
	 * @param {object} [params] The query parameters to use
	 */
	addGuest(folderId, guestId, data, params) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${folderId}/guest/${guestId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a guest's access to a folder
	 *
	 * @param {number} folderId The folder id
	 * @param {number} guestId The guest id
	 * @param {object} [params] The query parameters to use
	 */
	removeGuest(folderId, guestId, params) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${folderId}/guest/${guestId}`,
			params,
		});
	}

	/**
	 * Create a list
	 *
	 * @param {number} folderId The folder id
	 * @param {object} data The list data
	 */
	createList(folderId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${folderId}/list`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all lists within a folder
	 *
	 * @param {number} folderId The folder id
	 * @param {object} [params] The query parameters to pass
	 * @param {boolean} params.archived If archived lists should be returned or not
	 */
	lists(folderId, params) {
		return this.client.request({
			path: `${this.route}/${folderId}/list`,
			params,
		});
	}

	/**
	 * Create a List, Board, Calendar, Table, Timeline, Workload, Activity, Map, Chat, or Gantt view for a Folder
	 *
	 * @param {number} folderId The folder id
	 * @param {object} data The view data
	 */
	createView(folderId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${folderId}/view`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get the task and page views available for a Folder.
	 *
	 * @param {number} folderId The folder id
	 */
	views(folderId) {
		return this.client.request({
			path: `${this.route}/${folderId}/view`,
		});
	}
}
