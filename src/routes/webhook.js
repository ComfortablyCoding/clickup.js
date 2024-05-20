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
