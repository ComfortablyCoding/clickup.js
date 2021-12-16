class Checklists {
	/**
	 * @constructor
	 * @param {Request} request A request instance
	 */
	constructor(request) {
		/**
		 * A request instance
		 * @type {Request}
		 * @private
		 */
		this._request = request;
		/**
		 * The main route for the collection
		 * @type {String}
		 */
		this.route = 'checklist';
	}

	/**
	 * Update a checklist
	 *
	 * @param {String} checklistId The checklist id
	 * @param {Object} data The checklist data
	 */
	async update(checklistId, data) {
		return this._request.put({
			endpoint: `${this.route}/${checklistId}`,
			data,
		});
	}

	/**
	 * Delete a checklist
	 *
	 * @param {String} checklistId The checklist id
	 */
	async delete(checklistId) {
		return this._request.delete({
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
		return this._request.post({
			endpoint: `${this.route}/${checklistId}/checklist_item`,
			data,
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
		return this._request.put({
			endpoint: `${this.route}/${checklistId}/checklist_item/${checklistItemId}`,
			data,
		});
	}

	/**
	 * Delete a checklist item
	 *
	 * @param {String} checklistId The checklist id
	 * @param {String} checklistItemId The checklist item id
	 */
	async deleteChecklistItem(checklistId, checklistItemId) {
		return this._request.delete({
			endpoint: `${this.route}/${checklistId}/checklist_item/${checklistItemId}`,
		});
	}
}

module.exports = Checklists;
