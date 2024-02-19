import { Clickup } from '../client';

export class KeyResults {
	private client: Clickup;
	route: string;
	constructor(client: Clickup) {
		this.client = client;

		/**
		 * The main route for the collection
		 */
		this.route = 'key_result';
	}

	/**
	 * Update a key result
	 *
	 * @param keyResultId The key result id
	 * @param data The key result data
	 */
	updateKeyResult(keyResultId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${keyResultId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a key result
	 *
	 * @param keyResultId The key result id
	 */
	deleteKeyResult(keyResultId: string) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${keyResultId}`,
		});
	}
}
