export class Route {
	/**
	 * The main route for the collection
	 * @param {object} options
	 * @param {Clickup} options.client The clickup client instance
	 * @param {string} options.route The route path
	 */
	constructor(options) {
		this.client = options.client;
		this.route = options.route || "";
	}
}
