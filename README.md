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
import { Clickup } from "clickup.js";
const token = "..."; // API access token
const clickup = new Clickup({ token });

// get a specific task
const { body } = await clickup.task.get("9hz");
console.log(body);
```

## Caveats

The library is structured to match classes with their respective routes, **NOT** how they are sectioned in the Clickup API docs. For example adding a guest to a task is under the `Task` class instead of the `Guest` class as its route is via `/task`.

## Documentation

You can view the libraries full API at [clickup.js docs](https://clickup-js.netlify.app)

## Features

The available features are:

- `Authorization`
- `Checklist`
- `Comment`
- `Folder`
- `Goal`
- `Group`
- `KeyResult`
- `List`
- `Space`
- `Task`
- `Team`
- `View`
- `Webhook`

## Disclaimer

The [clickup.js](https://github.com/ComfortablyCoding/clickup.js) package is **unofficial** and therefor not endorsed or affiliated with ClickUp or it's subsidiaries.
