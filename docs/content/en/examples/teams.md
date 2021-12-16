---
title: Teams
description: 'Examples on using the Teams endpoints'
position: 02
category: 'Examples'
---

### Get Filtered Team Tasks

```js
(async () => {
 try {
  // return all tasks that meet the criteria
  const filterData = {
   date_created: 1508369194377,
   'list_ids[]': [123],
   'statuses[]': ['active', 'in progress'],
  };
  const { body } = await clickup.teams.getFilteredTasks(543, filterData);
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
