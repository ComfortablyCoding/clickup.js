import { Clickup } from '../client';
import { AccessTokenQuery, AccessTokenResult, AuthorizedTeamsResult, AuthorizedUserResult } from '../types';
import { Route } from './route';

export class Authorization extends Route {
	constructor(client: Clickup) {
		super({
			client,
		});
	}

	/**
	 * Get the access token for the given client
	 * @param params The query parameters to pass
	 */
	accessToken(params: AccessTokenQuery) {
		return this.client.request<AccessTokenResult>({
			method: 'POST',
			path: 'oauth/token',
			params,
		});
	}

	/**
	 * Get the details of the authenticated user's ClickUp account
	 */
	user() {
		return this.client.request<AuthorizedUserResult>({
			path: 'user',
		});
	}

	/**
	 * Get the teams (workspaces) available to the authenticated user
	 */
	teams() {
		return this.client.request<AuthorizedTeamsResult>({
			path: 'team',
		});
	}
}
