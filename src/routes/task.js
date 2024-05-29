import { Route } from "./route.js";

/**
 * @class
 * @extends Route
 */
export class Task extends Route {
	/**
	 * @constructor
	 * @param {import('../client.js').Clickup} client
	 */
	constructor(client) {
		super({
			client,
			route: "task",
		});
	}

	/**
	 * Get a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetTask}
	 *
	 * @param {string} taskId The task id
	 * @param {object} [params] The query parameters to use
	 */
	get(taskId, params) {
		return this.client.request({
			path: `${this.route}/${taskId}`,
			params,
		});
	}

	/**
	 * Update a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/UpdateTask}
	 *
	 * @param {string} taskId The task id
	 * @param {object} data The task data
	 * @param {object} [params] The query parameters to use
	 */
	update(taskId, data, params) {
		return this.client.request({
			method: "PUT",
			path: `${this.route}/${taskId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteTask}
	 *
	 * @param {string} taskId The task id
	 * @param {object} [params] The query parameters to use
	 */
	delete(taskId, params) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${taskId}`,
			params,
		});
	}

	/**
	 * Upload a file to a task as an attachment.
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateTaskAttachment}
	 *
	 * @param {string} taskId The task id
	 * @param {FormData} attachment The attachments to add
	 * @param {object} [params] The query parameters to use
	 */
	addAttachment(taskId, attachment, params) {
		return this.client.request({
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data",
			},
			path: `${this.route}/${taskId}/attachment`,
			params,
			body: attachment,
		});
	}

	/**
	 * Add a comment to as task
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateTaskComment}
	 *
	 * @param {string} taskId The task id
	 * @param {object} data The comment data
	 * @param {object} [params] The query parameters to use
	 */
	addComment(taskId, data, params) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${taskId}/comment`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all task comments
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetTaskComments}
	 *
	 * @param {string} taskId The task id
	 * @param {object} [params] The query parameters to use
	 */
	comments(taskId, params) {
		return this.client.request({
			path: `${this.route}/${taskId}/comment`,
			params,
		});
	}

	/**
	 * Create a checklist in a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateChecklist}
	 *
	 * @param {string} taskId The task id
	 * @param {object} data The checklist data
	 * @param {object} [params] The query parameters to use
	 */
	createChecklist(taskId, data, params) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${taskId}/checklist`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Add data to a custom field on a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/SetCustomFieldValue}
	 *
	 * @param {string} taskId The task id
	 * @param {string} fieldId The uuid of the custom field
	 * @param {object} data The custom field data
	 * @param {object} [params] The query parameters to use
	 */
	addCustomFieldValue(taskId, fieldId, data, params) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${taskId}/field/${fieldId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a custom field value on a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/RemoveCustomFieldValue}
	 *
	 * @param {string} taskId The task id
	 * @param {string} fieldId The uuid of the custom field
	 * @param {object} [params] The query parameters to use
	 */
	removeCustomFieldValue(taskId, fieldId, params) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${taskId}/field/${fieldId}`,
			params,
		});
	}

	/**
	 * Create a dependency for a task i.e. set a task as waiting on or blocking another task.
	 * @see {@link https://clickup.com/api/clickupreference/operation/AddDependency}
	 *
	 * @param {string} taskId The task id
	 * @param {object} data The dependency data
	 * @param {object} [params] The query parameters to use
	 */
	addDependency(taskId, data, params) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${taskId}/dependency`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a dependency for a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteDependency}
	 *
	 * @param {string} taskId The task id
	 * @param {object} [options] The parameter options to pass in
	 */
	removeDependency(taskId, params) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${taskId}/dependency`,
			params,
		});
	}

	/**
	 * Link two task together
	 * @see {@link https://clickup.com/api/clickupreference/operation/AddTaskLink}
	 *
	 * @param {string} taskId The task id
	 * @param {string} linksTo The id of the task to link to
	 * @param {object} [params] The query parameters to use
	 */
	addTaskLink(taskId, linksTo, params) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${taskId}/link/${linksTo}`,
			params,
		});
	}

	/**
	 * Delete a task link
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteTaskLink}
	 *
	 * @param {string} taskId The task id
	 * @param {string} linksTo The id of the task to link to
	 * @param {object} [params] The query parameters to use
	 */
	removeTaskLink(taskId, linksTo, params) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${taskId}/link/${linksTo}`,
			params,
		});
	}

	/**
	 * Share a task with a guest
	 * @see {@link https://clickup.com/api/clickupreference/operation/AddGuestToTask}
	 *
	 * @param {string} taskId The task id
	 * @param {number} guestId The guest id
	 * @param {object} data The guest data
	 * @param {object} [params] The query parameters to use
	 */
	addGuest(taskId, guestId, data, params) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${taskId}/guest/${guestId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a guest's access to a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/RemoveGuestFromTask}
	 *
	 * @param {string} taskId The task id
	 * @param {number} guestId The guest id
	 * @param {object} [params] The query parameters to use
	 */
	removeGuest(taskId, guestId, params) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${taskId}/guest/${guestId}`,
			params,
		});
	}

	/**
	 * Get all members who have access to a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetTaskMembers}
	 *
	 * @param {string} taskId The task id
	 */
	members(taskId) {
		return this.client.request({
			path: `${this.route}/${taskId}/member`,
		});
	}

	/**
	 * Add a tag to a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/AddTagToTask}
	 *
	 * @param {string} taskId The task id
	 * @param {string} tagName The tag name
	 * @param {object} [params] The query parameters to use
	 */
	addTag(taskId, tagName, params) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${taskId}/tag/${tagName}`,
			params,
		});
	}

	/**
	 * Remove a tag from a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/RemoveTagFromTask}
	 *
	 * @param {string} taskId The task id
	 * @param {string} tagName The tag name
	 * @param {object} [params] The query parameters to use
	 */
	removeTag(taskId, tagName, params) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${taskId}/tag/${tagName}`,
			params,
		});
	}

	/**
	 * Track time for a task (Time Tracking Legacy API)
	 * @see {@link https://clickup.com/api/clickupreference/operation/Tracktime}
	 *
	 * @param {string} taskId The task id
	 * @param {object} data The time tracking data
	 * @param {object} [params] The query parameters to use
	 */
	addTrackedTime(taskId, data, params) {
		return this.client.request({
			method: "POST",
			path: `${this.route}/${taskId}/time`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get tracked time for a task (Time Tracking Legacy API)
	 * @see {@link https://clickup.com/api/clickupreference/operation/Gettrackedtime}
	 *
	 * @param {string} taskId The task id
	 * @param {object} [params] The query parameters to use
	 */
	trackedTime(taskId, params) {
		return this.client.request({
			path: `${this.route}/${taskId}/time`,
			params,
		});
	}

	/**
	 * Edit tracked time for a task (Time Tracking Legacy API)
	 * @see {@link https://clickup.com/api/clickupreference/operation/Edittimetracked}
	 *
	 * @param {string} taskId The task id
	 * @param {string} intervalId The interval id
	 * @param {object} data The time tracking data
	 * @param {object} [params] The query parameters to use
	 */
	editTrackedTime(taskId, intervalId, data, params) {
		return this.client.request({
			method: "PUT",
			path: `${this.route}/${taskId}/time/${intervalId}`,
			params,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete tracked time for a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/Deletetimetracked}
	 *
	 * @param {string} taskId The task id
	 * @param {string} intervalId The interval id
	 * @param {object} [params] The query parameters to use
	 */
	removeTrackedTime(taskId, intervalId, params) {
		return this.client.request({
			method: "DELETE",
			path: `${this.route}/${taskId}/time/${intervalId}`,
			params,
		});
	}

	/**
	 * Get tasks time in status
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetTask'sTimeinStatus}
	 *
	 * @param {string} taskId The task id
	 * @param {object} [params] The query parameters to use
	 */
	timeInStatus(taskId, params) {
		return this.client.request({
			path: `${this.route}/${taskId}/time_in_status`,
			params,
		});
	}

	/**
	 * Get bulk tasks time in status
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetBulkTasks'TimeinStatus}
	 *
	 * @param {object} params The query parameters to use
	 */
	bulkTimeInStatus(params) {
		return this.client.request({
			path: `${this.route}/bulk_time_in_status/task_ids`,
			params,
		});
	}
}
