import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
	js.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	prettier,
	{
		ignores: ["docs/", ".vscode/", "*.yaml", "dist/"],
	},
];
