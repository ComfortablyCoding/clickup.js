import { Route } from "./route.js";

/**
 * @class
 * @extends Route
 */
export default class Task extends Route {
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
	 * @param {object} [options] The query parameters to use
	 */
	get(taskId, options) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${taskId}`,
			query: options,
		});
	}

	/**
	 * Update a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/UpdateTask}
	 *
	 * @param {string} taskId The task id
	 * @param {object} data The task data
	 * @param {object} [options] The query parameters to use
	 */
	update(taskId, data, options) {
		return this.client.request({
			method: "PUT",
			path: `/${this.version}/${this.route}/${taskId}`,
			query: options,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteTask}
	 *
	 * @param {string} taskId The task id
	 * @param {object} [options] The query parameters to use
	 */
	delete(taskId, options) {
		return this.client.request({
			method: "DELETE",
			path: `/${this.version}/${this.route}/${taskId}`,
			query: options,
		});
	}

	/**
	 * Upload a file to a task as an attachment.
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateTaskAttachment}
	 *
	 * @param {string} taskId The task id
	 * @param {FormData} attachment The attachments to add
	 * @param {object} [options] The query parameters to use
	 */
	addAttachment(taskId, attachment, options) {
		return this.client.request({
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data",
			},
			path: `/${this.version}/${this.route}/${taskId}/attachment`,
			query: options,
			body: attachment,
		});
	}

	/**
	 * Add a comment to as task
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateTaskComment}
	 *
	 * @param {string} taskId The task id
	 * @param {object} data The comment data
	 * @param {object} [options] The query parameters to use
	 */
	addComment(taskId, data, options) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${taskId}/comment`,
			query: options,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get all task comments
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetTaskComments}
	 *
	 * @param {string} taskId The task id
	 * @param {object} [options] The query parameters to use
	 */
	comments(taskId, options) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${taskId}/comment`,
			query: options,
		});
	}

	/**
	 * Add a checklist in a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/CreateChecklist}
	 *
	 * @param {string} taskId The task id
	 * @param {object} data The checklist data
	 * @param {object} [options] The query parameters to use
	 */
	AddChecklist(taskId, data, options) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${taskId}/checklist`,
			query: options,
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
	 * @param {object} [options] The query parameters to use
	 */
	addCustomFieldValue(taskId, fieldId, data, options) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${taskId}/field/${fieldId}`,
			query: options,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a custom field value on a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/RemoveCustomFieldValue}
	 *
	 * @param {string} taskId The task id
	 * @param {string} fieldId The uuid of the custom field
	 * @param {object} [options] The query parameters to use
	 */
	removeCustomFieldValue(taskId, fieldId, options) {
		return this.client.request({
			method: "DELETE",
			path: `/${this.version}/${this.route}/${taskId}/field/${fieldId}`,
			query: options,
		});
	}

	/**
	 * Create a dependency for a task i.e. set a task as waiting on or blocking another task.
	 * @see {@link https://clickup.com/api/clickupreference/operation/AddDependency}
	 *
	 * @param {string} taskId The task id
	 * @param {object} data The dependency data
	 * @param {object} [options] The query parameters to use
	 */
	addDependency(taskId, data, options) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${taskId}/dependency`,
			query: options,
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
	removeDependency(taskId, options) {
		return this.client.request({
			method: "DELETE",
			path: `/${this.version}/${this.route}/${taskId}/dependency`,
			query: options,
		});
	}

	/**
	 * Link two task together
	 * @see {@link https://clickup.com/api/clickupreference/operation/AddTaskLink}
	 *
	 * @param {string} taskId The task id
	 * @param {string} linksTo The id of the task to link to
	 * @param {object} [options] The query parameters to use
	 */
	addTaskLink(taskId, linksTo, options) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${taskId}/link/${linksTo}`,
			query: options,
		});
	}

	/**
	 * Delete a task link
	 * @see {@link https://clickup.com/api/clickupreference/operation/DeleteTaskLink}
	 *
	 * @param {string} taskId The task id
	 * @param {string} linksTo The id of the task to link to
	 * @param {object} [options] The query parameters to use
	 */
	removeTaskLink(taskId, linksTo, options) {
		return this.client.request({
			method: "DELETE",
			path: `/${this.version}/${this.route}/${taskId}/link/${linksTo}`,
			query: options,
		});
	}

	/**
	 * Share a task with a guest
	 * @see {@link https://clickup.com/api/clickupreference/operation/AddGuestToTask}
	 *
	 * @param {string} taskId The task id
	 * @param {number} guestId The guest id
	 * @param {object} data The guest data
	 * @param {object} [options] The query parameters to use
	 */
	addGuest(taskId, guestId, data, options) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${taskId}/guest/${guestId}`,
			query: options,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Remove a guest's access to a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/RemoveGuestFromTask}
	 *
	 * @param {string} taskId The task id
	 * @param {number} guestId The guest id
	 * @param {object} [options] The query parameters to use
	 */
	removeGuest(taskId, guestId, options) {
		return this.client.request({
			method: "DELETE",
			path: `/${this.version}/${this.route}/${taskId}/guest/${guestId}`,
			query: options,
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
			path: `/${this.version}/${this.route}/${taskId}/member`,
		});
	}

	/**
	 * Add a tag to a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/AddTagToTask}
	 *
	 * @param {string} taskId The task id
	 * @param {string} tagName The tag name
	 * @param {object} [options] The query parameters to use
	 */
	addTag(taskId, tagName, options) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${taskId}/tag/${tagName}`,
			query: options,
		});
	}

	/**
	 * Remove a tag from a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/RemoveTagFromTask}
	 *
	 * @param {string} taskId The task id
	 * @param {string} tagName The tag name
	 * @param {object} [options] The query parameters to use
	 */
	removeTag(taskId, tagName, options) {
		return this.client.request({
			method: "DELETE",
			path: `/${this.version}/${this.route}/${taskId}/tag/${tagName}`,
			query: options,
		});
	}

	/**
	 * Track time for a task (Time Tracking Legacy API)
	 * @see {@link https://clickup.com/api/clickupreference/operation/Tracktime}
	 *
	 * @param {string} taskId The task id
	 * @param {object} data The time tracking data
	 * @param {object} [options] The query parameters to use
	 */
	addTrackedTime(taskId, data, options) {
		return this.client.request({
			method: "POST",
			path: `/${this.version}/${this.route}/${taskId}/time`,
			query: options,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Get tracked time for a task (Time Tracking Legacy API)
	 * @see {@link https://clickup.com/api/clickupreference/operation/Gettrackedtime}
	 *
	 * @param {string} taskId The task id
	 * @param {object} [options] The query parameters to use
	 */
	trackedTime(taskId, options) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${taskId}/time`,
			query: options,
		});
	}

	/**
	 * Edit tracked time for a task (Time Tracking Legacy API)
	 * @see {@link https://clickup.com/api/clickupreference/operation/Edittimetracked}
	 *
	 * @param {string} taskId The task id
	 * @param {string} intervalId The interval id
	 * @param {object} data The time tracking data
	 * @param {object} [options] The query parameters to use
	 */
	editTrackedTime(taskId, intervalId, data, options) {
		return this.client.request({
			method: "PUT",
			path: `/${this.version}/${this.route}/${taskId}/time/${intervalId}`,
			query: options,
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete tracked time for a task
	 * @see {@link https://clickup.com/api/clickupreference/operation/Deletetimetracked}
	 *
	 * @param {string} taskId The task id
	 * @param {string} intervalId The interval id
	 * @param {object} [options] The query parameters to use
	 */
	removeTrackedTime(taskId, intervalId, options) {
		return this.client.request({
			method: "DELETE",
			path: `/${this.version}/${this.route}/${taskId}/time/${intervalId}`,
			query: options,
		});
	}

	/**
	 * Get tasks time in status
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetTask'sTimeinStatus}
	 *
	 * @param {string} taskId The task id
	 * @param {object} [options] The query parameters to use
	 */
	timeInStatus(taskId, options) {
		return this.client.request({
			path: `/${this.version}/${this.route}/${taskId}/time_in_status`,
			query: options,
		});
	}

	/**
	 * Get bulk tasks time in status
	 * @see {@link https://clickup.com/api/clickupreference/operation/GetBulkTasks'TimeinStatus}
	 *
	 * @param {object} options The query parameters to use
	 */
	bulkTimeInStatus(options) {
		return this.client.request({
			path: `/${this.version}/${this.route}/bulk_time_in_status/task_ids`,
			query: options,
		});
	}
}
