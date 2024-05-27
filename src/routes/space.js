import { Route } from "./route.js";

export class Space extends Route {
	constructor(client) {
		super({
			client,
			route: "space",
		});
	}

	/**
	 * Get a space
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetSpace/}
	 *
	 * @param {number} spaceId The space id
	 */
	get(spaceId) {
		return this.client.request({
			path: `${this.route}/${spaceId}`,
		});
	}

	/**
	 * Update a spaces name, set the space color, and enable ClickApps for a space.
	 * @see {@link https://clickup.com/api/clickupreference/operation/UpdateSpace}
	 *
	 * @param {number} spaceId The space id
	 * @param {object} data The space data
	 */
	update(spaceId, data) {
		return this.client.request({
			method: "PUT",
			path: `${this.route}/${spaceId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a space
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteSpace}
	 *
	 * @param {number} spaceId The space id
	 */
	delete(spaceId) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${spaceId}`,
		});
	}

	/**
	 * Create a folder in a space
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateFolder}
	 *
	 * @param {number} spaceId The space id
	 * @param {object} data The folder data
	 */
	createFolder(spaceId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${spaceId}/folder`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all folders in a space
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetFolders}
	 *
	 * @param {number} spaceId The space id
	 * @param {object} [params] The query parameters to pass
	 * @param {boolean} params.archived If archived lists should be returned or not
	 */
	folders(spaceId, params) {
		return this.client.request({
			path: `${this.route}/${spaceId}/folder`,
			params,
		});
	}

	/**
	 * Create a folder-less list
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateFolderlessList}
	 *
	 * @param {number} spaceId The space id
	 * @param {object} data The folder-less list data
	 */
	createFolderlessList(spaceId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${spaceId}/list`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all folderless lists in a space
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetFolderlessLists}
	 *
	 * @param {number} spaceId The space id
	 * @param {object} [params] The query parameters to pass
	 * @param {boolean} params.archived If archived lists should be returned or not
	 */
	folderlessLists(spaceId, params) {
		return this.client.request({
			path: `${this.route}/${spaceId}/list`,
			params,
		});
	}

	/**
	 * Get all tags in a space
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetSpaceTags}
	 *
	 * @param {number} spaceId The space id
	 */
	tags(spaceId) {
		return this.client.request({
			path: `${this.route}/${spaceId}/tag`,
		});
	}

	/**
	 * Create a space tag
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateSpaceTag}
	 *
	 * @param {number} spaceId The space id
	 * @param {object} data The space tag data
	 */
	addTag(spaceId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${spaceId}/tag`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Update a space tag
	 * @see {@link https://clickup.com/api/clickupreference/operation/EditSpaceTag}
	 *
	 * @param {number} spaceId The space id
	 * @param {string} tagName The tag name
	 * @param {object} data The space tag data
	 */
	editTag(spaceId, tagName, data) {
		return this.client.request({
			method: "PUT",
			path: `${this.route}/${spaceId}/tag/${tagName}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a space tag
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteSpaceTag}
	 *
	 * @param {number} spaceId The space id
	 * @param {string} tagName The tag name
	 * @param {object} data The space tag data
	 */
	removeTag(spaceId, tagName, data) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${spaceId}/tag/${tagName}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Create a List, Board, Calendar, Table, Timeline, Workload, Activity, Map, Chat, or Gantt view for a Space
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateSpaceView}
	 *
	 * @param {number} spaceId The space id
	 * @param {object} data The view data
	 */
	createView(spaceId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${spaceId}/view`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get the task and page views available for a Space
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetSpaceViews}
	 *
	 * @param {number} spaceId The space id
	 */
	views(spaceId) {
		return this.client.request({
			path: `${this.route}/${spaceId}/view`,
		});
	}
}
