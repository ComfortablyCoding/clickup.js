import { Clickup } from '../client';

export class Folders {
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
	async get(folderId: number) {
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
	async update(folderId: number, data: Record<string, unknown>) {
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
	async delete(folderId: number) {
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
	 */
	async addGuest(folderId: number, guestId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${folderId}/guest/${guestId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a guest from a folder
	 *
	 * @param folderId The folder id
	 * @param guestId The guest id
	 */
	async removeGuest(folderId: number, guestId: number) {
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
	async createList(folderId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${folderId}/list`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all lists in a folder
	 *
	 * @param folderId The folder id
	 * @param params The query parameters to pass
	 * @param params.archived If archived lists should be returned or not
	 */
	async getLists(folderId: number, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${folderId}/list`,
			params,
		});
	}

	/**
	 * Create a view for a folder
	 *
	 * @param folderId The folder id
	 * @param data The view data
	 */
	async createView(folderId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${folderId}/view`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all views for a folder
	 *
	 * @param folderId The folder id
	 */
	async getViews(folderId: number) {
		return this.client.request({
			path: `${this.route}/${folderId}/view`,
		});
	}
}
