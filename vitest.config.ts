import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["src/**/*.test.ts", "codegen/**/*.test.ts"],
		unstubEnvs: true,
		unstubGlobals: true,
		restoreMocks: true,
		// Also type-checks the *.test-d.ts files with tsc
		typecheck: { enabled: true },
	},
});
