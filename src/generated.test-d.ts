import { expectTypeOf, test } from "vitest";
import type { MethodId, Namespaces, PaginatedMethodId, routes } from "./generated/routes.gen.ts";
import type { PageItem, PaginatedMethod, Params } from "./types.ts";

type Routes = typeof routes;

type BoundParam<N extends MethodId> = keyof Routes[N]["bindings"];

type RouteRequires<N extends MethodId> = Routes[N] extends { required: readonly (infer R)[] } ? R : never;

type VariantKeys<T> = T extends unknown ? keyof T : never;

type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

type NotRequiredIn<T, All> = T extends unknown ? Exclude<All, RequiredKeys<T>> : never;

type RequiredInEvery<T> = Exclude<VariantKeys<T>, NotRequiredIn<T, VariantKeys<T>>>;

type SameMembers<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

type NamedDifferently = {
	[N in MethodId]: SameMembers<VariantKeys<Params<N>>, BoundParam<N>> extends true ? never : N;
}[MethodId];

type RequiredDifferently = {
	[N in MethodId]: SameMembers<RequiredInEvery<Params<N>>, RouteRequires<N>> extends true ? never : N;
}[MethodId];

type PaginatedWithoutItems = {
	[N in MethodId]: Routes[N] extends { pagination: object } ? ([PageItem<N>] extends [never] ? N : never) : never;
}[MethodId];

type MethodNamed<N extends MethodId> = N extends `${infer S extends keyof Namespaces}.${infer M}`
	? M extends keyof Namespaces[S]
		? Namespaces[S][M]
		: never
	: never;

type PaginatedUntyped = {
	[N in PaginatedMethodId]: [MethodNamed<N>] extends [PaginatedMethod<N>] ? never : N;
}[PaginatedMethodId];

test("When an endpoint is generated, then its params type and its route name the same params", () => {
	expectTypeOf<NamedDifferently>().toBeNever();
});

test("When an endpoint is generated, then its params type requires the params its route requires", () => {
	expectTypeOf<RequiredDifferently>().toBeNever();
});

test("When an endpoint is paginated, then it has an item type", () => {
	expectTypeOf<PaginatedWithoutItems>().toBeNever();
});

test("When an endpoint is paginated, then its method is typed PaginatedMethod, so pages() takes it", () => {
	expectTypeOf<PaginatedUntyped>().toBeNever();
});
