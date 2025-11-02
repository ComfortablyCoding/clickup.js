import { defineConfig } from "vitepress";

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
			{
				text: "Documentation",
				items: [
					{ text: "Example", link: "/examples" },
					{ text: "Example", link: "/examples" },
					{ text: "API Reference", link: "/api" },
				],
			},
		],

		socialLinks: [{ icon: "github", link: '"https://github.com/ComfortablyCoding/clickup.js' }],
	},
});
