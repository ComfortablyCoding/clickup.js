const got = require('got');
const { merge } = require('./merge');

/**
 * Creates a got instance with clickup default config
 * @private
 * @param {got.ExtendOptions} requestOptions Options for the created got instance. All options can be found [here](https://github.com/sindresorhus/got#options)
 * @returns {got.Got} A got instance
 */
const createRequestInstance = (token, requestOptions = {}) => {
	const requestDefaultOptions = {
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
		responseType: 'json',
		prefixUrl: 'https://api.clickup.com/api/v2',
	};
	// apply defaults where necessary
	const requestConfig = merge(requestOptions, requestDefaultOptions);
	return got.extend(requestConfig);
};

module.exports = {
	createRequestInstance,
};
