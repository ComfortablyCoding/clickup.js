# clickup.js

[![npm](https://img.shields.io/npm/v/clickup.js?style=flat-square)](https://www.npmjs.com/package/clickup.js)
[![CI](https://img.shields.io/github/actions/workflow/status/ComfortablyCoding/clickup.js/ci.yml?branch=main&style=flat-square)](https://github.com/ComfortablyCoding/clickup.js/actions/workflows/ci.yml)

A runtime-agnostic TypeScript SDK for the [ClickUp API](https://developer.clickup.com).

**Note:** This is an unofficial SDK and is not affiliated with, or endorsed by, ClickUp.

## Installation

```sh
npm install clickup.js
```

## Quick start

Get a [personal API token](https://developer.clickup.com/docs/authentication#personal-token) for individual use, or complete ClickUp's [OAuth flow](https://developer.clickup.com/docs/authentication#oauth-flow) for an app or integration; then pass the resulting token when creating the client:

```ts
import { createClickUp } from "clickup.js";

const clickup = createClickUp({ token: "<your-clickup-token>" });

// Retrieve a task
const task = await clickup.task.get({ task_id: "86a1b2c3d" });

// Create a task in a list
await clickup.list.createTask({
	list_id: 901234,
	name: "Ship v5",
	priority: 2,
});
```

If `token` is omitted, the client uses `process.env.CLICKUP_TOKEN` where available.

## Documentation

Examples, API reference, and more: **[documentation](https://comfortablycoding.github.io/clickup.js/)**.

## Contributing

Contributions, bug reports, and feature requests are welcome.

See [CONTRIBUTING.md](CONTRIBUTING.md) for any development or contribution guidelines.

## License

[MIT](LICENSE)
