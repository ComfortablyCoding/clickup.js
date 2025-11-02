import { Clickup } from "./client.js";

export function createClickup(options) {
	return new Clickup(options ?? {});
}
