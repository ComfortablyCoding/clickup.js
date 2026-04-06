import { Route } from "../route.ts";
import type { Clickup } from "../client.ts";

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
	constructor(client: Clickup) {
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
	get(viewId: string): Promise<unknown> {
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
	update(viewId: string, data: Record<string, unknown>): Promise<unknown> {
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
	delete(viewId: string): Promise<unknown> {
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
	addComment(viewId: string, data: Record<string, unknown>): Promise<unknown> {
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
	comments(viewId: string, options?: Record<string, unknown>): Promise<unknown> {
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
	tasks(viewId: string, options?: Record<string, unknown>): Promise<unknown> {
		return this.client.request({
			path: `${this.version}/${this.route}/${viewId}/task`,
			query: { page: 0, ...options },
		});
	}
}
