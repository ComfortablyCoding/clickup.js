# Getting Started

## Obtain an API Token

All API endpoints with the exception of `/oauth/token` require authentication using a valid access token.

A token can be retrieved in the following ways:

### 1. Personal Access Token

Follow the [official guide to generate a personal token.](https://developer.clickup.com/docs/authentication#personal-token) Once you have the token, pass it when initializing the client:

```js
import { createClickup } from "clickup.js";

const clickup = createClickup("YOUR_PERSONAL_TOKEN");
```

### 2. OAuth 2.0 App

1. [Create an OAuth app](https://developer.clickup.com/docs/authentication#build-apps-for-others---oauth-flow) in the developer portal.
2. Go through the Oauth flow to exchange the authorization code for credentials.
3. Use the returned credentials in the `*.authorization.createToken` method to obtain your access token
4. Set the return access token for all future authenticated requests via the `*.setToken` method

```js
import { createClickup } from "clickup.js";

const clickup = createClickup("YOUR_PERSONAL_TOKEN");

const tokenResponse = await clickup.authorization.createToken({
	clientId: "YOUR_CLIENT_ID",
	clientSecret: "YOUR_CLIENT_SECRET",
	code: "AUTHORIZATION_CODE",
});

// Set the token for all future authenticated requests
clickup.setToken(tokenResponse.access_token);
```

## Quick Start: Make Your First API Call

Now that your client is authenticated, try fetching your teams (workspaces) as a simple test:

```js
const teams = await clickup.authorization.teams();

console.log(teams);
// {
//   teams: [
//     {
//       id: '123456',
//       name: 'My Awesome Team',
//       color: '#ff4081',
//       avatar: 'https://attachments.clickup.com/avatar/...jpg',
//       members: [
//         {
//           user: {
//             id: 987654,
//             username: 'john.doe',
//             email: 'john@example.com',
//             color: '#00ff00',
//             initials: 'JD',
//             profilePicture: 'https://attachments.clickup.com/profilePictures/...jpg'
//           },
//           invited_by: {
//             id: 123456,
//             username: 'admin',
//             email: 'admin@example.com',
//             color: '#0000ff',
//             initials: 'AD',
//             profilePicture: null
//           }
//         }
//       ]
//     }
//   ]
// }
```

This retrieves basic information about the teams you're part of.

::: info
Explore more methods: The SDK provides intuitive access to all ClickUp API endpoints. Check the full list of available methods in the [API reference](/api).
:::
