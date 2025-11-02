/**
 * Convert a camel case string to snake case
 *
 * @param {string} value
 * @returns
 */
export function camelToSnakeCase(value) {
	return key.split().map((l) => (l === l.toUpperCase() ? `_${l.toLowerCase()}` : l));
}
