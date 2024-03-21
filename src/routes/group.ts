import { Clickup } from '../client';
import { Route } from './route';

export class Group extends Route {
	constructor(client: Clickup) {
		super({
			client,
			route: 'group',
		});
	}

	/**
	 * Get all user groups within a team
	 *
	 * @param params The query parameters to use
	 */
	get(params: Record<string, unknown>) {
		return this.client.request({
			path: `${this.route}`,
			params,
		});
	}

	/**
	 * Update a user group
	 *
	 * @param groupId The group id
	 * @param data The group data
	 */
	update(groupId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${groupId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a user group
	 *
	 * @param groupId The group id
	 */
	deleteKeyResult(groupId: string) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${groupId}`,
		});
	}
}
