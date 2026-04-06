import { Route } from "../route.ts";
import type { Clickup } from "../client.ts";

/**
 * @module
 * @class
 * @extends Route
 */
export default class Group extends Route {
	/**
	 * @constructor
	 * @param {Clickup} client
	 */
	constructor(client: Clickup) {
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
	get(options?: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			path: `${this.version}/${this.route}`,
			query: options,
		});
	}

	/**
	 * Update a user group
	 * @see {@link https://clickup.com/api/clickupreference/operation/UpdateTeam}
	 *
	 * @param {string} groupId The group id
	 * @param {object} data The group data
	 */
	update(groupId: string, data: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			method: "PUT",
			path: `${this.version}/${this.route}/${groupId}`,
			body: data,
		});
	}

	/**
	 * Delete a user group
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteTeam}
	 *
	 * @param {string} groupId The group id
	 */
	delete(groupId: string): Promise<unknown> {
		return this.client.request({
			method: "DELETE",
			path: `${this.version}/${this.route}/${groupId}`,
		});
	}
}
