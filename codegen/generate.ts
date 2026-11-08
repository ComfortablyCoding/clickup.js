import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@hey-api/openapi-ts";
import { renderApiPage, renderRoutesModule, renderSamplesModule } from "./render.ts";
import { toMethod, type MethodDefinition } from "./method.ts";
import type { Spec, Operation } from "./spec.ts";

/** The package's root. */
const root = path.join(import.meta.dirname, "..");
/** Where the generated modules go, both hey-api's and render.ts's. */
const generated = path.join(root, "src/generated");
/** Where the method reference goes. typedoc adds the client reference afterwards. */
const api = path.join(root, "docs/api");

try {
	/** The spec hey-api reads, captured in `patch.input`, which runs before `patch.operations` */
	let spec: Spec = {};
	/** Each operation's method definition, collected as hey-api patches it */
	const definitions: MethodDefinition[] = [];

	await createClient({
		input: path.join(root, "spec/openapi.yaml"),
		parser: {
			patch: {
				input: (input) => {
					spec = input as Spec;
				},
				operations: (httpMethod, operationPath, patched) => {
					const operation = patched as Operation;
					const definition = toMethod(spec, {
						method: httpMethod,
						path: operationPath,
						operation,
					});

					// hey-api names the types after operationId, like `TaskGetData` for `task.get`
					operation.operationId = definition.typePrefix;
					definitions.push(definition);
				},
			},
		},
		output: { path: generated, entryFile: false },
		plugins: ["@hey-api/typescript"],
		logs: { level: "warn" },
	});

	// docs/api/ is gitignored, so a fresh clone won't have it, and writeFile doesn't create folders
	await fs.mkdir(api, { recursive: true });
	await Promise.all([
		fs.writeFile(path.join(generated, "routes.gen.ts"), renderRoutesModule(definitions)),
		fs.writeFile(path.join(generated, "samples.gen.ts"), renderSamplesModule(definitions)),
		fs.writeFile(path.join(api, "index.md"), renderApiPage(definitions)),
	]);

	console.log(`generated ${definitions.length} methods`);
} catch (error) {
	console.error(Error.isError(error) ? error.message : String(error));
	process.exitCode = 1;
}
