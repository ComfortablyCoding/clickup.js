import { Route } from "./route.js";

/**
 * @class
 * @extends Route
 */
export class View extends Route {
	/**
	 * @constructor
	 * @param {import('../client.js').Clickup} client
	 */
	constructor(client) {
		super({
			client,
			route: "view",
		});
	}

	/**
	 * Get information about a specific task or page view
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetView}
	 *
	 * @param {string} viewId The view id
	 */
	get(viewId) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${viewId}`,
		});
	}

	/**
	 * Update a view
	 * @see {@link https://clickup.com/api/clickupreference/operation/UpdateView}
	 *
	 * @param {string} viewId The view id
	 * @param {object} data The view data
	 */
	update(viewId, data) {
		return this.client.request({
			method: "PUT",
			path: `/${this.version}/${this.route}/${viewId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a view
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteView}
	 *
	 * @param {string} viewId The view id
	 */
	delete(viewId) {
		return this.client.request({
			method: "DELETE",
			path: `/${this.version}/${this.route}/${viewId}`,
		});
	}

	/**
	 * Add a comment on a view
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateChatViewComment}
	 *
	 * @param {string} viewId The view id
	 * @param {object} data The comment data
	 */
	addComment(viewId, data) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${viewId}/comment`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all comments from a Chat view
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetChatViewComments}
	 *
	 * @param {string} viewId The view id
	 * @param {object} [params] The query parameters to pass
	 */
	comments(viewId, params) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${viewId}/comment`,
			params,
		});
	}

	/**
	 * Get all visible tasks in a view
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetViewTasks}
	 *
	 * @param {string} viewId The view id
	 * @param {object} [params] The query parameters to pass
	 */
	tasks(viewId, params) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${viewId}/task`,
			params: { page: 0, ...params },
		});
	}
}
