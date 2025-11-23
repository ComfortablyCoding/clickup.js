import { defineConfig } from "vitepress";
import fs from "fs";
import path from "path";

export default defineConfig({
	title: "clickup.js",
	description: "A Node.js wrapper for the Clickup API",
	themeConfig: {
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Examples", link: "/examples" },
			{ text: "API", link: "/api" },
		],

		sidebar: [
			{ text: "Getting Started", link: "/getting-started" },
			{
				text: "Documentation",
				items: [
					{ text: "Example", link: "/examples" },
					{ text: "API Reference", link: "/api" },
				],
			},
			{ text: "Changelog", link: "/changelog" },
		],

		socialLinks: [{ icon: "github", link: '"https://github.com/ComfortablyCoding/clickup.js' }],
	},
	vite: {
		plugins: [
			{
				name: "copy-changelog",
				apply: "build",
				buildStart() {
					const rootChangelog = path.resolve(process.cwd(), "CHANGELOG.md");
					const target = path.resolve(process.cwd(), "docs/changelog.md");

					if (fs.existsSync(rootChangelog)) {
						fs.copyFileSync(rootChangelog, target);
						console.log("✓ Moved CHANGELOG.md into docs/changelog.md");
					}
				},
			},
		],
	},
});
