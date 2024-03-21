import { Clickup } from '../client';
import { Route } from './route';

export class Space extends Route {
	constructor(client: Clickup) {
		super({
			client,
			route: 'space',
		});
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
	 * Update a spaces name, set the space color, and enable ClickApps for a space.
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
	 * Create a folder in a space
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
	folders(spaceId: number, params?: Record<string, unknown>) {
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
	folderlessLists(spaceId: number, params?: Record<string, unknown>) {
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
	tags(spaceId: number) {
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
	addTag(spaceId: number, data: Record<string, unknown>) {
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
	 * @param data The space tag data
	 */
	editTag(spaceId: number, tagName: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${spaceId}/tag/${tagName}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a space tag
	 *
	 * @param spaceId The space id
	 * @param tagName The tag name
	 * @param data The space tag data
	 */
	removeTag(spaceId: number, tagName: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${spaceId}/tag/${tagName}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Create a List, Board, Calendar, Table, Timeline, Workload, Activity, Map, Chat, or Gantt view for a Space
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
	 * Get the task and page views available for a Space
	 *
	 * @param spaceId The space id
	 */
	views(spaceId: number) {
		return this.client.request({
			path: `${this.route}/${spaceId}/view`,
		});
	}
}
