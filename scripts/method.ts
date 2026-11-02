import type { Route } from "../src/route.ts";
import {
	listSchemaVariants,
	resolveRef,
	type Spec,
	type Operation,
	type Parameter,
	type PathOperation,
	type Schema,
} from "./spec.ts";

/** One param of a method, as the docs show it. */
export interface ParamDescription {
	/** Its name, as the method takes it */
	name: string;
	/** Where the request sends it */
	in: Route["bindings"][string];
	/** Whether a call must include it */
	required: boolean;
	/** Its type, like `string`, `Task` or `number[]` */
	type: string;
	/** From the spec, or empty if it has none */
	description: string;
}

/** Everything the generated code and docs say about one method; read at build time only. */
export interface MethodDefinition {
	/** `task.get`: namespace, then method; one of the generated `MethodId`s */
	id: string;
	/** `task`, its tag */
	namespace: string;
	/** `get`: its `x-sdk-method`, not the HTTP method */
	method: string;
	/** `TaskGet`, the prefix of hey-api's type names: `TaskGetData`, `TaskGetResponses` */
	typePrefix: string;
	/** What the runtime needs to send its calls: the only part the package ships as code */
	route: Route;
	/** What its JSDoc and the methods page say */
	docs: MethodDocs;
}

/** What a method's JSDoc and the methods page say about it. */
export interface MethodDocs {
	/** The operation's summary, or its method name if it has none */
	summary: string;
	/** The operation's description, or empty if it has none */
	description: string;
	/** ClickUp's reference page */
	referenceUrl: string;
	/** Its clickup.js code sample, from `x-codeSamples`, which tsc checks too */
	sample: string;
	/** Its path and query params, then its body's, for the methods page */
	params: ParamDescription[];
}

/** A path or query param; the runtime sets headers itself. */
type PathOrQueryParameter = Parameter & { in: "path" | "query" };

/** A schema a body field may have. */
type FieldSchema = NonNullable<Schema["properties"]>[string];

/** An operation's request body, as {@link readRequestBody} reads it. */
interface RequestBody {
	/** How the route takes it, or `undefined` if there's no body */
	body?: Route["body"];
	/** Its schema in that media type, with `$ref`s followed */
	schema?: Schema;
	/** Whether a call must send it */
	required: boolean;
	/** Every variant's fields, each with the schemas the variants give it */
	fields: Map<string, FieldSchema[]>;
	/** The fields it always requires: its own and its allOf parts' */
	requiredFields: string[];
}

/** An operation's method definition, for the generated code and docs. */
export function toMethod(spec: Spec, pathOperation: PathOperation): MethodDefinition {
	const { operation } = pathOperation;
	const {
		tags: [namespace],
		"x-sdk-method": method,
	} = operation;
	const params = (operation.parameters ?? [])
		// Drops a $ref leading nowhere, which hey-api has already warned of
		.flatMap((param) => resolveRef(spec, param) ?? [])
		.filter((param): param is PathOrQueryParameter => param.in === "path" || param.in === "query");
	const requestBody = readRequestBody(spec, operation);
	const route = toRoute(pathOperation, params, requestBody);

	return {
		id: `${namespace}.${method}`,
		namespace,
		method,
		typePrefix: [namespace, method].map((part) => part[0].toUpperCase() + part.slice(1)).join(""),
		route,
		docs: {
			summary: operation.summary ?? method,
			description: operation.description ?? "",
			referenceUrl: operation.externalDocs?.url ?? "",
			sample: operation["x-codeSamples"]?.find((sample) => sample.label === "clickup.js")?.source ?? "",
			params: [
				...params.map((param): ParamDescription => ({
					name: param.name,
					in: param.in,
					required: Boolean(param.required),
					type: describeType(param.schema),
					description: param.description ?? "",
				})),
				...describeBodyParams(spec, requestBody, route),
			],
		},
	};
}

