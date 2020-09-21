class Checklists {
	/**
	 * @constructor
	 * @param {Client} client A client instance
	 */
	constructor(client) {
		this._client = client;
		this.route = 'checklist';
	}

	/**
	 * Update a checklist
	 *
	 * @param {String} checklistId The checklist id
	 * @param {Object} data The checklist data
	 */
	async update(checklistId, data) {
		return this._client.put({
			endpoint: `${this.route}/${checklistId}`,
			json: data,
		});
	}

	/**
	 * Delete a checklist
	 *
	 * @param {String} checklistId The checklist id
	 */
	async delete(checklistId) {
		return this._client.delete({
			endpoint: `${this.route}/${checklistId}`,
		});
	}

	/**
	 * Create a checklist item
	 *
	 * @param {String} checklistId The checklist id
	 * @param {Object} data The checklist item data
	 */
	async createChecklistItem(checklistId, data) {
		return this._client.post({
			endpoint: `${this.route}/${checklistId}/checklist_item`,
			json: data,
		});
	}

	/**
	 * Update a checklist item
	 *
	 * @param {String} checklistId The checklist id
	 * @param {String} checklistItemId The checklist item id
	 * @param {Object} data The checklist item data
	 */
	async updateChecklistItem(checklistId, checklistItemId, data) {
		return this._client.put({
			endpoint: `${this.route}/${checklistId}/checklist_item/${checklistItemId}`,
			json: data,
		});
	}

	/**
	 * Delete a checklist item
	 *
	 * @param {String} checklistId The checklist id
	 * @param {String} checklistItemId The checklist item id
	 */
	async deleteChecklistItem(checklistId, checklistItemId) {
		return this._client.delete({
			endpoint: `${this.route}/${checklistId}/checklist_item/${checklistItemId}`,
		});
	}
}

module.exports = Checklists;
