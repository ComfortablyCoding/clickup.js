# clickup.js

[![npm](https://img.shields.io/npm/v/clickup.js?style=flat-square)](https://www.npmjs.com/package/clickup.js)
[![CI](https://img.shields.io/github/actions/workflow/status/ComfortablyCoding/clickup.js/ci.yml?branch=main&style=flat-square)](https://github.com/ComfortablyCoding/clickup.js/actions/workflows/ci.yml)

A typed client for the [ClickUp API](https://developer.clickup.com). It has no dependencies and runs on Node 26+, Bun, Deno, Workers and in the browser.

**This is an unofficial client, not affiliated with ClickUp.**

```sh
npm install clickup.js
```

```ts
import { createClickUp } from "clickup.js";

// Reads CLICKUP_TOKEN from the environment, or pass { token: "pk_..." }
const clickup = createClickUp({ workspace: { id: 1234567 } });

const task = await clickup.task.get({ task_id: "86a1b2c3d" });
await clickup.list.createTask({
	list_id: 901234,
	name: "Ship v5",
	priority: 2,
});
```

The **[documentation](https://comfortablycoding.github.io/clickup.js/)** has a getting started guide, more examples and the full API reference.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
