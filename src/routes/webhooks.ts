import { Clickup } from '../client';

export class Webhooks {
	private client: Clickup;
	route: string;
	constructor(client: Clickup) {
		this.client = client;

		/**
		 * The main route for the collection
		 */
		this.route = 'webhook';
	}

	/**
	 * Update a webhook
	 *
	 * @param webhookId The webhook id
	 * @param data The webhook data
	 */
	async update(webhookId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${webhookId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a webhook
	 *
	 * @param webhookId The webhook id
	 */
	async delete(webhookId: string) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${webhookId}`,
		});
	}
}
