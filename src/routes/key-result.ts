import { Clickup } from '../client';
import { Route } from './route';

export class KeyResult extends Route {
	constructor(client: Clickup) {
		super({
			client,
			route: 'key_result',
		});
	}

	/**
	 * Update a key result (target)
	 *
	 * @param keyResultId The key result id
	 * @param data The key result data
	 */
	update(keyResultId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${keyResultId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a key result (target)
	 *
	 * @param keyResultId The key result id
	 */
	delete(keyResultId: string) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${keyResultId}`,
		});
	}
}
