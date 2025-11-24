# clickup.js

A Node.js wrapper for the [Clickup API](https://clickup.com/api).

[![Downloads](https://img.shields.io/npm/dm/clickup.js.svg?style=for-the-badge)](https://www.npmjs.com/package/clickup.js)
[![Install size](https://img.shields.io/bundlephobia/min/clickup.js?style=for-the-badge)](https://packagephobia.now.sh/result?p=clickup.js)
![Package version](https://img.shields.io/github/package-json/v/ComfortablyCoding/clickup.js?style=for-the-badge)

## Install

```sh
npm install clickup.js
```

or

```sh
yarn add clickup.js
```

or

```sh
pnpm add clickup.js
```

## Quick Start

```js
import { createClickup } from "clickup.js";
const token = "..."; // API access token
const clickup = createClickup({ token });

// get a specific task
const task = await clickup.task.get("9hz");
console.log(task);
```

## API Parity

The library mirrors ClickUp's API structure:

- `clickup.task.*` – Task operations (create, get, update, delete, comments).
- `clickup.list.*` – List operations.
- `clickup.folder.*` – Folder operations.
- `clickup.space.*` – Space operations.
- `clickup.team.*`– Team/Workspaces.
- `clickup.webhook.*` – Webhook management.
- `clickup.user.*` – User info.
- `clickup.goal.*` – Goals (if enabled).
- And more – explore via the [API docs](https://comfortablycoding.github.io/clickup.js).

## Documentation

You can view the libraries full API at [clickup.js docs](https://comfortablycoding.github.io/clickup.js)

## Disclaimer

The [clickup.js](https://github.com/ComfortablyCoding/clickup.js) package is **unofficial** and therefor not endorsed or affiliated with ClickUp or it's subsidiaries.
