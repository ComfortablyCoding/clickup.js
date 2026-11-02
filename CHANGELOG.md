# Changelog

All notable changes to clickup.js are documented here.

## Unreleased

**This release contains backwards-incompatible changes.**

### **Added**

- Every endpoint is now generated and typed from ClickUp's OpenAPI specs, merged and corrected against the live API.
- Automatic retries: 429s on any method, plus network errors, 408s and 5xx responses (except 501 and 505) on GET, PUT and DELETE.
- A `workspace: { id, customTaskIds }` option: `id` fills in `team_id` and `workspace_id` for you, and `customTaskIds` lets you refer to tasks by their custom IDs.
- Per-call `timeout`, `maxRetries`, `headers` and `signal` options.
- Requests send a `User-Agent` of `clickup.js/<version>`, unless your `headers` set one.
- The token can now come from `CLICKUP_TOKEN`, or from a function that's called before every request.
- Support for any runtime with web-standard APIs, including Node, Bun, Deno, Workers and browsers.
- `clickup.js/webhooks`, a separate entry point that doesn't load the client. `parseWebhook()` checks a webhook request's `X-Signature` and returns its event, typed for every event ClickUp sends, while `verifyWebhook()` only checks the signature.
- `webhook.create()`'s `events` are typed as the events ClickUp sends, or `*`.
- `pages()`, which calls a paginated method for every page and returns an async generator.
- TypeScript types: `Params<"task.get">`, `Result<"task.get">`, `PageItem<…>` and `PageParams<…>` for any method, plus `Task`, `List`, `Folder` and `Space`.

### **Changed**

- `createClickup()` is now `createClickUp()`, matching ClickUp's spelling.
- Methods take a single object of path, query and body parameters, using ClickUp's names: `task.get("abc")` → `task.get({ task_id: "abc" })`. camelCase keys are no longer converted.
- All-digit IDs like `list_id` and `team_id` accept either a string (as ClickUp sends them) or a number.
- Methods follow [a single naming scheme](https://comfortablycoding.github.io/clickup.js/naming).
- `remove*` methods only ever detach things; methods that delete data are named `delete*`.
- Uploads take a `FormData` you build yourself, passed as `data`: `task.createAttachment({ task_id, data: form })`.
- Response fields are typed as nullable, because ClickUp returns `null` for many fields its spec marks as always present.
- `request()` takes `{ method, path, query, data }`, with per-call options like `headers` as its second argument. `body` is now `data`, and its keys are no longer converted to snake_case.
- `ClickupAPIError` is now `ClickUpError`, with `status`, `code`, `method` and `url`, and it's only thrown for error responses from ClickUp. Timeouts and lost connections throw whatever fetch threw, aborted calls throw the signal's reason, and invalid params throw a `TypeError`.
- `request.prefixUrl` is now `request.baseUrl`, alongside the new `request.timeout`, `request.maxRetries` and `request.headers`.
- `hooks.onRequest` now receives the `Request` and can return a new one to send. `hooks.onResponse` receives a copy of the `Response`, and replaces the data by returning a new `Response` rather than the data itself.
- Requires Node 26 or later.

### **Removed**

- `setToken()`. To change tokens at runtime, pass `token` as a function.
- The `rateLimit` option. The client now reads limits from ClickUp's response headers.
- The `defu` and `p-ratelimit` dependencies; the package now has none.

### **Fixed**

- Attachment uploads now include the multipart boundary.
- Empty (204) responses no longer throw.
- The `custom_fields` task filter is sent as a single JSON array, the only form ClickUp accepts.

## 4.0.2

### **Changed**

- The publish process now includes a build step so generated files are present at publish time.
- Updated project dependencies to their latest compatible versions for security, performance, and compatibility improvements.

## 4.0.0

**This release contains backwards-incompatible changes.**

### **Added**

- Automatic and configurable **rate limiting** to prevent API overuse and ensure compliance with ClickUp’s rate limits.
- New client instantiation entry point: **`createClickup()`** for clearer configuration and future extensibility.

### **Changed**

- Replaced **`got`** with **`ofetch`** as the internal HTTP client for a lighter, modern, ESM-friendly implementation.
- Normalized all API errors via the new **`ClickupAPIError`** class, providing consistent error structures and improved debugging.
- Top-level resources have been renamed to **singular** forms for a more intuitive API (e.g., `client.tasks.get()` → `client.task.get()`).
- `addAttachment` now requires a **`FormData`** instance for its `attachment` parameter, improving compatibility across environments.
