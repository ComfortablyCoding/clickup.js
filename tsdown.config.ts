import { defineConfig } from "tsdown";

export default defineConfig({
	entry: { index: "src/index.ts" },
	platform: "neutral",
	dts: true,
	exports: true,
});
