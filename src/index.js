const got = require('got');
const routes = require('./routes');

class Clickup {
	/**
	 *  Creates a client instance that connects to the Clickup API
	 *
	 * @constructor
	 * @param {String} token Clickup API Access Token
	 */
	constructor(token) {
		this._baseUrl = 'https://api.clickup.com/api/v2';
		this._token = token;
		this._headers = {
			authorization: this._token,
			'content-type': 'application/json',
		};
		this._service = this._createGotInstance();

		// pull in all routes
		this.authorization = new routes.Authorization(this);
		this.checklists = new routes.Checklists(this);
		this.comments = new routes.Comments(this);
		this.folders = new routes.Folders(this);
		this.goals = new routes.Goals(this);
		this.keyResults = new routes.KeyResults(this);
		this.lists = new routes.Lists(this);
		this.spaces = new routes.Spaces(this);
		this.tasks = new routes.Tasks(this);
		this.teams = new routes.Teams(this);
		this.views = new routes.Views(this);
		this.webhooks = new routes.Webhooks(this);
	}

	/**
	 * Creates a got instance with clickup default config
	 * @private
	 */
	_createGotInstance() {
		return got.extend({
			prefixUrl: this._baseUrl,
			headers: this._headers,
			responseType: 'json',
		});
	}

	/**
	 * Converts parameters for a request to URLSearchParams
	 *
	 * @param {Object} params parameters to be converted
	 * @private
	 */
	// eslint-disable-next-line class-methods-use-this
	_buildSearchParams(params) {
		return new URLSearchParams(Object.entries(params));
	}

	/**
	 * Makes an HTTP GET request
	 *
	 * @param {Object} options  Options to pass to the api call
	 * @param {String} options.endpoint The endpoint to make a request to
	 * @param {Object} options.params The parameters to add to the endpoint
	 */
	async get({ endpoint, params = {} }) {
		const searchParams = this._buildSearchParams(params);
		return this._service.get(endpoint, { searchParams });
	}

	/**
	 * Makes an HTTP POST request
	 *
	 * @param {Object} options  Options to pass to the api call
	 * @param {String} options.endpoint The endpoint to make a request to
	 * @param {Object} options.params The parameters to add to the endpoint
	 * @param {Object} options.body The data to send in the body of the request
	 * @param {Object} options.headers The headers to send along with the request
	 */
	async post({ endpoint, params = {}, body = {}, headers = {} }) {
		const searchParams = this._buildSearchParams(params);
		return this._service.post(endpoint, {
			searchParams,
			body,
			headers,
		});
	}

	/**
	 * Makes an HTTP PUT request
	 *
	 * @param {Object} options  Options to pass to the api call
	 * @param {String} options.endpoint The endpoint to make a request to
	 * @param {Object} options.params The parameters to add to the endpoint
	 * @param {Object} options.body The data to send in the body of the request
	 */
	async put({ endpoint, params = {}, body = {} }) {
		const searchParams = this._buildSearchParams(params);
		return this._service.put(endpoint, { searchParams, body });
	}

	/**
	 * Makes an HTTP DELETE request
	 *
	 * @param {Object} options  Options to pass to the api call
	 * @param {String} options.endpoint The endpoint to make a request to
	 * @param {Object} options.params The parameters to add to the endpoint
	 */
	async delete({ endpoint, params = {} }) {
		const searchParams = this._buildSearchParams(params);
		return this._service.delete(endpoint, { searchParams });
	}
}

module.exports = Clickup;
