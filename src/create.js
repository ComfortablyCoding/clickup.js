import { Clickup } from "./client.js";

/**
 * @param {object} [options] Clickup Constructor options
 * @param {string} [options.token] Clickup Access Token
 * @param {object} [options.request] The request options
 * @param {string} [options.request.prefixUrl=https://api.clickup.com/api] The clickup API URL
 * @param {string} [options.rateLimit] The clickup API URL
 * @param {object} [options.hooks] The hooks for extending functionality *
 */
export function createClickup(options = {}) {
	return new Clickup(options);
}
