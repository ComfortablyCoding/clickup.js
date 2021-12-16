/**
 * Converts parameters for a request to URLSearchParams
 *
 * @param {Object} query parameters to be converted
 * @returns {URLSearchParams} searchParams The query in LHS bracket style format
 */
const buildSearchParams = (query) => {
	const params = new URLSearchParams();

	for (const key in query) {
		if (key.endsWith('[]')) {
			query[key].forEach((entry) => {
				params.append(key, entry);
			});
		} else {
			params.set(key, query[key]);
		}
	}

	return params;
};

module.exports = {
	buildSearchParams,
};
