import { Route } from "./route.js";

export class Checklist extends Route {
	constructor(client) {
		super({
			client,
			route: "checklist",
		});
	}

	/**
	 * Update a checklist
	 * @see {@link https://clickup.com/api/clickupreference/operation/EditChecklist}
	 *
	 * @param {string} checklistId The checklist id
	 * @param {object} data The checklist data
	 */
	update(checklistId, data) {
		return this.client.request({
			method: "PUT",
			path: `${this.route}/${checklistId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a checklist
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteChecklist}
	 *
	 * @param {string} checklistId The checklist id
	 */
	delete(checklistId) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${checklistId}`,
		});
	}

	/**
	 * Create a checklist item
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateChecklistItem}
	 *
	 * @param {string} checklistId The checklist id
	 * @param {object} data The checklist item data
	 */
	addItem(checklistId, data) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${checklistId}/checklist_item`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Update a checklist item
	 * @see {@link https://clickup.com/api/clickupreference/operation/EditChecklistItem}
	 *
	 * @param {string} checklistId The checklist id
	 * @param {string} checklistItemId The checklist item id
	 * @param {object} data The checklist item data
	 */
	editItem(checklistId, checklistItemId, data) {
		return this.client.request({
			method: "PUT",
			path: `${this.route}/${checklistId}/checklist_item/${checklistItemId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a checklist item
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteChecklistItem}
	 *
	 * @param {string} checklistId The checklist id
	 * @param {string} checklistItemId The checklist item id
	 */
	removeItem(checklistId, checklistItemId) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${checklistId}/checklist_item/${checklistItemId}`,
		});
	}
}
