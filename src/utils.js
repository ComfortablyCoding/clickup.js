/**
 * Convert a camelCase string to snake_case
 *
 * @param {string} value
 * @returns {string}
 */
export function camelToSnakeCase(value) {
	return value.replace(/([A-Z])/g, "_$1").toLowerCase();
}

/**
 * Build a request URL with query parameters
 *
 * @param {string} prefixUrl The base URL
 * @param {string} path The request URL path
 * @param {object} [query] The request URL parameters
 * @returns {URL}
 */
export function buildRequestUrl(prefixUrl, path, query) {
	const url = new URL(path, prefixUrl);

	for (let [key, value] of Object.entries(query ?? {})) {
		key = camelToSnakeCase(key);

		if (Array.isArray(value)) {
			// LHS bracket notation requires array values to have a key value pair per element.
			// Each key must be suffixed by []
			if (!key.endsWith("[]")) {
				key += "[]";
			}

			for (const entry of value) {
				url.searchParams.append(key, entry);
			}
		} else {
			url.searchParams.set(key, value);
		}
	}

	return url;
}
