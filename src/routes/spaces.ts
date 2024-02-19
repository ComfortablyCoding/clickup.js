import { Clickup } from '../client';

export class Spaces {
	private client: Clickup;
	route: string;
	constructor(client: Clickup) {
		this.client = client;

		/**
		 * The main route for the collection
		 */
		this.route = 'space';
	}

	/**
	 * Get a space
	 *
	 * @param spaceId The space id
	 */
	get(spaceId: number) {
		return this.client.request({
			path: `${this.route}/${spaceId}`,
		});
	}

	/**
	 * Update a space
	 *
	 * @param spaceId The space id
	 * @param data The space data
	 */
	update(spaceId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${spaceId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a space
	 *
	 * @param spaceId The space id
	 */
	delete(spaceId: number) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${spaceId}`,
		});
	}

	/**
	 * Create a folder
	 *
	 * @param spaceId The space id
	 * @param data The folder data
	 */
	createFolder(spaceId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${spaceId}/folder`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all folders in a space
	 *
	 * @param spaceId The space id
	 * @param params The query parameters to pass
	 * @param params.archived If archived lists should be returned or not
	 */
	getFolders(spaceId: number, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${spaceId}/folder`,
			params,
		});
	}

	/**
	 * Create a folderless list
	 *
	 * @param spaceId The space id
	 * @param data The folderless list data
	 */
	createFolderlessList(spaceId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${spaceId}/list`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all folderless lists in a space
	 *
	 * @param spaceId The space id
	 * @param params The query parameters to pass
	 * @param params.archived If archived lists should be returned or not
	 */
	getFolderlessLists(spaceId: number, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${spaceId}/list`,
			params,
		});
	}

	/**
	 * Get all tags in a space
	 *
	 * @param spaceId The space id
	 */
	getTags(spaceId: number) {
		return this.client.request({
			path: `${this.route}/${spaceId}/tag`,
		});
	}

	/**
	 * Create a space tag
	 *
	 * @param spaceId The space id
	 * @param data The space tag data
	 */
	createTag(spaceId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${spaceId}/tag`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Update a space tag
	 *
	 * @param spaceId The space id
	 * @param tagName The tag name
	 */
	updateTag(spaceId: number, tagName: string) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${spaceId}/tag/${tagName}`,
		});
	}

	/**
	 * Delete a space tag
	 *
	 * @param spaceId The space id
	 * @param tagName The tag name
	 */
	deleteTag(spaceId: number, tagName: string) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${spaceId}/tag/${tagName}`,
		});
	}

	/**
	 * Create a view for a space
	 *
	 * @param spaceId The space id
	 * @param data The view data
	 */
	createView(spaceId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${spaceId}/view`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all views for a space
	 *
	 * @param spaceId The space id
	 */
	getViews(spaceId: number) {
		return this.client.request({
			path: `${this.route}/${spaceId}/view`,
		});
	}
}
