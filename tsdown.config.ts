import { defineConfig } from "tsdown";

export default defineConfig({
	// webhooks gets its own entry, so a webhook receiver doesn't load the client
	entry: { index: "src/index.ts", webhooks: "src/webhooks/index.ts" },
	platform: "neutral",
	dts: true,
	exports: true,
});
