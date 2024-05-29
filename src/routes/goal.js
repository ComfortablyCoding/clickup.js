import { Route } from "./route.js";

/**
 * @class
 * @extends Route
 */
export class Goal extends Route {
	/**
	 * @constructor
	 * @param {import('../client.js').Clickup} client
	 */
	constructor(client) {
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
	get(goalId) {
		return this.client.request({
			path: `${this.route}/${goalId}`,
		});
	}

	/**
	 * Update the goal name, set the due date, replace the description, add or remove owners, and set the Goal color
	 * @see {@link https://clickup.com/api/clickupreference/operation/UpdateGoal}
	 *
	 * @param {string} goalId The goal id
	 * @param {object} data The goal data
	 */
	update(goalId, data) {
		return this.client.request({
			method: "PUT",
			path: `${this.route}/${goalId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a goal from your team
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteGoal}
	 *
	 * @param {string} goalId The goal id
	 */
	delete(goalId) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${goalId}`,
		});
	}

	/**
	 * Create a key result (target)
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateKeyResult}
	 *
	 * @param {string} goalId The goal id
	 * @param {object} data The key result data
	 */
	createKeyResult(goalId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${goalId}/key_result`,
			body: JSON.stringify(data),
		});
	}
}
