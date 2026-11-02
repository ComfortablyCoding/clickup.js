import { expect, test, vi } from "vitest";
import { createClickUp, pages, type ClickUp, type WithWorkspace } from "./index.ts";
import { fakeFetch, type Reply } from "../test/helpers/fake-fetch.ts";

const TOKEN = "pk_81234567_5RZ0QF9M2KJXW8YB1LTD4HNC7VAPGE3S";
const TASK_ID = "86a1b2c3d";
const LIST_ID = 901234567;
const VIEW_ID = "3c-105";
const WORKSPACE_ID = 9012345;

function setup(replies: Reply[]) {
	const { fetch, received } = fakeFetch(replies);
	vi.stubGlobal("fetch", fetch);

	return { clickup: createClickUp({ token: TOKEN, workspace: { id: WORKSPACE_ID } }), received };
}

function queries(received: ReturnType<typeof fakeFetch>["received"]): Record<string, string>[] {
	return received.map(({ url }) => Object.fromEntries(url.searchParams));
}

test.each<{
	scenario: string;
	read: (clickup: WithWorkspace<ClickUp>) => AsyncIterable<unknown>;
	replies: Reply[];
	sent: object[];
}>([
	{
		scenario: "a method pages by page, then it asks for the next until last_page, keeping the other params",
		read: (clickup) => pages(clickup.list.listTasks, { list_id: LIST_ID, include_closed: true }),
		replies: [
			{ body: { tasks: [{ id: "86a1" }], last_page: false } },
			{ body: { tasks: [{ id: "86a2" }], last_page: true } },
		],
		sent: [
			{ include_closed: "true", page: "0" },
			{ include_closed: "true", page: "1" },
		],
	},
	{
		scenario: "a method pages by page with no last_page, then it asks for the next until an empty page",
		read: (clickup) => pages(clickup.workspace.listTaskTemplates),
		replies: [{ body: { templates: [{ id: "t-1" }] } }, { body: { templates: [] } }],
		sent: [{ page: "0" }, { page: "1" }],
	},
	{
		scenario: "a page is given, then it starts there",
		read: (clickup) => pages(clickup.view.listTasks, { view_id: VIEW_ID, page: 4 }),
		replies: [
			{ body: { tasks: [{ id: "86a1" }], last_page: false } },
			{ body: { tasks: [{ id: "86a2" }], last_page: true } },
		],
		sent: [{ page: "4" }, { page: "5" }],
	},
	{
		scenario: "a method pages by cursor, then it sends next_cursor as cursor until there isn't one",
		read: (clickup) => pages(clickup.chatChannel.list, { limit: 2 }),
		replies: [
			{ body: { data: [{ id: "c-1" }, { id: "c-2" }], next_cursor: "eyJwIjoyfQ" } },
			{ body: { data: [{ id: "c-3" }], next_cursor: null } },
		],
		sent: [{ limit: "2" }, { limit: "2", cursor: "eyJwIjoyfQ" }],
	},
	{
		scenario: "a method pages by cursor, then a cursor that doesn't change ends it",
		read: (clickup) => pages(clickup.chatChannel.list),
		replies: [
			{ body: { data: [{ id: "c-1" }], next_cursor: "eyJwIjoyfQ" } },
			{ body: { data: [{ id: "c-1" }], next_cursor: "eyJwIjoyfQ" } },
		],
		sent: [{}, { cursor: "eyJwIjoyfQ" }],
	},
	{
		scenario: "a method pages by keyset, then it sends the last comment's date and id until an empty page",
		read: (clickup) => pages(clickup.task.listComments, { task_id: TASK_ID }),
		replies: [
			{
				body: {
					comments: [
						{ id: "90010", date: "1761300000000" },
						{ id: "90009", date: "1761200000000" },
					],
				},
			},
			{ body: { comments: [] } },
		],
		sent: [
			{ team_id: String(WORKSPACE_ID) },
			{ team_id: String(WORKSPACE_ID), start: "1761200000000", start_id: "90009" },
		],
	},
	{
		scenario: "a method pages by keyset, then a page whose last comment has no date is the last",
		read: (clickup) => pages(clickup.task.listComments, { task_id: TASK_ID }),
		replies: [{ body: { comments: [{ id: "90010", date: null }] } }],
		sent: [{ team_id: String(WORKSPACE_ID) }],
	},
])("When $scenario", async ({ read, replies, sent }) => {
	const { clickup, received } = setup([...replies]);

	const yielded = await Array.fromAsync(read(clickup));

	expect(yielded).toEqual(replies.map((reply) => (reply as { body: unknown }).body));
	expect(queries(received)).toEqual(sent);
});

test("When the loop breaks, then no more pages are asked for", async () => {
	const { clickup, received } = setup([
		{ body: { tasks: [{ id: "86a1" }], last_page: false } },
		{ body: { tasks: [{ id: "86a2" }], last_page: false } },
	]);

	for await (const page of pages(clickup.list.listTasks, { list_id: LIST_ID })) {
		expect(page.tasks).toEqual([{ id: "86a1" }]);
		break;
	}

	expect(received).toHaveLength(1);
});

test("When options are given, then every page's call gets them", async () => {
	const { clickup, received } = setup([
		{ body: { tasks: [{ id: "86a1" }], last_page: false } },
		{ body: { tasks: [{ id: "86a2" }], last_page: true } },
	]);

	await Array.fromAsync(pages(clickup.list.listTasks, { list_id: LIST_ID }, { headers: { "X-Trace": "abc" } }));

	expect(received.map(({ request }) => request.headers.get("x-trace"))).toEqual(["abc", "abc"]);
});

test.each([
	{
		scenario: "a method that isn't paginated",
		// @ts-expect-error task.get isn't paginated
		read: (clickup: WithWorkspace<ClickUp>) => pages(clickup.task.get, { task_id: TASK_ID }),
	},
	{
		scenario: "a function that isn't a client's method",
		read: (clickup: WithWorkspace<ClickUp>) =>
			// @ts-expect-error only the client's own methods are paginated
			pages((params: { list_id: number }) => clickup.list.listTasks(params), { list_id: LIST_ID }),
	},
])("When given $scenario, then it throws a TypeError and sends nothing", ({ read }) => {
	const { clickup, received } = setup([]);

	expect(() => read(clickup)).toThrow(
		new TypeError("pages() takes a paginated method of a client, like clickup.list.listTasks"),
	);
	expect(received).toHaveLength(0);
});
