# API

Every endpoint is a method on the client, `clickup.<namespace>.<method>(params, options)`. The [client reference](./reference/index.md) covers `createClickUp`, its options, [`pages()`](./reference/index.md#pages) and the errors it throws.

## list

### list.createTask

**Create Task** · `POST /v2/list/{list_id}/task` · [ClickUp reference](https://developer.clickup.com/reference/createtask)

Creates a task in a List.

Its assignees are notified.

```ts
await clickup.list.createTask({ list_id: 901234567, name: "Ship v5" });
```

| Parameter | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `list_id` | path | `number` | yes | The List's ID |
| `custom_task_ids` | query | `boolean` |  |  |
| `name` | body | `string` | yes | Its name \| title,<br>as the List shows it |

Returns [`Promise<Result<"list.createTask">>`](./reference/index.md#result).

### list.listTasks

**Get Tasks** · `GET /v2/list/{list_id}/task` · [ClickUp reference](https://developer.clickup.com/reference/gettasks)

```ts
const page = await clickup.list.listTasks({
	list_id: 901234567,
});

console.log(page.tasks);
```

| Parameter | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `list_id` | path | `number` | yes | The List's ID |

Returns [`Promise<Result<"list.listTasks">>`](./reference/index.md#result). Each call returns one page of `tasks`; `pages(clickup.list.listTasks, params)` reads every page.

## user

### user.get

**Get Authorized User** · `GET /v2/user` · [ClickUp reference](https://developer.clickup.com/reference/getauthorizeduser)

```ts
await clickup.user.get();
```

Returns [`Promise<Result<"user.get">>`](./reference/index.md#result).
