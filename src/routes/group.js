import { Route } from "./route.js";

export class Group extends Route {
	constructor(client) {
		super({
			client,
			route: "group",
		});
	}

	/**
	 * Get all user groups within a team
	 *
	 * @param {object} [params] The query parameters to use
	 */
	get(params) {
		return this.client.request({
			path: `${this.route}`,
			params,
		});
	}

	/**
	 * Update a user group
	 *
	 * @param {string} groupId The group id
	 * @param {object} data The group data
	 */
	update(groupId, data) {
		return this.client.request({
			method: "PUT",
			path: `${this.route}/${groupId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a user group
	 *
	 * @param {string} groupId The group id
	 */
	delete(groupId) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${groupId}`,
		});
	}
}
