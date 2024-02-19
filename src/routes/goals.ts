import { Clickup } from '../client';

export class Goals {
	private client: Clickup;
	route: string;
	constructor(client: Clickup) {
		this.client = client;

		/**
		 * The main route for the collection
		 */
		this.route = 'goal';
	}

	/**
	 * Get a goal
	 *
	 * @param goalId The goal id
	 */
	async get(goalId: string) {
		return this.client.request({
			path: `${this.route}/${goalId}`,
		});
	}

	/**
	 * Update a goal
	 *
	 * @param goalId The goal id
	 * @param data The goal data
	 */
	async update(goalId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${goalId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a goal
	 *
	 * @param goalId The goal id
	 */
	async delete(goalId: string) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${goalId}`,
		});
	}

	/**
	 * Create a key result
	 *
	 * @param goalId The goal id
	 * @param data The key result data
	 */
	async createKeyResult(goalId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${goalId}/key_result`,
			body: JSON.stringify(data),
		});
	}
}
