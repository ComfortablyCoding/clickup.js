import { Route } from "./route.js";

/**
 * @class
 * @extends Route
 */
export class Comment extends Route {
	/**
	 * @constructor
	 * @param {import('../client.js').Clickup} client
	 */
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
			path: `/${this.version}/${this.route}/${commentId}`,
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
			path: `/${this.version}/${this.route}/${commentId}`,
		});
	}

	/**
	 * Get comment thread/replies
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetThreadedComments}
	 *
	 * @param {number} commentId The comment id
	 */
	replies(commentId) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${commentId}/reply`,
		});
	}

	/**
	 * Add a reply comment
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateThreadedComment}
	 *
	 * @param {number} commentId The comment id
	 * @param {object} data The comment data
	 */
	addReply(commentId, data) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${commentId}/reply`,
			body: JSON.stringify(data),
		});
	}
}
