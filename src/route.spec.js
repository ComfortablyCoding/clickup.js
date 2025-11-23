import { describe, test, expect } from "vitest";
import { Route } from "./route.js";
import { Clickup } from "./client.js";

describe("Route", () => {
	test("should create a Route instance with defaults", () => {
		const mockClient = new Clickup();

		const route = new Route({ client: mockClient });

		expect(route).toBeInstanceOf(Route);
		expect(route.client).toBe(mockClient);
		expect(route.route).toBe("");
		expect(route.version).toBe("v2");
	});

	test("should set route if provided", () => {
		const mockClient = new Clickup();
		const route = new Route({ client: mockClient, route: "/tasks" });

		expect(route.route).toBe("/tasks");
	});

	test("should set version if provided", () => {
		const mockClient = new Clickup();
		const route = new Route({ client: mockClient, version: "v3" });

		expect(route.version).toBe("v3");
	});

	test("should allow a route to be re-used with the same client", () => {
		const mockClient = new Clickup();
		const route1 = new Route({ client: mockClient, route: "/tasks" });
		const route2 = new Route({ client: mockClient, route: "/folders" });

		expect(route1.client).toBe(route2.client);
		expect(route1.route).not.toBe(route2.route);
	});
});
