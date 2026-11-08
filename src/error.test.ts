import { expect, test } from "vitest";
import { ClickUpError } from "./error.ts";

const updateTask = () =>
	new Request("https://api.clickup.com/api/v2/task/86a1b2c3d", {
		method: "PUT",
	});

test.each([
	{
		shape: "its v2 error body",
		body: { err: "Task not found, deleted", ECODE: "ITEM_013" },
		message: "Task not found, deleted",
		code: "ITEM_013",
	},
	{
		shape: "the v3 error body it documents",
		body: {
			status: 404,
			message: "Doc not found",
			trace_id: "1b4e28ba2fa1",
			timestamp: 1761307200000,
		},
		message: "Doc not found",
		code: undefined,
	},
	{
		shape: "a v3 auth error body",
		body: {
			err: "Oauth token not found",
			ECODE: "OAUTH_019",
			status: 401,
			message: "Not authorized",
		},
		message: "Not authorized",
		code: "OAUTH_019",
	},
	{
		shape: "a v3 validation error body",
		body: {
			err: "Bad Request",
			status: 400,
			message: ["name should not be empty", "name must be a string"],
			error: "Bad Request",
			statusCode: 400,
		},
		message: "name should not be empty; name must be a string",
		code: undefined,
	},
])("When ClickUp sends $shape, then the error has its message and code", ({ body, message, code }) => {
	const response = new Response(null, { status: 400 });

	const error = ClickUpError.fromResponse(response, updateTask(), { body });

	expect({ message: error.message, code: error.code }).toEqual({
		message,
		code,
	});
});

test.each([
	{ body: null, statusText: "Bad Gateway", message: "502 Bad Gateway" },
	{
		body: "<html><body>502 Bad Gateway</body></html>",
		statusText: "Bad Gateway",
		message: "502 Bad Gateway",
	},
	{
		body: { err: 502, message: [] },
		statusText: "Bad Gateway",
		message: "502 Bad Gateway",
	},
	{ body: {}, statusText: "", message: "502" },
])("When the body has no message ($body), then the message is the status line", ({ body, statusText, message }) => {
	const response = new Response(null, { status: 502, statusText });

	const error = ClickUpError.fromResponse(response, updateTask(), { body });

	expect(error.message).toBe(message);
});

test("When made from a response, then it carries the status and the request's method and URL", () => {
	const response = new Response(null, { status: 409 });

	const error = ClickUpError.fromResponse(response, updateTask());

	expect(error).toBeInstanceOf(Error);
	expect(error).toMatchObject({
		name: "ClickUpError",
		status: 409,
		method: "PUT",
		url: "https://api.clickup.com/api/v2/task/86a1b2c3d",
	});
});
