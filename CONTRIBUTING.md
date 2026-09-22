# Contributing

Keep each recipe focused on one bounded decision. Prefer a direct function and the existing shared helpers. Applications compose recipes in their own code.

The [recipe roadmap](RECIPE_ROADMAP.md) records the current gap review and adoption experiments. Before adding a recipe, identify its nearest existing alternative and explain the distinct decision. The [AI alignment research guide](docs/ai-alignment-research.md) separates behavioral annotation from claims that require an experiment.

## Everyday commands

Requires Node.js 22.9 or newer. Make is optional; every task has an npm equivalent. The Makefile works with GNU Make 3.81 and newer and is only for contributors.

| Task                               | Make                        | npm equivalent                                       |
| ---------------------------------- | --------------------------- | ---------------------------------------------------- |
| Install development dependencies   | `make setup`                | `npm ci --ignore-scripts`                            |
| Generate exports and catalog data  | `make generate`             | `npm run generate`                                   |
| Generate code and documentation    | `make docs`                 | `npm run docs`                                       |
| Run offline tests                  | `make test`                 | `npm test`                                           |
| Test one recipe                    | `make test RECIPE=route`    | `npm run test:recipes -- tests/recipe/route.test.ts` |
| Run the full verification pipeline | `make ci`                   | `npm run ci`                                         |
| Check the installable archive      | `make pack-check`           | `npm run pack:check`                                 |
| Scaffold a recipe                  | `make new RECIPE=my-recipe` | `npm run new -- my-recipe`                           |
| Compile or clean                   | `make build` / `make clean` | `npm run build` / `npm run clean`                    |

`make ci` checks generated files without changing them, checks formatting and types, runs recipe coverage, builds, tests the tooling, and tests the actual npm archive. It makes no live Jev calls. Fix stale generated files with `make docs`; format author-maintained files with `npm run format`.

## Repository structure

```text
recipes/<name>/  Code, schemas, metadata, demo, and guide for one recipe
src/            Shared client and decision helpers; generated root exports
catalog/        Metadata search, synchronous descriptions, and lazy execution
catalog/generated/  Generated names, metadata, loaders, and schema descriptions
cli/            Command-line interface
scripts/        Generation, scaffolding, documentation, and package checks
tests/recipe/  Existing recipe tests and shared helpers
tests/tooling/ Catalog, generation, CLI, scale, and packaging tests
```

Tests remain outside recipe folders. Production builds exclude tests, and package checks reject them in the archive.

## Add a recipe

1. Run `make new RECIPE=my-recipe`. This creates the five recipe files and `tests/recipe/my-recipe.test.ts`. The starter is a generic requirement check; replace it with the intended decision before contributing it.
2. Define inputs and results in `schema.ts` using Zod. Infer types from those schemas. Keep defaults, instructions, and decision rules in `index.ts`.
3. Export one recipe function, one schema whose name ends in `InputSchema`, and one ending in `ResultSchema` from `index.ts`. Export its public types there too. Keep kebab-case recipe IDs and camelCase functions.
4. Complete `metadata.ts`, `demo.json`, and the author-maintained parts of `README.md`.
5. Add tests for the actual decision rules, confidence boundaries, invalid inputs, and malformed responses. Use the existing helpers where appropriate. Starter tests are not a complete contribution test suite.
6. Run `make docs`. Exports, catalog registration, schema descriptions, reference tables, and counts are generated automatically.
7. Run `make ci`, inspect the changes, and update the changelog.

Do not hand-edit `src/index.ts`, `catalog/generated/`, the exports map in `package.json`, or documentation between generated markers. Generation is deterministic. Running it again without source changes produces no diff.

## Metadata

Keep descriptions concrete enough that a developer can choose between similar recipes.

| Field         | Authoring requirement                                                             |
| ------------- | --------------------------------------------------------------------------------- |
| `id`          | Unique kebab-case ID matching the folder name                                     |
| `title`       | Short human-readable title                                                        |
| `description` | The specific decision and its output                                              |
| `category`    | One of the existing catalog categories                                            |
| `tags`        | Useful search vocabulary, including common user wording                           |
| `useWhen`     | A short situation in which this recipe is useful                                  |
| `related`     | `{ id, reason }` alternatives explaining when to use another recipe; may be empty |
| `limitations` | What the decision does not establish                                              |
| `uses`        | IDs of recipes imported at runtime; omit when none                                |

`useWhen` and `related` are required by the authoring checks. They are optional in the public metadata schema to keep older metadata objects valid. References must resolve, dependencies must match imports, and dependency cycles are rejected. Related recipes are navigation links, not execution dependencies.

Import paths, function names, schemas, example input, and counts are derived from source. Do not duplicate them in metadata. The current categories are `retrieval`, `conversation`, `workflow`, `answer-quality`, `support`, `memory`, and `knowledge`; use tags for narrower topics.

## Dependencies and behavior

Recipes use shared helpers under `src/` and may call another recipe through its public `index.js` export. Declare that reuse in `uses` and explain it in the guide. Recipes and shared helpers must not import the catalog, CLI, or root barrel. Keep side effects in the caller.

Accept `RecipeOptions` for an injected client, model, or abort signal. Validate inputs before inference. Return uncertainty as a review outcome and throw for invalid data or provider failures. Preserve model and usage information.

The catalog loads metadata only. `describeRecipe` reads one generated schema description synchronously. The CLI loads a selected execution module only for `run` or `demo`. Root imports remain compatible and export every recipe; direct imports are the lean execution path.

## Tests, demos, and publishing

Recipe tests use mocked Jev responses. Generation validates and runs hand-authored demo responses with an injected fixture client. Neither measures live model accuracy. Tests must not load `.env` or use API quota. Live API calls require a separate explicit request.

`make pack-check` creates a real archive, rejects development files, and installs it in a temporary consumer. It checks every recipe import, root exports, declarations, schemas, and offline CLI commands. Runtime dependencies are packed from the existing installation so this check works without registry access. See [RELEASING.md](RELEASING.md).

Do not commit API keys, private inputs, generated `dist/`, coverage, archives, or `node_modules`. Commit generated source and documentation so reviewers can inspect them and CI can detect drift.
