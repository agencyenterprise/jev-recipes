# Contributing

Keep each recipe focused on one bounded decision and the shared layer small. Prefer a direct function over a new framework or abstraction. Describe larger applications in the README's Cool projects section and keep their orchestration in examples/.

## Work in the repository

Use Node.js 22.9 or newer. After cloning the repository:

```sh
npm ci
npm run build
npm run jev-recipes -- list
```

`npm run jev-recipes -- <command>` runs the locally built CLI and loads `.env` when present. Rebuild after source changes. To run a saved demo, use `npm run jev-recipes -- demo rerank`. The installed package's CLI is documented in the [README](README.md).

`npm test` runs the recipe suite. `npm run test:coverage` adds coverage checks and an HTML report at `coverage/index.html`. Tests use mocked responses and require no API key.

`npm run build` compiles TypeScript modules and declarations into `dist/`. `npm pack` creates the installable archive; see [RELEASING.md](RELEASING.md) for distribution steps.

```text
recipes/<name>/   Individual recipes
src/             Shared client, validation, schemas, and exports
catalog/         Recipe discovery and registrations
cli/             Command-line runner
examples/        Workflows that combine recipes
tests/recipe/    Recipe tests and shared test helpers
```

## Add a recipe

1. Create `recipes/<name>/` with `index.ts`, `schema.ts`, `metadata.ts`, `demo.json`, and `README.md`.
2. Define inputs and results with Zod 4 in `schema.ts`; derive types with `z.infer`. Keep decision defaults in the recipe function. Validate inputs before calling Jev. Put prompts and recipe-specific policy in that folder.
3. Use `src/client.ts` for inference and `src/answers.ts` to validate answers. Accept `RecipeOptions` so callers can supply a client.
4. Return data. Leave side effects to the caller. Represent uncertainty separately from network or response errors.
5. Export the function and types from `src/index.ts`; add its subpath to `package.json` and register its metadata, schemas, and runner in the appropriate `catalog/groups/` file. Add a new group to `catalog/recipes.ts` only when needed.
6. Keep metadata specific: describe what the decision means, searchable tags, and limits. The catalog and CLI discover registered recipes automatically. Put application composition in `examples/`. Reuse shared choice, candidate-selection, or item-check helpers when they fit. A recipe may call another recipe through its public function; name that dependency in its README and metadata `uses` list, document the combined behavior and request count, and avoid circular dependencies. Recipes must not import the catalog or CLI.
7. Add `tests/recipe/<name>.test.ts` with fixed expected outcomes, confidence boundaries, invalid inputs, and malformed responses. Reuse a small test helper when the recipe follows an existing decision pattern; write focused cases for recipe-specific behavior. Run `npm test` and `npm run test:coverage`.
8. Update `recipes/README.md`, the root README group counts, package exports, and the changelog. Format with `npm run format` and compile with `npm run build`. Follow [RELEASING.md](RELEASING.md) for manual distribution steps.

Each demo is hand-authored and clearly labeled. Live results and accuracy claims require a separate, reproducible evaluation with the model version and dataset documented. Do not present fixtures as evidence of model quality.

Do not commit API keys, private inputs, generated `dist/`, or `node_modules/`. Keep dependencies deliberate. The official Jev SDK and Zod 4 are the runtime dependencies.

All source code is TypeScript with strict checking, two-space indentation, single quotes, and semicolons.

Write code in the order someone would explain the operation. Put the main flow first and supporting functions below it. Use descriptive names for each step. Refactor unclear code instead of adding explanatory comments. Keep types beside their schemas; do not add separate type files.

Recipe tests belong in `tests/recipe/`, with shared test helpers in `tests/recipe/helpers/`. Use the public recipe functions with an injected mock Jev client. Keep expected verdicts and outcomes explicit in the tests; do not derive them from the implementation under test. The suite blocks SDK inference and fetch calls so tests cannot use live credentials or API quota.

Run `npm run typecheck` to check source and test types. `npm run test:coverage` enforces at least 95% line, statement, and function coverage and 90% branch coverage for each recipe implementation and schema file. Coverage excludes metadata and code outside `recipes/`. See [the recipe testing guide](tests/recipe/README.md). Keep tests inside the repository and keep hand-authored examples clearly labeled. Live API calls require a separate explicit request.
