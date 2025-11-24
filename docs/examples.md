# API Examples

This page demonstrates usage of some of the APIs provided by clickup.js.

## Hooks

The ClickUp client provides hooks for extending or customizing its behavior at various points in the request lifecycle.

### onRequest

The `onRequest` hook is triggered before a request is sent to the ClickUp API. It receives the request options object containing details such as the HTTP method, path, and headers. This hook is useful for logging, modifying requests, adding custom headers, or integrating debugging tools.

```js
import { createClickup } from "./dist/index.mjs";

const client = createClickup({
	hooks: {
		onRequest({ request }) {
			console.log(`[${request.method}] ${request.path}`);
			// You can also mutate the request if needed:
			// request.headers['X-Debug'] = 'true';
		},
	},
});
```

### onResponse

The onResponse hook is triggered after a response is received from the ClickUp API, but before the client returns the processed result to the caller. It receives the original request object along with the parsed data returned by the API, allowing you to inspect or modify the result.

```js
import { createClickup } from "./dist/index.mjs";

const client = createClickup({
	hooks: {
		onResponse({ request, data }) {
			if (request.method === "GET" && request.path.include("v2/task/")) {
				data.name = "changed";
			}
		},
	},
});
```

## Common Tasks

All examples assume a client named `clickup` has already been created

### Get Authorized User Info

```js
const userResponse = await clickup.authorization.user();
console.log("Logged in as:", userResponse.user.username);
```

### Create a New Task

```js
const task = await clickup.list.createTask("LIST_ID", {
	name: "My New Task",
	description: "This is a test task created via clickup.js",
	assignees: [123456], // User IDs
	due_date: Date.now() + 86400000, // Tomorrow in ms
	priority: 1, // 1: Urgent, 2: High, 3: Normal, 4: Low
});

console.log("Task created:", task.id);
```

### Get Tasks from a List

```js
const tasksResponse = await clickup.list.tasks("LIST_ID", {
	include_closed: true,
	page: 0,
});

tasksResponse.tasks.forEach((t) => console.log(t.name));
```

### Update a Task

```js
const updated = await clickup.task.update("TASK_ID", {
	name: "Updated Task Name",
	status: "in progress",
});

console.log("Updated:", updated);
```

### Add a Comment to a Task

```js
const comment = await clickup.task.addComment("TASK_ID", {
	comment_text: "This is a comment from clickup.js!",
	assignee: 123456,
	notify_all: true,
});

console.log("Comment ID:", comment.id);
```

::: info
Check out the documentation for the [full list of available APIs](/api).
:::
