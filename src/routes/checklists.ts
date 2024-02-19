import { Clickup } from '../client';

export class Checklists {
	private client: Clickup;
	route: string;
	constructor(client: Clickup) {
		this.client = client;

		/**
		 * The main route for the collection
		 */
		this.route = 'checklist';
	}

	/**
	 * Update a checklist
	 *
	 * @param checklistId The checklist id
	 * @param data The checklist data
	 */
	update(checklistId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${checklistId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a checklist
	 *
	 * @param checklistId The checklist id
	 */
	delete(checklistId: string) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${checklistId}`,
		});
	}

	/**
	 * Create a checklist item
	 *
	 * @param checklistId The checklist id
	 * @param data The checklist item data
	 */
	createChecklistItem(checklistId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'POST',
			path: `${this.route}/${checklistId}/checklist_item`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Update a checklist item
	 *
	 * @param checklistId The checklist id
	 * @param checklistItemId The checklist item id
	 * @param data The checklist item data
	 */
	updateChecklistItem(checklistId: string, checklistItemId: string, data: Record<string, unknown>) {
		return this.client.request({
			method: 'PUT',
			path: `${this.route}/${checklistId}/checklist_item/${checklistItemId}`,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a checklist item
	 *
	 * @param checklistId The checklist id
	 * @param checklistItemId The checklist item id
	 */
	deleteChecklistItem(checklistId: string, checklistItemId: string) {
		return this.client.request({
			method: 'DELETE',
			path: `${this.route}/${checklistId}/checklist_item/${checklistItemId}`,
		});
	}
}
