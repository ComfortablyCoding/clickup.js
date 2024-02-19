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
	 * Get a view
	 *
	 * @param viewId The view id
	 */
	async get(viewId: string) {
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
	async update(viewId: string, data: Record<string, unknown>) {
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
	async delete(viewId: string) {
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
	async addComment(viewId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${viewId}/comment`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all comments on a view
	 *
	 * @param viewId The view id
	 */
	async getComments(viewId: string) {
		return this.client.request({
			path: `${this.route}/${viewId}/comment`,
		});
	}

	/**
	 * Get all tasks in a view
	 *
	 * @param viewId The view id
	 * @param params The query parameters to pass
	 * @param params.page The page to get
	 */
	async getTasks(viewId: string, params: Record<string, unknown> = { page: 0 }) {
		return this.client.request({
			path: `${this.route}/${viewId}/task`,
			params,
		});
	}
}
