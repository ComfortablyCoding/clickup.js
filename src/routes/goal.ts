import { Clickup } from '../client';
import { Route } from './route';

export class Goal extends Route {
	constructor(client: Clickup) {
		super({
			client,
			route: 'goal',
		});
	}

	/**
	 * Get a goal
	 *
	 * @param goalId The goal id
	 */
	get(goalId: string) {
		return this.client.request({
			path: `${this.route}/${goalId}`,
		});
	}

	/**
	 * Update the goal name, set the due date, replace the description, add or remove owners, and set the Goal color
	 *
	 * @param goalId The goal id
	 * @param data The goal data
	 */
	update(goalId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${goalId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a goal from your team
	 *
	 * @param goalId The goal id
	 */
	delete(goalId: string) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${goalId}`,
		});
	}

	/**
	 * Create a key result (target)
	 *
	 * @param goalId The goal id
	 * @param data The key result data
	 */
	createKeyResult(goalId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${goalId}/key_result`,
			body: JSON.stringify(data),
		});
	}
}
