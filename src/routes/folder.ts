import { Route } from "../route.ts";
import type { Clickup } from "../client.ts";

/**
 * @module
 * @class
 * @extends Route
 */
export default class Folder extends Route {
	/**
	 * @constructor
	 * @param {Clickup} client
	 */
	constructor(client: Clickup) {
		super({
			client,
			route: "folder",
		});
	}

	/**
	 * Get a folder
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetFolder}
	 *
	 * @param {string} folderId The folder id
	 */
	get(folderId: string): Promise<unknown> {
		return this.client.request({
			path: `${this.version}/${this.route}/${folderId}`,
		});
	}

	/**
	 * Update a folder
	 * @see {@link https://clickup.com/api/clickupreference/operation/UpdateFolder}
	 *
	 * @param {number} folderId The folder id
	 * @param {object} data The folder data
	 */
	update(folderId: number, data: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			method: "PUT",
			path: `${this.version}/${this.route}/${folderId}`,
			body: data,
		});
	}

	/**
	 * Delete a folder
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteFolder}
	 *
	 * @param {number} folderId The folder id
	 */
	delete(folderId: number): Promise<unknown> {
		return this.client.request({
			method: "DELETE",
			path: `${this.version}/${this.route}/${folderId}`,
		});
	}

	/**
	 *Add a guest to a folder
	 * @see {@link https://clickup.com/api/clickupreference/operation/AddGuestToFolder}
	 *
	 * @param {number} folderId The folder id
	 * @param {number} guestId The guest id
	 * @param {object} data The guest data
	 * @param {object} [options] The query parameters to use
	 */
	addGuest(
		folderId: number,
		guestId: number,
		data: Record<string, unknown>,
		options?: Record<string, unknown>,
	): Promise<unknown> {
		return this.client.request({
			method: "POST",
			path: `${this.version}/${this.route}/${folderId}/guest/${guestId}`,
			query: options,
			body: data,
		});
	}

	/**
	 * Remove a guest's access to a folder
	 * @see {@link https://clickup.com/api/clickupreference/operation/RemoveGuestFromFolder}
	 *
	 * @param {number} folderId The folder id
	 * @param {number} guestId The guest id
	 * @param {object} [options] The query parameters to use
	 */
	removeGuest(folderId: number, guestId: number, options?: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			method: "DELETE",
			path: `${this.version}/${this.route}/${folderId}/guest/${guestId}`,
			query: options,
		});
	}

	/**
	 * Create a list
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateList}
	 *
	 * @param {number} folderId The folder id
	 * @param {object} data The list data
	 */
	createList(folderId: number, data: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			method: "POST",
			path: `${this.version}/${this.route}/${folderId}/list`,
			body: data,
		});
	}

	/**
	 * Get all lists within a folder
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetLists}
	 *
	 * @param {number} folderId The folder id
	 * @param {object} [options] The query parameters to pass
	 * @param {boolean} options.archived If archived lists should be returned or not
	 */
	lists(folderId: number, options?: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			path: `${this.version}/${this.route}/${folderId}/list`,
			query: options,
		});
	}

	/**
	 * Create a List, Board, Calendar, Table, Timeline, Workload, Activity, Map, Chat, or Gantt view for a Folder
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateFolderView}
	 *
	 * @param {number} folderId The folder id
	 * @param {object} data The view data
	 */
	createView(folderId: number, data: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			method: "POST",
			path: `${this.version}/${this.route}/${folderId}/view`,
			body: data,
		});
	}

	/**
	 * Get the task and page views available for a Folder.
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateSpaceView}
	 *
	 * @param {number} folderId The folder id
	 */
	views(folderId: number): Promise<unknown> {
		return this.client.request({
			path: `${this.version}/${this.route}/${folderId}/view`,
		});
	}

	/**
	 * Get all Custom Fields available in a folder

	 *
	 * @param {number} folderId The folder id
	 */
	customFields(folderId: number): Promise<unknown> {
		return this.client.request({
			path: `${this.version}/${this.route}/${folderId}/field`,
		});
	}
}
