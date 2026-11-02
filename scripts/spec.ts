import type { OpenApi, OpenApiOperationObject, OpenApiParameterObject, OpenApiSchemaObject } from "@hey-api/openapi-ts";
import type { Pagination } from "../src/route.ts";

/** An OpenAPI 3.1 schema. */
export type Schema = OpenApiSchemaObject.V3_1_X;

/** A `$ref`, which hey-api exports only as part of other types. */
export type Reference = Extract<OpenApiParameterObject.V3_1_X, { $ref: string }>;

/** A parameter, rather than a `$ref` to one. */
export type Parameter = Exclude<OpenApiParameterObject.V3_1_X, Reference>;

/** An operation, following spec/openapi.yaml's conventions. */
export interface Operation extends OpenApiOperationObject.V3_1_X {
	/** Its only tag, which is the namespace: `task` in `task.get` */
	tags: [string];
	/** Its method's name in the namespace: `get` in `task.get` */
	"x-sdk-method": string;
	/** How it pages, for `pages()`; only on list endpoints */
	"x-sdk-pagination"?: Pagination;
}

/** The spec, as far as the scripts read it; `pnpm spec:check` validates the rest. */
export type Spec = Pick<OpenApi.V3_1_X, "components">;

/** One operation and where it's found, as hey-api's `patch.operations` receives it. */
export interface PathOperation {
	/** Its path, with `{param}` placeholders */
	path: string;
	/** Its HTTP method, in lower case */
	method: string;
	/** The operation itself */
	operation: Operation;
}

/** Follows `$ref`s, including refs to refs, or returns `undefined` if one leads nowhere. */
export function resolveRef<T>(spec: Spec, node: T | Reference | undefined): T | undefined {
	let found: unknown = node;

	while (isObjectOrArray(found) && typeof found.$ref === "string") {
		found = found.$ref
			.slice("#/".length)
			.split("/")
			.map((key) => key.replaceAll("~1", "/").replaceAll("~0", "~"))
			.reduce<unknown>((value, key) => (isObjectOrArray(value) ? value[key] : undefined), spec);
	}

	return found as T | undefined;
}

/** The schema, then every schema it leads to through refs, allOf, anyOf and oneOf. */
export function listSchemaVariants(spec: Spec, schema: Schema | undefined): Schema[] {
	const resolved = resolveRef(spec, schema);

	if (!resolved) {
		return [];
	}

	const parts = [...(resolved.allOf ?? []), ...(resolved.anyOf ?? []), ...(resolved.oneOf ?? [])];

	return [resolved, ...parts.flatMap((part) => listSchemaVariants(spec, part))];
}

/** Unlike `isObject` in src/utils.ts, arrays count, as a JSON pointer may index into one. */
function isObjectOrArray(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}
