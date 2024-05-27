import { Route } from "./route.js";

export class Webhook extends Route {
	constructor(client) {
		super({
			client,
			route: "webhook",
		});
	}

	/**
	 * Update a webhook
	 * @see {@link https://clickup.com/api/clickupreference/operation/UpdateWebhook}
	 *
	 * @param {string} webhookId The webhook id
	 * @param {object} data The webhook data
	 */
	update(webhookId, data) {
		return this.client.request({
			method: "PUT",
			path: `${this.route}/${webhookId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a webhook
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteWebhook}
	 *
	 * @param {string} webhookId The webhook id
	 */
	delete(webhookId) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${webhookId}`,
		});
	}
}
