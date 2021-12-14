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
		// create service instance
		/**
		 * The request instance
		 * @private
		 */
		this._request = createRequestInstance(token, requestOptions);
	}

	/**
	 * Makes an HTTP GET request
	 *
	 * @param {Object} options  Options to pass to the api call
	 * @param {String} options.endpoint The endpoint to make a request to
	 * @param {Object} options.params The parameters to add to the endpoint
	 */
	async get({ endpoint, params }) {
		const options = {};
		if (params) {
			options.searchParams = buildSearchParams(params);
		}
		return this._request.get(endpoint, options);
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
	async post({ endpoint, params, data = {}, headers }) {
		const options = {};

		if (params) {
			options.searchParams = buildSearchParams(params);
		}

		let contentType = this._request.defaults.options.headers['content-type'];

		if (headers) {
			options.headers = headers;
			if (headers['content-type']) {
				contentType = headers['content-type'];
			}
		}

		// json data must be sent via json property, all others are sent via body
		const dataType = contentType === 'application/json' ? 'json' : 'body';
		options[dataType] = data;

		return this._request.post(endpoint, options);
	}

	/**
	 * Makes an HTTP PUT request
	 *
	 * @param {Object} options  Options to pass to the api call
	 * @param {String} options.endpoint The endpoint to make a request to
	 * @param {Object} options.params The query parameters to add to the request
	 * @param {Object} options.data The data to send in the body of the request
	 */
	async put({ endpoint, params, data = {} }) {
		const options = {};

		if (params) {
			options.searchParams = buildSearchParams(params);
		}

		// json data must be sent via json property, all others are sent via body
		const contentType = this._request.defaults.options.headers['content-type'];
		const dataType = contentType === 'application/json' ? 'json' : 'body';
		options[dataType] = data;

		return this._request.put(endpoint, options);
	}

	/**
	 * Makes an HTTP DELETE request
	 *
	 * @param {Object} options  Options to pass to the api call
	 * @param {String} options.endpoint The endpoint to make a request to
	 * @param {Object} options.params The query parameters to add to the request
	 */
	async delete({ endpoint, params }) {
		const options = {};
		if (params) {
			options.searchParams = buildSearchParams(params);
		}
		return this._request.delete(endpoint, options);
	}
}

module.exports = { Request };
