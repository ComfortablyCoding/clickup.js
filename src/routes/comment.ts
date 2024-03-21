import { Clickup } from '../client';
import { UpdateCommentData, UpdateCommentResult } from '../types';
import { Route } from './route';

export class Comment extends Route {
	constructor(client: Clickup) {
		super({
			client,
			route: 'comment',
		});
	}

	/**
	 * Update the content of a task comment, assign a comment, and mark a comment as resolved.
	 *
	 * @param commentId The comment id
	 * @param data The comment data
	 */
	update(commentId: number, data: UpdateCommentData) {
		return this.client.request<UpdateCommentResult>({
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
		return this.client.request<object>({
			method: 'DELETE',
			path: `${this.route}/${commentId}`,
		});
	}
}
