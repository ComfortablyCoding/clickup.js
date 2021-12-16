const { createRequestInstance } = require('../utils/createRequestInstance');
const { buildSearchParams } = require('../utils/buildSearchParams');

class Request {
	/**
	 *  Creates a client instance that connects to the Clickup API
	 *
	 * @constructor
	 * @param {import('got/dist/source').ExtendOptions} requestOptions Options for the created request instance.
	 */
	constructor(token, requestOptions) {
		/**
		 * The access token
		 */
		this._token = token;
		// create service instance
		/**
		 * The request instance
		 * @private
		 */
		this._instance = createRequestInstance(token, requestOptions);
	}

	/**
	 * Makes an HTTP GET request
	 *
	 * @param {Object} options  Options to pass to the api call
	 * @param {String} options.endpoint The endpoint to make a request to
	 * @param {Object} options.params The parameters to add to the endpoint
	 */
	async get({ endpoint, params }) {
		return this._request({ endpoint, method: 'GET', params });
	}

	/**
	 * Makes an HTTP POST request
	 *
	 * @param {Object} options  Options to pass to the api call
	 * @param {String} options.endpoint The endpoint to make a request to
	 * @param {Object} options.params The query parameters to add to the request
	 * @param {Object} options.data The data to send in the body of the request
	 * @param {Object} options.headers The headers to send along with the request
	 */
	async post({ endpoint, params, data, headers }) {
		return this._request({ endpoint, method: 'POST', params, data, headers });
	}

	/**
	 * Makes an HTTP PUT request
	 *
	 * @param {Object} options  Options to pass to the api call
	 * @param {String} options.endpoint The endpoint to make a request to
	 * @param {Object} options.params The query parameters to add to the request
	 * @param {Object} options.data The data to send in the body of the request
	 */
	async put({ endpoint, params, data }) {
		return this._request({ endpoint, method: 'PUT', params, data });
	}

	/**
	 * Makes an HTTP DELETE request
	 *
	 * @param {Object} options  Options to pass to the api call
	 * @param {String} options.endpoint The endpoint to make a request to
	 * @param {Object} options.params The query parameters to add to the request
	 */
	async delete({ endpoint, params }) {
		return this._request({ endpoint, method: 'DELETE', params });
	}

	/**
	 * Makes an HTTP request
	 *
	 * @param {Object} options  Options to pass to the api call
	 * @param {String} options.endpoint The endpoint to make a request to
	 * @param {String} options.method The request method to use in the request
	 * @param {Object} options.params The query parameters to add to the request
	 * @param {Object} options.data The data to send in the body of the request
	 * @param {Object} options.headers The headers to send along with the request
	 */
	async _request({ endpoint, method = 'GET', params, data = {}, headers }) {
		const options = {
			method,
		};

		if (params) {
			options.searchParams = buildSearchParams(params);
		}

		let contentType = this.getHeader('content-type');

		if (headers) {
			options.headers = headers;
			if (headers['content-type']) {
				contentType = headers['content-type'];
			}
		}

		if (method !== 'GET') {
			// json data must be sent via json property, all others are sent via body
			const dataType = contentType === 'application/json' ? 'json' : 'body';
			options[dataType] = data;
		}

		return this._instance(endpoint, options);
	}

	/**
	 * Helper to obtain the instance headers
	 */
	getHeaders() {
		const options = this.getOptions();
		return options.headers;
	}

	/**
	 * Helper to obtain a specific header
	 */
	getHeader(name) {
		const options = this.getOptions();
		return options.headers[name];
	}

	/**
	 * Helper to obtain the access token
	 */
	getToken() {
		return this._token;
	}

	/**
	 * Helper to obtain the options
	 */
	getOptions() {
		return this._instance.defaults.options;
	}
}

module.exports = { Request };
