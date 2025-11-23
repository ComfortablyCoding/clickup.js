# API Examples

This page demonstrates usage of some of the APIs provided by clickup.js.

All example assume a client named `clickup` has already been created

## Get Authorized User Info

```js
async function getMe() {
 const userResponse = await clickup.authorization.user();
 console.log("Logged in as:", userResponse.user.username);
}

getMe();
```

## Create a New Task

```js
async function createTask() {
 const task = await clickup.list.createTask("LIST_ID", {
  name: "My New Task",
  description: "This is a test task created via clickup.js",
  assignees: [123456], // User IDs
  due_date: Date.now() + 86400000, // Tomorrow in ms
  priority: 1, // 1: Urgent, 2: High, 3: Normal, 4: Low
 });

 console.log("Task created:", task.id);
}

createTask();
```

## Get Tasks from a List

```js
async function getTasks() {
 const tasksResponse = await clickup.list.tasks("LIST_ID", {
  include_closed: true,
  page: 0,
 });

 tasksResponse.tasks.forEach((t) => console.log(t.name));
}

getTasks();
```

## Update a Task

```js
async function updateTask() {
 const updated = await clickup.task.update("TASK_ID", {
  name: "Updated Task Name",
  status: "in progress",
 });

 console.log("Updated:", updated);
}

updateTask();
```

## Add a Comment to a Task

```js
async function addComment() {
 const comment = await clickup.task.addComment("TASK_ID", {
  comment_text: "This is a comment from clickup.js!",
  assignee: 123456,
  notify_all: true,
 });

 console.log("Comment ID:", comment.id);
}

addComment();
```

::: info
Check out the documentation for the [full list of available APIs](/api).
:::
