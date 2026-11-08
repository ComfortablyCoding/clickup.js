# Naming

Every method has the same shape, `clickup.<namespace>.<verb><Noun>(params, options)`:

```ts
clickup.task.get({ task_id });
clickup.list.createTask({ list_id, name });
clickup.task.addTag({ task_id, tag_name });
clickup.timeEntry.start();
```

In [`spec/openapi.yaml`](https://github.com/ComfortablyCoding/clickup.js/blob/main/spec/openapi.yaml), the namespace is an operation's tag and the method name is its `x-sdk-method`. New endpoints should follow the rules below.

## Namespace

A method goes on **the first resource whose ID is in the URL**, which is the thing the call acts on:

| Endpoint                                                              | Method                 |
| --------------------------------------------------------------------- | ---------------------- |
| `GET /v2/task/{task_id}`                                              | `task.get`             |
| `POST /v2/list/{list_id}/task`                                        | `list.createTask`      |
| `PUT /v2/checklist/{checklist_id}/checklist_item/{checklist_item_id}` | `checklist.updateItem` |
| `POST /v3/workspaces/{workspace_id}/docs/{doc_id}/pages`              | `doc.createPage`       |

**The workspace is the exception.** The client fills in its ID, so calls under it go on the resource they act on instead: `space.list()`, `goal.create()`, `task.search()`. Only calls about the workspace itself, like its plan, seats and custom roles, stay on `workspace`.

**Namespaces use ClickUp's product names**, not the API's: `workspace` rather than `team`, and `userGroup` rather than `group`.

## Verbs

This list is closed, so a new verb needs a row here first.

| Verb                             | For                                              | Examples                                       |
| -------------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| `get`                            | Reading one thing                                | `task.get`, `workspace.getPlan`                |
| `list`                           | Reading a parent's children                      | `list.listTasks`, `space.list`                 |
| `search`                         | Searching across the workspace                   | `task.search`, `doc.search`                    |
| `create`                         | Making a new thing                               | `list.createTask`, `space.createTag`           |
| `create…FromTemplate`            | Making a new thing from a template               | `list.createTaskFromTemplate`                  |
| `update`                         | Changing an object's own fields                  | `task.update`                                  |
| `replace`                        | PUT, where the API also has a PATCH              | `task.replaceTimeEstimatesByUser`              |
| `delete`                         | Destroying a thing                               | `task.delete`                                  |
| `add`                            | Attaching something that exists                  | `task.addTag`, `list.addTask`                  |
| `remove`                         | Detaching without destroying, so no data is lost | `task.removeTag`, `user.remove`                |
| `invite`                         | Bringing a person into the workspace             | `user.invite`, `guest.invite`                  |
| `set` / `clear`                  | Filling or emptying a slot defined elsewhere     | `task.setCustomFieldValue`                     |
| `start`, `stop`, `merge`, `move` | State changes ClickUp has its own word for       | `timeEntry.start`, `task.merge`, `folder.move` |

Some verbs aren't used at all: `edit` (use `update`), `fetch` and `retrieve` (use `get`), and `attach` and `detach` (use `add` and `remove`). Noun-only getters aren't used either, so it's `task.listComments()` rather than `task.comments()`.

## Nouns

- **Use ClickUp's word**, not the URL's: `customField` rather than `field`.
- **Keep it singular**, except after `list` and `search`, for calls that act on several at once, and where ClickUp's own word is plural: `createTask`, `listTasks`, `timeEntry.addTags`.
- **Leave it out when the namespace already says it:** `task.get` rather than `task.getTask`, and `checklist.createItem` rather than `checklist.createChecklistItem`.
