import { Route } from "../route.ts";
import type { Clickup } from "../client.ts";

/**
 * @module
 * @class
 * @extends Route
 */
export default class Webhook extends Route {
	/**
	 * @constructor
	 * @param {Clickup} client
	 */
	constructor(client: Clickup) {
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
	update(webhookId: string, data: Record<string, unknown>): Promise<unknown> {
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
	delete(webhookId: string): Promise<unknown> {
		return this.client.request({
			method: "DELETE",
			path: `${this.version}/${this.route}/${webhookId}`,
		});
	}
}
