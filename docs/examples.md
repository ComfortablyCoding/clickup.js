# Examples

The examples below all use this client:

```ts
import { createClickUp } from "clickup.js";

const clickup = createClickUp({ workspace: { id: 1234567 } });
```

## Tasks

### Create a task

```ts
const task = await clickup.list.createTask({
	list_id: 901234,
	name: "Ship v5",
	description: "Made with clickup.js",
	assignees: [183],
	due_date: Date.now() + 86_400_000, // tomorrow, in milliseconds
	priority: 2, // 1 urgent, 2 high, 3 normal, 4 low
});

console.log(task.id, task.url);
```

### Read every task in a List

```ts
import { pages } from "clickup.js";

for await (const { tasks } of pages(clickup.list.listTasks, { list_id: 901234, include_closed: true })) {
	for (const task of tasks ?? []) console.log(task.name);
}
```

### Update a task

```ts
await clickup.task.update({ task_id: "86a1b2c3d", name: "Ship v5.0", status: "in progress" });
```

### Comment on a task

```ts
const comment = await clickup.task.createComment({
	task_id: "86a1b2c3d",
	comment_text: "Looks good to me",
	assignee: 183,
	notify_all: false,
});

console.log("Comment", comment.id);
```

### Read every comment on a task

Comments come back newest first:

```ts
import { pages } from "clickup.js";

for await (const { comments } of pages(clickup.task.listComments, { task_id: "86a1b2c3d" })) {
	for (const comment of comments ?? []) console.log(comment.comment_text);
}
```

### Refer to tasks by their custom IDs

```ts
const clickup = createClickUp({ workspace: { id: 1234567, customTaskIds: true } });

const task = await clickup.task.get({ task_id: "DEV-42" });
```

### Upload a file

Uploads take a `FormData` that you build yourself:

```ts
const form = new FormData();
form.append("attachment", new File(["Release notes for v5"], "notes.txt", { type: "text/plain" }));

await clickup.task.createAttachment({ task_id: "86a1b2c3d", data: form });
```

## You and your workspaces

```ts
const { user } = await clickup.authorization.getUser();
console.log("Signed in as", user?.username);

const { teams } = await clickup.workspace.list();
for (const workspace of teams ?? []) console.log(workspace.id, workspace.name);
```

## Hooks

### Add a header and log the rate limit

`onRequest` can return a new `Request` to send in place of the original. This one adds a request ID, and `onResponse` logs how much of the rate limit is left:

```ts
const clickup = createClickUp({
	workspace: { id: 1234567 },
	hooks: {
		onRequest(request) {
			const headers = new Headers(request.headers);
			headers.set("X-Request-Id", crypto.randomUUID());

			return new Request(request, { headers });
		},
		onResponse(response, request) {
			console.log(request.method, request.url, response.status, response.headers.get("x-ratelimit-remaining"));
		},
	},
});
```

### Add data to every response

`onResponse` gets a copy of each response, and can return a new `Response` for the call to read instead. This one adds when each response arrived:

```ts
const clickup = createClickUp({
	workspace: { id: 1234567 },
	hooks: {
		async onResponse(response) {
			// Leave empty and non-JSON responses, like a 204 from a delete, as they are
			if (!response.headers.get("content-type")?.includes("application/json")) return;

			const data = await response.json();

			return Response.json({ ...data, fetched_at: Date.now() }, response);
		},
	},
});
```

The methods' return types come from ClickUp's spec, so they won't include fields a hook adds.

## Create a webhook

Hold on to the `secret` it returns, as you'll need it to [receive events](./getting-started.md#webhooks).

```ts
const { webhook } = await clickup.webhook.create({
	endpoint: "https://example.com/clickup",
	events: ["taskCreated", "taskStatusUpdated"],
});

const secret = webhook?.secret;
```
