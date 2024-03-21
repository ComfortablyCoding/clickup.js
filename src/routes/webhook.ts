import { Clickup } from '../client';
import { Route } from './route';

export class Webhook extends Route {
	constructor(client: Clickup) {
		super({
			client,
			route: 'webhook',
		});
	}

	/**
	 * Update a webhook
	 *
	 * @param webhookId The webhook id
	 * @param data The webhook data
	 */
	update(webhookId: string, data: Record<string, unknown>) {
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
	delete(webhookId: string) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${webhookId}`,
		});
	}
}
