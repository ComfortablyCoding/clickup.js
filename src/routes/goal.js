import { Route } from "./route.js";

export class Goal extends Route {
	constructor(client) {
		super({
			client,
			route: "goal",
		});
	}

	/**
	 * Get a goal
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
