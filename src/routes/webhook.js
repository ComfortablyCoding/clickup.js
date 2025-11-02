import { Route } from "../route.js";

/**
 * @class
 * @extends Route
 */
export default class Webhook extends Route {
	/**
	 * @constructor
	 * @param {import('../client.js').Clickup} client
	 */
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
			path: `${this.version}/${this.route}/${webhookId}`,
			body: data,
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
			path: `${this.version}/${this.route}/${webhookId}`,
		});
	}
}
