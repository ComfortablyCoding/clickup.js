/** A webhook's secret, like those `webhook.create` returns. */
export const secret = "O94IM25S7PXBPYTMNXLLET230SRP0S89COR7B1YOJ2ZIE8WQNK5UUKEF26W0Z5GA";

/** ClickUp's taskStatusUpdated example, without whitespace, as ClickUp sends it. */
export const body: string = JSON.stringify({
	event: "taskStatusUpdated",
	history_items: [
		{
			id: "2800787326392370170",
			type: 1,
			date: "1642736073330",
			field: "status",
			parent_id: "162641062",
			data: { status_type: "custom" },
			source: null,
			user: {
				id: 183,
				username: "John",
				email: "john@company.com",
				color: "#7b68ee",
				initials: "J",
				profilePicture: null,
			},
			before: { status: "to do", color: "#f9d900", orderindex: 0, type: "open" },
			after: { status: "in progress", color: "#7C4DFF", orderindex: 1, type: "custom" },
		},
	],
	task_id: "1vj38vv",
	webhook_id: "7fa3ec74-69a8-4530-a251-8a13730bd204",
});

/** {@link body}'s HMAC-SHA256 under {@link secret}, computed with node:crypto as ClickUp's docs do. */
export const signature = "8100670e20370c067b8cbaf001480a03246bba4d91a7ac52d864afa766dbee79";

/** A webhook request, as ClickUp sends one: by default, {@link body} with its `X-Signature`. */
export function delivery(headers: Record<string, string> = { "X-Signature": signature }, text: string = body): Request {
	return new Request("https://example.com/clickup", {
		method: "POST",
		headers: { "content-type": "application/json", ...headers },
		body: text,
	});
}
