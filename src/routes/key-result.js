import { Route } from "../route.js";

/**
 * @class
 * @extends Route
 */
export default class KeyResult extends Route {
	/**
	 * @constructor
	 * @param {import('../client.js').Clickup} client
	 */
	constructor(client) {
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
	update(keyResultId, data) {
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
	delete(keyResultId) {
		return this.client.request({
			method: "DELETE",
			path: `${this.version}/${this.route}/${keyResultId}`,
		});
	}
}
