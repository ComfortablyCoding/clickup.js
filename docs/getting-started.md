# Getting Started

## Install

::: code-group

```sh [pnpm]
pnpm add clickup.js
```

```sh [npm]
npm install clickup.js
```

```sh [bun]
bun add clickup.js
```

```sh [deno]
deno add npm:clickup.js
```

:::

clickup.js sticks to web-standard APIs, so it runs on Node 26+, Bun, Deno, Workers and in the browser. Its types need TypeScript 5.0 or later.

## Create a client

```ts
import { createClickUp } from "clickup.js";

const clickup = createClickUp({ workspace: { id: 1234567 } });
```

**Token.** By default, the client reads `CLICKUP_TOKEN` from `process.env` on runtimes that have it. You can also pass `token` yourself: a [personal token](https://developer.clickup.com/docs/authentication#personal-token) (`pk_...`), an OAuth access token, or a function that returns either. A function is called before every request, which makes it a good place to refresh tokens.

**Workspace.** Set `workspace.id` and the client fills in `team_id` and `workspace_id` for you (v2 calls workspaces "teams"), so you can leave them out of your calls. Add `customTaskIds: true` to refer to tasks by their custom IDs, like `DEV-42`.

See the [client reference](./api/reference/index.md#clickupoptions) for every option.

## Make a call

Every endpoint is a method: `clickup.<namespace>.<method>(params, options)`. `params` is a single object with the endpoint's path, query and body parameters, using ClickUp's own names:

```ts
const task = await clickup.task.get({
	task_id: "86a1b2c3d",
	include_subtasks: true,
});

await clickup.list.createTask({
	list_id: 901234,
	name: "Ship v5",
	priority: 2,
});
await clickup.task.addTag({ task_id: "86a1b2c3d", tag_name: "release" });
```

[Naming](./naming.md) explains how methods get their names, and the [API reference](./api/) lists every one. Response fields are typed as nullable, because ClickUp often returns `null` for fields its spec says are always there.

## Pages

List calls return a single page. To read them all, pass a paginated method to [`pages()`](./api/reference/index.md#pages), which keeps calling it until the last page:

```ts
import { pages } from "clickup.js";

for await (const { tasks } of pages(clickup.list.listTasks, {
	list_id: 901234,
})) {
	for (const task of tasks ?? []) console.log(task.name);
}
```

Each page is an ordinary call, so retries, hooks and any options you pass all apply. To start partway through, pass the param that picks the page, such as `page` or `cursor`.

## Errors

When ClickUp responds with an error, the call throws a [`ClickUpError`](./api/reference/index.md#clickuperror) with the `status`, ClickUp's error `code`, and the request's `method` and `url`. Anything else is thrown as is:

- **Timeout:** fetch's `TimeoutError` (a `DOMException`)
- **Lost connection:** fetch's `TypeError`
- **Aborted call:** the signal's reason
- **Unknown or missing param:** a `TypeError`, before anything is sent

```ts
import { ClickUpError } from "clickup.js";

try {
	await clickup.task.get({ task_id: "86a1b2c3d" });
} catch (error) {
	if (error instanceof ClickUpError && error.status === 404) console.log(error.message, error.code);
}
```

Watch out: for some requests, ClickUp answers a missing resource with `401 Team not authorized` (`OAUTH_027`) instead of a 404.

## Retries and rate limits

The client keeps track of ClickUp's rate limit. Once it's used up, requests wait for it to reset, and a 429 is retried after the reset. Network errors, 408s and 5xx responses (except 501 and 505) are retried too, but only for GET, PUT and DELETE, so nothing gets created twice.

You can tune retries and timeouts for the whole client, or for a single call:

```ts
const clickup = createClickUp({ request: { maxRetries: 3, timeout: 10_000 } });

// Per call
await clickup.task.get({ task_id: "86a1b2c3d" }, { signal: AbortSignal.timeout(5_000) });
```

## Hooks

Hooks see every request and response, on every attempt, retries included:

```ts
createClickUp({
	hooks: {
		onRequest: (request) => console.log(request.method, request.url),
		onResponse: (response) => console.log(response.status),
	},
});
```

Each hook can also return a replacement: `onRequest` a new `Request` to send, and `onResponse` a new `Response` for the call to read. The [examples](./examples.md#hooks) show both.

## Webhooks

[`clickup.js/webhooks`](./api/reference/clickup.js/webhooks.md) verifies a webhook request's signature and gives you a typed event. It's a separate entry point, so it doesn't load the client.

```ts
import { InvalidWebhookError, parseWebhook } from "clickup.js/webhooks";

export async function POST(request: Request) {
	try {
		// The secret webhook.create() returned
		const event = await parseWebhook(request, {
			secret: process.env.CLICKUP_WEBHOOK_SECRET!,
		});

		if (event.event === "taskStatusUpdated") console.log(event.task_id, event.history_items[0]?.after?.status);
	} catch (error) {
		if (error instanceof InvalidWebhookError) return new Response(null, { status: 401 });
		throw error;
	}

	return new Response(null, { status: 200 });
}
```

- **Pass the body unparsed.** The signature covers its exact bytes. If your framework doesn't hand you a `Request`, pass `{ body, signature }` instead, for example with Express's `express.raw()`. To check the signature without reading the event, use `verifyWebhook()`.
- **Several webhooks?** Pass `secret` as a function that takes the `webhook_id` and returns that webhook's secret.
- **Deduplicate** events by `{webhook_id}:{event}:{history item id}`. `taskUpdated` repeats the history items of more specific events, such as `taskStatusUpdated`.
- **`taskUpdated`'s `before` and `after` are `unknown`.** Subscribe to the specific event instead to get them typed.

## Endpoints the spec doesn't cover yet

If an endpoint doesn't have a method yet, you can still call it with an untyped `clickup.request()`:

```ts
const result = await clickup.request({
	method: "GET",
	path: "/v2/some/new/endpoint",
	query: { page: 0 },
});
```
