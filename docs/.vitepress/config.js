import { defineConfig } from "vitepress";

export default defineConfig({
	title: "clickup.js",
	base: "/clickup.js/",
	description: "A typed client for the ClickUp API",
	themeConfig: {
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Getting Started", link: "/getting-started" },
			{ text: "Examples", link: "/examples" },
			{ text: "API", link: "/api" },
		],

		sidebar: [
			{ text: "Getting Started", link: "/getting-started" },
			{ text: "Naming", link: "/naming" },

			{
				text: "Documentation",
				items: [{ text: "Examples", link: "/examples" }],
			},
			{
				text: "API Reference",
				items: [
					{ text: "Methods", link: "/api" },
					{ text: "Client", link: "/api/reference/" },
					{ text: "Webhooks", link: "/api/reference/clickup.js/webhooks" },
				],
			},
			{ text: "Changelog", link: "/changelog" },
		],
		search: { provider: "local" },
		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/ComfortablyCoding/clickup.js",
			},
		],
	},
});
