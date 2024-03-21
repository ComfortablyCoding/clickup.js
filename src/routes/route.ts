import { Clickup } from '../client';
import { RouteOptions } from '../types';

export class Route {
	protected client: Clickup;
	/**
	 * The main route for the collection
	 */
	protected route: string;
	constructor(options: RouteOptions) {
		this.client = options.client;
		this.route = options.route || '';
	}
}
