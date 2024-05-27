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

	/**
	 * Get threaded comments
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetThreadedComments}
	 *
	 * @param {number} commentId The comment id
	 */
	threaded(commentId) {
		return this.client.request({
			path: `${this.route}/${commentId}/reply`,
		});
	}

	/**
	 * Create a threaded comment
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateThreadedComment}
	 *
	 * @param {number} commentId The comment id
	 * @param {object} data The comment data
	 */
	createThread(commentId) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${commentId}/reply`,
		});
	}
}
