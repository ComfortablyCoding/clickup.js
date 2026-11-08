# Contributing

Thanks for helping out! clickup.js is generated from its own OpenAPI spec, `spec/openapi.yaml`, so most changes end up in the spec or the generator rather than in hand-written code.

## Setup

You'll need Node 26 (see `.node-version`) and pnpm 12 (see `packageManager` in `package.json`).

```sh
pnpm install
pnpm test      # runs pnpm codegen first, which writes src/generated/
pnpm codegen   # re-run after editing spec/openapi.yaml while the tests are watching
```

Before you open a pull request, run the same checks as CI:

```sh
pnpm lint:check && pnpm format:check && pnpm spec:check && pnpm typecheck && pnpm test --run && pnpm build
```

## Layout

```
spec/openapi.yaml     the hand-edited spec everything is generated from
codegen/              the generator: generate.ts runs it, spec.ts reads the spec, method.ts describes each method, and render.ts renders the routes, samples and method reference
src/index.ts          the package's exports
src/client.ts         createClickUp and its options
src/route.ts          turns a method call into a request
src/types.ts          each method's params and result types
src/pages.ts          pages(), which reads every page of a list call
src/error.ts          ClickUpError
src/utils.ts          small helpers shared across src/
src/transport/        fetch, retries and rate limiting
src/webhooks/         the clickup.js/webhooks entry point
src/generated/        generator output (not committed)
test/helpers/         shared test helpers, like a fake fetch
```

Code in `src/` can only use web-standard APIs. `tsconfig.json` leaves out Node's types, so using `process` or importing from `node:` won't compile. The one exception is reading `CLICKUP_TOKEN` through a guarded `globalThis.process`.

`src/webhooks/` must not import `client.ts` or anything in `transport/`, so that a webhook receiver never loads the client. After `pnpm build`, check that `dist/webhooks.js` doesn't import `index.js`.

## The spec

`spec/openapi.yaml` is ClickUp's v2 and v3 specs, merged and corrected by hand. Its header comment lists all of its conventions; these are the main ones:

- **Names.** An operation's single tag is its namespace, and its `x-sdk-method` is its method name, following [docs/naming.md](docs/naming.md). The `operationId` stays as ClickUp has it, so the specs are still easy to compare.
- **Corrections.** Every change to ClickUp's specs gets an `x-clickup-corrections` entry with `was` (what ClickUp had), `reason` (the live API, or ClickUp's own examples for calls a Free Forever workspace can't make) and, optionally, `fields`.
- **Nullable responses.** Response fields are nullable unless ClickUp always fills them in.
- **Pagination.** A list call's `x-sdk-pagination` says how it pages (`page`, `cursor` or `keyset`) and which field holds the items.
- **Docs.** Every operation needs a summary, a description and an `x-codeSamples` sample. These become its JSDoc and its entry in the API reference. Requirements, such as a plan or a ClickApp, go on a `**Requires:** …` line.
- **Webhooks.** The `webhooks` section types every event ClickUp sends. The types are based on ClickUp's example payloads, corrected wherever live deliveries differ.

`pnpm spec:check` validates the spec, and `pnpm typecheck` compiles the generated code along with every sample. Nothing checks the conventions automatically, so keep an eye on them in review.

To catch up with ClickUp, download its [v2](https://developer.clickup.com/openapi/clickup-api-v2-reference.json) and [v3](https://developer.clickup.com/openapi/ClickUp_PUBLIC_API_V3.yaml) specs and compare operations by `operationId`. v3 paths live under `/v3/` and use lower-case path params. Keep in mind that removing a method is a breaking change.

## Tests and docs

Unit tests (`*.test.ts`) and type tests (`*.test-d.ts`, using `expectTypeOf`) sit next to the code they cover. To fake `fetch`, use `test/helpers/fake-fetch.ts`. Tests have no comments: a test's name says what it checks, apart from the reason on each `@ts-expect-error`.

The generated code is snapshot tested, with whole files kept in `__snapshots__/` folders:

- `src/__snapshots__/routes.json` has every method's route, as generated from the spec.
- `codegen/__snapshots__/` has each generated module, rendered for a few example methods.

Any change to the spec or the generator fails these until you run `pnpm test -u` to rewrite them. That way, the snapshot diff shows the change's effect in review, and a method or param disappearing there means a breaking change. Formatting and linting skip these files, since they're compared byte for byte.

The docs site in `docs/` is built with VitePress, and `pnpm docs:dev` serves it locally. The method reference is generated from the spec, and typedoc builds the client reference from JSDoc, so document anything you export.

## Pull requests

- Keep each pull request to one change, and include a test.
- Write commit messages as [Conventional Commits](https://www.conventionalcommits.org) with a short, lower-case, imperative summary, like `fix(transport): retry 504 responses`. Add a `!` before the colon for a breaking change: `refactor(codegen)!: …`.
- Add a line under `## Unreleased` in `CHANGELOG.md` for anything users would notice.

## Releases

Changes collect under `## Unreleased` at the top of `CHANGELOG.md` until a release. To release a version, say `5.1.0`:

1. Make the release its own last commit, `chore(release): 5.1.0`, which only bumps `version` in `package.json` and renames `## Unreleased` to `## 5.1.0`.
2. Once that commit is on `main`, tag it `v5.1.0` (`git tag v5.1.0`) and push the tag. Tag the commit on `main` itself, as a rebase or squash merge gives it a new hash.
3. Create a GitHub release from the tag. The `publish` workflow checks, builds and publishes it to npm.

New endpoints go out in minor releases. Renamed or removed methods need a major release, even when the change came from ClickUp.
