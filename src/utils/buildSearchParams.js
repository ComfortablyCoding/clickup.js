/**
 * Converts parameters for a request to URLSearchParams
 *
 * @param {Object} query parameters to be converted
 * @returns {URLSearchParams} searchParams The query in LHS bracket style format
 */
const buildSearchParams = (query) => {
	const params = new URLSearchParams();

	for (let key in query) {
		if (Object.hasOwnProperty.call(query, key)) {
			const value = query[key];

			// LHS requires array variables to be added ones per item in array
			if (Array.isArray(value)) {
				// LHS bracket notiation requires array keys to end with []
				if (!key.endsWith('[]')) {
					key += '[]';
				}

				for (const entry of value) {
					params.append(key, entry);
				}
			} else {
				params.set(key, value);
			}
		}
	}
	return params;
};

module.exports = {
	buildSearchParams,
};
