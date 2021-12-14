const { isObject } = require('./isObject');

/**
 * Performs a deep merge of source into object. It does not override properties
 *
 * @param object The destination object.
 * @param sources The values to be applied to the object
 * @returns The merged object
 */
const merge = (object, ...sources) => {
	const result = object;
	for (const source of sources) {
		for (const key in source) {
			if (isObject(result[key])) {
				result[key] = merge(result[key], source[key]);
			} else if (!Object.prototype.hasOwnProperty.call(result, key)) {
				result[key] = source[key];
			}
		}
	}

	return result;
};

module.exports = {
	merge,
};
