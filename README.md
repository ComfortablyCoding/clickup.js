# clickup.js

A Node.js wrapper for the [Clickup API](https://clickup.com/api).

[![Downloads](https://img.shields.io/npm/dm/clickup.js.svg?style=for-the-badge)](https://www.npmjs.com/package/clickup.js)
[![Install size](https://img.shields.io/bundlephobia/min/clickup.js?style=for-the-badge)](https://packagephobia.now.sh/result?p=clickup.js)
![GitHub package.json version](https://img.shields.io/github/package-json/v/ComfortablyCoding/clickup.js?style=for-the-badge) ![Dependancies](https://img.shields.io/david/ComfortablyCoding/clickup.js?style=for-the-badge)
![NPM](https://img.shields.io/npm/l/clickup.js?style=for-the-badge)

## Install

```sh
npm install clickup.js
```

## Usage

Before you can use this library you will need to first authenticate with the Clickup API and obtain an `Access Token`. You can read how to do so at the [Clickup API docs](https://clickup.com/api).

In your project, initialize an instance of clickup.js:

```js
const Clickup = require('clickup.js');
const token = '...'; // API access token
const clickup = new Clickup(token);
```

Once you've created an instance, you can use it to access all the features provided by the wrapper, the following example fetches a task by id and displays the response to the console:

```js
(async () => {
 try {
  // get a specific task
  const { body } = await clickup.tasks.get('9hz');
  console.log(body);
 } catch (error) {
  if (error.response) {
   // The request was made and the server responded with a status code
   // that falls out of the range of 2xx
   console.log(error.response.body);
   console.log(error.response.statusCode);
   console.log(error.response.headers);
  } else if (error.request) {
   // The request was made but no response was received
   console.log(error.request);
  } else {
   // Something happened in setting up the request that triggered an Error
   console.log('Error', error.message);
  }
  console.log(error.options);
 }
})();
```

**Note:** Due to the HTTP request library being used each error contains an `options` property which are the options Got used to create a request - just to make debugging easier. Additionaly, the errors may have `request` (Got Stream) and `response` (Got Response) properties depending on which phase of the request failed. Read more about HTTP request library Got [here](https://github.com/sindresorhus/got).

## Important Note

The library is structured to match classes with their respective routes, **NOT** how they are sectioned in the Clickup API docs. For example adding a guest to a task is under the `Tasks` class instead of the `Guests` class as its route is via `task` and not `guest`. Due to this a request to add a guest to a task will look like so:

```js
(async () => {
 try {
  // guest data
  const guestData = {
   permission_level: 'read',
  };
  // add guest to task
  const { body } = await clickup.tasks.addGuest('c04', 403, guestData);
  console.log(body);
 } catch (error) {
  if (error.response) {
   // The request was made and the server responded with a status code
   // that falls out of the range of 2xx
   console.log(error.response.body);
   console.log(error.response.statusCode);
   console.log(error.response.headers);
  } else if (error.request) {
   // The request was made but no response was received
   console.log(error.request);
  } else {
   // Something happened in setting up the request that triggered an Error
   console.log('Error', error.message);
  }
  console.log(error.options);
 }
})();
```

## Documentation

You can read the library documentation at the [clickup.js docs](https://comfortablycoding.github.io/clickup.js)

## Features

The available features are:

- `Authorization`
- `Checklists`
- `Comments`
- `Folders`
- `Goals`
- `KeyResults`
- `Lists`
- `Spaces`
- `Tasks`
- `Teams`
- `Views`
- `Webhooks`

## License

MIT License

Copyright (c) 2020 jj

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
