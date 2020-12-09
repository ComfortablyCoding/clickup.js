const got = require('got');
const routes = require('./routes');

class Clickup {
	/**
	 *  Creates a client instance that connects to the Clickup API
	 *
	 * @constructor
	 * @param {String} token Clickup API Access Token
	 */
	constructor(token, gotOptions) {
		this._baseUrl = 'https://api.clickup.com/api/v2';
		this._token = token;
		this._headers = {
			authorization: this._token,
			'content-type': 'application/json',
		};
		this._service = this._createGotInstance(gotOptions);

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
	 * @param {Object} gotOptions Options for the created got instance. All options can be found [here](https://github.com/sindresorhus/got#options)
	 */
	_createGotInstance(gotOptions = {}) {
		const gotInstance = gotOptions;

		// validate required Got properties
		if (gotInstance.headers) {
			if (!gotInstance.headers.authorization) {
				gotInstance.headers.authorization = this._token;
			}
			if (!gotInstance.headers['content-type']) {
				gotInstance.headers['content-type'] = 'application/json';
			}
		} else {
			gotInstance.headers = {
				authorization: this._token,
				'content-type': 'application/json',
			};
		}
		if (!gotInstance.responseType) {
			gotInstance.responseType = 'json';
		}

		if (!gotInstance.prefixUrl) {
			gotInstance.prefixUrl = 'https://api.clickup.com/api/v2';
		}

		return got.extend(gotInstance);
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
	async post({ endpoint, params = {}, json = {}, body = {}, headers = {} }) {
		const searchParams = this._buildSearchParams(params);

		const options = {
			searchParams,
			headers,
		};

		if (Object.getOwnPropertyNames(json).length) {
			options.json = json;
		} else {
			options.body = body;
		}

		return this._service.post(endpoint, options);
	}

	/**
	 * Makes an HTTP PUT request
	 *
	 * @param {Object} options  Options to pass to the api call
	 * @param {String} options.endpoint The endpoint to make a request to
	 * @param {Object} options.params The parameters to add to the endpoint
	 * @param {Object} options.body The data to send in the body of the request
	 */
	async put({ endpoint, params = {}, json = {}, body = {} }) {
		const searchParams = this._buildSearchParams(params);

		const options = {
			searchParams,
		};

		if (Object.getOwnPropertyNames(json).length) {
			options.json = json;
		} else {
			options.body = body;
		}

		return this._service.put(endpoint, options);
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
