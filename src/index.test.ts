import { expect, test } from "vitest";
import * as clickup from "./index.ts";

test("When the package is imported, then createClickUp and ClickUpError are its only runtime exports", () => {
	const exported = Object.keys(clickup).sort();

	expect(exported).toEqual(["ClickUpError", "createClickUp"]);
});
