import { Clickup } from '../client';

export class Folder {
	private client: Clickup;
	route: string;
	constructor(client: Clickup) {
		this.client = client;

		/**
		 * The main route for the collection
		 */
		this.route = 'folder';
	}

	/**
	 * Get a folder
	 *
	 * @param folderId The folder id
	 */
	get(folderId: number) {
		return this.client.request({
			path: `${this.route}/${folderId}`,
		});
	}

	/**
	 * Update a folder
	 *
	 * @param folderId The folder id
	 * @param data The folder data
	 */
	update(folderId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${folderId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a folder
	 *
	 * @param folderId The folder id
	 */
	delete(folderId: number) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${folderId}`,
		});
	}

	/**
	 *Add a guest to a folder
	 *
	 * @param folderId The folder id
	 * @param guestId The guest id
	 * @param data The guest data
	 * @param params The query parameters to use
	 */
	addGuest(folderId: number, guestId: number, data: Record<string, unknown>, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${folderId}/guest/${guestId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a guest's access to a folder
	 *
	 * @param folderId The folder id
	 * @param guestId The guest id
	 * @param params The query parameters to use
	 */
	removeGuest(folderId: number, guestId: number, params?: Record<string, unknown>) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${folderId}/guest/${guestId}`,
		});
	}

	/**
	 * Create a list
	 *
	 * @param folderId The folder id
	 * @param data The list data
	 */
	createList(folderId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${folderId}/list`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all lists within a folder
	 *
	 * @param folderId The folder id
	 * @param params The query parameters to pass
	 * @param params.archived If archived lists should be returned or not
	 */
	getLists(folderId: number, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${folderId}/list`,
			params,
		});
	}

	/**
	 * Create a List, Board, Calendar, Table, Timeline, Workload, Activity, Map, Chat, or Gantt view for a Folder
	 *
	 * @param folderId The folder id
	 * @param data The view data
	 */
	createView(folderId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${folderId}/view`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get the task and page views available for a Folder.
	 *
	 * @param folderId The folder id
	 */
	getViews(folderId: number) {
		return this.client.request({
			path: `${this.route}/${folderId}/view`,
		});
	}
}
