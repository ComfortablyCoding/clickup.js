---
title: Tasks
description: 'Examples on using the Tasks endpoints'
position: 01
category: 'Examples'
---

### Create a task

```js
(async () => {
 try {
  // create a task on a list
  const taskData = {
   name: 'New Task Name',
   description: 'New Task Description',
   assignees: [183],
   tags: ['new'],
   status: 'Open',
   priority: 3,
   due_date: 1508369194377,
   due_date_time: false,
   time_estimate: 8640000,
   start_date: 1567780450202,
   start_date_time: false,
   notify_all: true,
   parent: null,
   links_to: null,
   check_required_custom_fields: true,
   custom_fields: [
    {
     id: '0a52c486-5f05-403b-b4fd-c512ff05131c',
     value: 23,
    },
    {
     id: '03efda77-c7a0-42d3-8afd-fd546353c2f5',
     value: 'Text field input',
    },
   ],
  };

  const { body } = await clickup.lists.createTask(1234, taskData);
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

### Fetch a task

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
