import { Clickup } from '../client';

export class Views {
	private client: Clickup;
	route: string;
	constructor(client: Clickup) {
		this.client = client;

		/**
		 * The main route for the collection
		 */
		this.route = 'view';
	}

	/**
	 * Get information about a specific task or page view
	 *
	 * @param viewId The view id
	 */
	get(viewId: string) {
		return this.client.request({
			path: `${this.route}/${viewId}`,
		});
	}

	/**
	 * Update a view
	 *
	 * @param viewId The view id
	 * @param data The view data
	 */
	update(viewId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${viewId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a view
	 *
	 * @param viewId The view id
	 */
	delete(viewId: string) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${viewId}`,
		});
	}

	/**
	 * Add a comment on a view
	 *
	 * @param viewId The view id
	 * @param data The comment data
	 */
	addComment(viewId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${viewId}/comment`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all comments from a Chat view
	 *
	 * @param viewId The view id
	 */
	getComments(viewId: string, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${viewId}/comment`,
			params,
		});
	}

	/**
	 * Get all visible tasks in a view
	 *
	 * @param viewId The view id
	 * @param params The query parameters to pass
	 */
	getTasks(viewId: string, params?: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}/${viewId}/task`,
			params: { page: 0, ...params },
		});
	}
}
