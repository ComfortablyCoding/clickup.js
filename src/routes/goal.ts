import { Route } from "../route.ts";
import type { Clickup } from "../client.ts";

/**
 * @module
 * @class
 * @extends Route
 */
export default class Goal extends Route {
	/**
	 * @constructor
	 * @param {Clickup} client
	 */
	constructor(client: Clickup) {
		super({
			client,
			route: "goal",
		});
	}

	/**
	 * Get a goal
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetGoal}
	 *
	 * @param {string} goalId The goal id
	 */
	get(goalId: string): Promise<unknown> {
		return this.client.request({
			path: `${this.version}/${this.route}/${goalId}`,
		});
	}

	/**
	 * Update the goal name, set the due date, replace the description, add or remove owners, and set the Goal color
	 * @see {@link https://clickup.com/api/clickupreference/operation/UpdateGoal}
	 *
	 * @param {string} goalId The goal id
	 * @param {object} data The goal data
	 */
	update(goalId: string, data: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			method: "PUT",
			path: `${this.version}/${this.route}/${goalId}`,
			body: data,
		});
	}

	/**
	 * Delete a goal from your team
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteGoal}
	 *
	 * @param {string} goalId The goal id
	 */
	delete(goalId: string): Promise<unknown> {
		return this.client.request({
			method: "DELETE",
			path: `${this.version}/${this.route}/${goalId}`,
		});
	}

	/**
	 * Add a key result (target)
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateKeyResult}
	 *
	 * @param {string} goalId The goal id
	 * @param {object} data The key result data
	 */
	addKeyResult(goalId: string, data: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			method: "POST",
			path: `${this.version}/${this.route}/${goalId}/key_result`,
			body: data,
		});
	}
}
