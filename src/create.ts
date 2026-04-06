import { Clickup } from "./client.ts";
import type { ClickupOptions } from "./types.ts";

/**
 * Create a new Clickup client instance
 *
 * @param {ClickupOptions} [options] Clickup Constructor options
 * @param {string} [options.token] Clickup Access Token
 * @param {object} [options.request] The request options
 * @param {string} [options.request.prefixUrl=https://api.clickup.com/api] The clickup API URL
 * @param {object} [options.rateLimit] The rate limit config
 * @param {object} [options.hooks] The hooks for extending functionality
 */
export function createClickup(options: ClickupOptions = {}): Clickup {
	return new Clickup(options);
}
