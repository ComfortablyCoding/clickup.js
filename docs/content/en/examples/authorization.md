---
title: Authorization
description: 'Examples on using the Authorization endpoints'
position: 00
category: 'Examples'
---

### Get the authorized team(s) for this token

```js
(async () => {
 try {
  // get the authorized team(s) for the given token
  const { body } = await clickup.authorization.getAuthorizedTeams();
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
