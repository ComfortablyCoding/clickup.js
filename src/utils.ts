/**
 * Convert a camelCase string to snake_case
 *
 * @param {string} value
 * @returns {string}
 */
export function camelToSnakeCase(value: string): string {
	return value.replace(/([A-Z])/g, "_$1").toLowerCase();
}

/**
 * Build a request URL with query parameters
 *
 * @param {string} prefixUrl The base URL
 * @param {string} path The request URL path
 * @param {Record<string, unknown>} [query] The request URL parameters
 * @returns {URL}
 */
export function buildRequestUrl(prefixUrl: string, path: string, query?: Record<string, unknown>): URL {
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
				url.searchParams.append(key, String(entry));
			}
		} else {
			url.searchParams.set(key, String(value));
		}
	}

	return url;
}
