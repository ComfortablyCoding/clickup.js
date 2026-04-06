import { Route } from "../route.ts";
import type { Clickup } from "../client.ts";

/**
 * @module
 * @class
 * @extends Route
 */
export default class KeyResult extends Route {
	/**
	 * @constructor
	 * @param {Clickup} client
	 */
	constructor(client: Clickup) {
		super({
			client,
			route: "key_result",
		});
	}

	/**
	 * Update a key result (target)
	 * @see {@link https://clickup.com/api/clickupreference/operation/EditKeyResult}
	 *
	 * @param {string} keyResultId The key result id
	 * @param {object} data The key result data
	 */
	update(keyResultId: string, data: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			method: "PUT",
			path: `${this.version}/${this.route}/${keyResultId}`,
			body: data,
		});
	}

	/**
	 * Delete a key result (target)
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteKeyResult}
	 *
	 * @param {string} keyResultId The key result id
	 */
	delete(keyResultId: string): Promise<unknown> {
		return this.client.request({
			method: "DELETE",
			path: `${this.version}/${this.route}/${keyResultId}`,
		});
	}
}
