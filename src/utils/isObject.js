/**
 * Determines if the passed in value is an object
 *
 * @param value The value to check.
 * @returns {boolean} indicating if the passed in value is an object.
 */
const isObject = (value) => {
	const isObjectType = typeof value === 'object';
	const isArray = Array.isArray(value);
	const isNull = value == null;
	return isObjectType && !isArray && !isNull;
};

module.exports = {
	isObject,
};
