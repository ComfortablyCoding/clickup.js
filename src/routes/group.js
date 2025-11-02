import { Route } from "./route.js";

/**
 * @class
 * @extends Route
 */
export default class Group extends Route {
	/**
	 * @constructor
	 * @param {import('../client.js').Clickup} client
	 */
	constructor(client) {
		super({
			client,
			route: "group",
		});
	}

	/**
	 * Get all user groups within a team
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetTeams1}
	 *
	 * @param {object} [options] The query parameters to use
	 */
	get(options) {
		return this.client.request({
			path: `/${this.version}/${this.route}`,
			query: options,,
		});
	}

	/**
	 * Update a user group
	 * @see {@link https://clickup.com/api/clickupreference/operation/UpdateTeam}
	 *
	 * @param {string} groupId The group id
	 * @param {object} data The group data
	 */
	update(groupId, data) {
		return this.client.request({
			method: "PUT",
			path: `/${this.version}/${this.route}/${groupId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a user group
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteTeam}
	 *
	 * @param {string} groupId The group id
	 */
	delete(groupId) {
		return this.client.request({
			method: "DELETE",
			path: `/${this.version}/${this.route}/${groupId}`,
		});
	}
}
