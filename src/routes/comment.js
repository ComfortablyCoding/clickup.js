import { Route } from "./route.js";

export class Comment extends Route {
	constructor(client) {
		super({
			client,
			route: "comment",
		});
	}

	/**
	 * Update the content of a task comment, assign a comment, and mark a comment as resolved.
	 * @see {@link https://clickup.com/api/clickupreference/operation/UpdateComment}
	 *
	 * @param {number} commentId The comment id
	 * @param {object} data The comment data
	 */
	update(commentId, data) {
		return this.client.request({
			method: "PUT",
			path: `${this.route}/${commentId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a comment
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteComment}
	 *
	 * @param {number} commentId The comment id
	 */
	delete(commentId) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${commentId}`,
		});
	}
}
