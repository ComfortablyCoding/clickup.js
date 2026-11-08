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

ClickUp.js is built using web-standard APIs, making it compatible with Node.js 26+, Bun, Deno, Cloudflare Workers, and browser runtimes. Its TypeScript definitions require TypeScript 5.0 or newer.

## Create a client

```ts
import { createClickUp } from "clickup.js";

const clickup = createClickUp({ token: "<your-clickup-token>" });
```

**Token.** Pass `token` when creating the client: use a [personal API token](https://developer.clickup.com/docs/authentication#personal-token) (`pk_...`) for individual use, or follow ClickUp's [OAuth flow](https://developer.clickup.com/docs/authentication#oauth-flow) for an app or integration.

The client also accepts a function that returns a token. A token function runs before each request, which makes it useful when the token arrives after client creation or needs to be retrieved from storage.

```ts
let token = "";

const clickup = createClickUp({
	token: () => token,
});

// Set this after your sign-in flow returns a token.
token = "<your-clickup-token>";
```

Subsequent requests use the updated token. If `token` is omitted, the client reads `CLICKUP_TOKEN` from `process.env` on runtimes that expose it.

**Workspace.** Set `workspace.id`, to have the client fill in `team_id` and `workspace_id` for you (v2 calls workspaces "teams"), so you can leave them out of API calls. Add `customTaskIds: true` to refer to tasks by their custom IDs, such as `DEV-42`.

See the [client reference](./api/reference/index.md#clickupoptions) for every option.

## Common setup issues

- **Missing token:** pass `token` when creating the client, or set `CLICKUP_TOKEN` in `process.env` on runtimes that expose it.
- **Unexpected 401/403 responses:** confirm that the token belongs to the correct workspace and has permission for the endpoint you are calling.
- **`401 Team not authorized` for a missing resource:** some ClickUp endpoints return this response instead of a 404 when the resource is not accessible.
- **Rate limiting:** if you receive repeated 429s, the client waits for ClickUp's reset time automatically. You can also set stricter timeout and retry settings for your environment.

## Make a call

Each endpoint is a method: `clickup.<namespace>.<method>(params, options)`. `params` is a single object containing the endpoint's path, query, and body parameters, using ClickUp's own names:

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

await clickup.task.addTag({
	task_id: "86a1b2c3d",
	tag_name: "release",
});
```

[Naming](./naming.md) explains how methods get their names, and the [API reference](./api/) lists every one. Response fields are typed as nullable because ClickUp often returns `null` despite their spec having it types as non-null.

## Pages

List calls return a single page. To read them all, pass a paginated method to [`pages()`](./api/reference/index.md#pages), which keeps calling it until it reaches the last page:

```ts
import { pages } from "clickup.js";

for await (const { tasks } of pages(clickup.list.listTasks, {
	list_id: 901234,
})) {
	for (const task of tasks ?? []) {
		console.log(task.name);
	}
}
```

Each page is an ordinary call, so retries, hooks, and any options you pass all apply. To start partway through, include the endpoint's paging parameter in the params object passed as the second argument to `pages()`, for example: `pages(clickup.list.listTasks, { list_id: 901234, page: 2 })`. For cursor-based endpoints, pass the starting `cursor` in that object instead.

## Errors

When ClickUp returns an error, the call throws a [`ClickUpError`](./api/reference/index.md#clickuperror) with the `status`, ClickUp's error `code`, and the request's `method` and `url`. Other errors are thrown as-is; common examples include:

- **Timeout:** fetch's `TimeoutError` (a `DOMException`)
- **Lost connection:** fetch's `TypeError`
- **Aborted call:** the signal's reason
- **Unknown or missing param:** a `TypeError`, before anything is sent

```ts
import { ClickUpError } from "clickup.js";

try {
	await clickup.task.get({ task_id: "86a1b2c3d" });
} catch (error) {
	if (error instanceof ClickUpError && error.status === 404) {
		console.log(error.message, error.code);
	}
}
```

Watch out: for some requests, ClickUp answers a missing resource with `401 Team not authorized` (`OAUTH_027`) instead of a 404.

## Retries and rate limits

The client tracks ClickUp's rate limit. Once it is exhausted, requests wait for the reset, and a 429 is retried afterward. Network errors, 408s, and 5xx responses (except 501 and 505) are retried too, but only for GET, PUT, and DELETE requests so nothing gets created twice.

You can tune retries and timeouts for the whole client or for a single call:

```ts
// globally
const clickup = createClickUp({
	token: "<your-clickup-token>",
	request: { maxRetries: 3, timeout: 10_000 },
});

// Per call
await clickup.task.get(
	{
		task_id: "86a1b2c3d",
	},
	{ signal: AbortSignal.timeout(5_000) },
);
```

## Hooks

Hooks see every request and response on every attempt, including retries:

```ts
createClickUp({
	token: "<your-clickup-token>",
	hooks: {
		onRequest: (request) => console.log(request.method, request.url),
		onResponse: (response) => console.log(response.status),
	},
});
```

Each hook can also return a replacement: `onRequest` can return a new `Request` to send, and `onResponse` can return a new `Response` for the call to read. The [examples](./examples.md#hooks) show both.

## Webhooks

[`clickup.js/webhooks`](./api/reference/clickup.js/webhooks.md) verifies a webhook request's signature and gives you a typed event. It is a separate entry point, so it does not load the client.

```ts
import { InvalidWebhookError, parseWebhook } from "clickup.js/webhooks";

export async function POST(request: Request) {
	try {
		// The secret webhook.create() returned
		const event = await parseWebhook(request, {
			secret: process.env.CLICKUP_WEBHOOK_SECRET!,
		});

		if (event.event === "taskStatusUpdated") {
			console.log(event.task_id, event.history_items[0]?.after?.status);
		}
	} catch (error) {
		if (error instanceof InvalidWebhookError) {
			return new Response(null, { status: 401 });
		}

		throw error;
	}

	return new Response(null, { status: 200 });
}
```

- **Pass the body unparsed.** The signature covers the exact bytes. If your framework does not give you a `Request`, pass `{ body, signature }` instead, for example with Express's `express.raw()`. To check the signature without reading the event, use `verifyWebhook()`.
- **Multiple webhooks?** Pass `secret` as a function that takes the `webhook_id` and returns that webhook's secret.
- **Deduplicate** events by `{webhook_id}:{event}:{history item id}`. `taskUpdated` repeats the history items of more specific events, such as `taskStatusUpdated`.
- **`taskUpdated`'s `before` and `after` are `unknown`.** Subscribe to the specific event instead to get them typed.

## Endpoints the spec doesn't cover yet

If an endpoint does not have a method yet, you can still call it with an untyped `clickup.request()`:

```ts
const result = await clickup.request({
	method: "GET",
	path: "/v2/some/new/endpoint",
	query: { page: 0 },
});
```