/** What the runtime needs to send the operation's calls. */
function toRoute(
	{ path, method, operation }: PathOperation,
	params: PathOrQueryParameter[],
	requestBody: RequestBody,
): Route {
	const { body } = requestBody;
	// A list, or a FormData the caller builds to pick its fields' order, is passed whole as `data`
	const whole = body === "raw" || body === "multipart";
	// The spec lists path params first, in the URL's order, and always requires them
	const required = [
		...params.filter((param) => param.required).map((param) => param.name),
		...(whole ? (requestBody.required ? ["data"] : []) : requestBody.requiredFields),
	];
	const pagination = operation["x-sdk-pagination"];

	return {
		method: method.toUpperCase() as Route["method"],
		path,
		bindings: Object.fromEntries([
			...params.map((param) => [param.name, param.in] as const),
			// A body field with the same name as a path or query param can't replace it
			...(whole ? ["data"] : [...requestBody.fields.keys()])
				.filter((name) => !params.some((param) => param.name === name))
				.map((name) => [name, "body"] as const),
		]),
		...(required.length > 0 && { required }),
		...(body && { body }),
		...(pagination && { pagination }),
	};
}

/** The operation's request body, in the media type the runtime sends. */
function readRequestBody(spec: Spec, operation: Operation): RequestBody {
	const requestBody = resolveRef(spec, operation.requestBody);
	const content = requestBody?.content ?? {};
	// Prefer JSON when it's offered
	const [mediaType, body] =
		Object.entries({ "application/json": "json", "multipart/form-data": "multipart" } as const).find(
			([candidate]) => content[candidate],
		) ?? [];
	const schema = mediaType === undefined ? undefined : resolveRef(spec, content[mediaType].schema);
	// A list has no fields to take as params
	const list = body === "json" && schema !== undefined && !schema.properties && [schema.type].flat().includes("array");
	const fields = new Map<string, FieldSchema[]>();

	for (const variant of listSchemaVariants(spec, schema)) {
		for (const [name, field] of Object.entries(variant.properties ?? {})) {
			fields.set(name, [...(fields.get(name) ?? []), field]);
		}
	}

	return {
		body: list ? "raw" : body,
		schema,
		required: Boolean(requestBody?.required),
		fields,
		requiredFields: [...new Set(listRequiredFields(spec, schema))],
	};
}

/** A body's required fields: its own and its allOf parts', not those only some anyOf/oneOf variants require. */
function listRequiredFields(spec: Spec, schema: Schema | undefined): string[] {
	const resolved = resolveRef(spec, schema);

	return resolved
		? [...(resolved.required ?? []), ...(resolved.allOf ?? []).flatMap((part) => listRequiredFields(spec, part))]
		: [];
}

/** The body's params, for the docs: each field of a JSON body, or `data` for one passed whole. */
function describeBodyParams(spec: Spec, requestBody: RequestBody, route: Route): ParamDescription[] {
	const { body, schema } = requestBody;

	if (body === "json") {
		return [...requestBody.fields]
			.filter(([name]) => route.bindings[name] === "body")
			.map(([name, schemas]): ParamDescription => ({
				name,
				in: "body",
				required: route.required?.includes(name) ?? false,
				type: [...new Set(schemas.map((field) => describeType(field)))].join(" \\| "),
				description:
					schemas
						.map((field) => (typeof field === "object" ? resolveRef(spec, field)?.description : undefined))
						.find(Boolean) ?? "",
			}));
	}

	if (!body) {
		return [];
	}

	return [
		{
			name: "data",
			in: "body",
			required: route.required?.includes("data") ?? false,
			type: body === "multipart" ? "FormData" : describeType(schema),
			description: schema?.description ?? "",
		},
	];
}

/** A short type for the docs, its pipes escaped for Markdown tables. */
export function describeType(schema: Schema | boolean | undefined): string {
	if (!schema || typeof schema !== "object") {
		return "unknown";
	}

	if (schema.$ref) {
		return schema.$ref.split("/").at(-1) ?? schema.$ref;
	}

	if (schema.enum) {
		return schema.enum.map((value) => JSON.stringify(value)).join(" \\| ");
	}

	const union = schema.oneOf ?? schema.anyOf;

	if (union) {
		return [...new Set(union.map((variant) => describeType(variant)))].join(" \\| ");
	}

	const types: string[] = [schema.type ?? []].flat();

	if (types.length === 0) {
		return schema.properties ? "object" : "unknown";
	}

	return types
		.map((type) => {
			if (type === "array") {
				const items = describeType(schema.items);

				return `${items.includes("|") ? `(${items})` : items}[]`;
			}

			return type === "integer" ? "number" : type;
		})
		.join(" \\| ");
}
