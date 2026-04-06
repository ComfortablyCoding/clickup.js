import type { Clickup } from "./client.ts";
import type { RouteOptions } from "./types.ts";

/**
 * @class
 */
export class Route {
	client: Clickup;
	route: string;
	version: string;

	/**
	 * The main route for the collection
	 *
	 * @constructor
	 * @param {RouteOptions} options
	 * @param {Clickup} options.client The clickup client instance
	 * @param {string} options.route The route path
	 * @param {string} options.version The API version
	 */
	constructor(options: RouteOptions) {
		this.client = options.client;
		this.route = options.route || "";
		this.version = options.version || "v2";
	}
}
