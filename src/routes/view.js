import { Route } from "../route.js";

/**
 * @module
 * @class
 * @extends Route
 */
export default class View extends Route {
	/**
	 * @constructor
	 * @param {Clickup} client
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
			path: `${this.version}/${this.route}/${viewId}`,
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
			path: `${this.version}/${this.route}/${viewId}`,
			body: data,
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
			path: `${this.version}/${this.route}/${viewId}`,
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
			path: `${this.version}/${this.route}/${viewId}/comment`,
			body: data,
		});
	}

	/**
	 * Get all comments from a Chat view
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetChatViewComments}
	 *
	 * @param {string} viewId The view id
	 * @param {object} [options] The query parameters to pass
	 */
	comments(viewId, options) {
		return this.client.request({
			path: `${this.version}/${this.route}/${viewId}/comment`,
			query: options,
		});
	}

	/**
	 * Get all visible tasks in a view
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetViewTasks}
	 *
	 * @param {string} viewId The view id
	 * @param {object} [options] The query parameters to pass
	 */
	tasks(viewId, options) {
		return this.client.request({
			path: `${this.version}/${this.route}/${viewId}/task`,
			query: { page: 0, ...options },
		});
	}
}
