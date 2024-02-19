import { Clickup } from '../client';

export class Comments {
	private client: Clickup;
	route: string;
	constructor(client: Clickup) {
		this.client = client;

		/**
		 * The main route for the collection
		 */
		this.route = 'comment';
	}

	/**
	 * Update a comment
	 *
	 * @param commentId The comment id
	 * @param data The comment data
	 */
	update(commentId: number, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${commentId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a comment
	 *
	 * @param commentId The comment id
	 */
	delete(commentId: number) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${commentId}`,
		});
	}
}
