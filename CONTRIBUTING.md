# Contributing

Keep each recipe focused on one bounded decision. Prefer a direct function and the existing shared helpers. Applications compose recipes in their own code.

The goal is 1,000 useful, distinct recipes. Before adding one, name its target user, bounded question, minimal input, output, and nearest existing alternative. Explain what new decision it provides. Avoid aliases, domain substitutions, deterministic checks better handled in code, and decisions already covered by composition. Add small reviewed batches based on actual use and missing decisions, rather than category quotas.

## Everyday commands

Requires Node.js 22.9 or newer. Make is optional; every task has an npm equivalent. The Makefile works with GNU Make 3.81 and newer and is only for contributors.

| Task                               | Make                                   | npm equivalent                                       |
| ---------------------------------- | -------------------------------------- | ---------------------------------------------------- |
| Install development dependencies   | `make setup`                           | `npm ci --ignore-scripts`                            |
| Generate exports and catalog data  | `make generate`                        | `npm run generate`                                   |
| Generate code and documentation    | `make docs`                            | `npm run docs`                                       |
| Run offline tests                  | `make test`                            | `npm test`                                           |
| Test one recipe                    | `make test RECIPE=route`               | `npm run test:recipes -- tests/recipe/route.test.ts` |
| Run the full verification pipeline | `make ci`                              | `npm run ci`                                         |
| Check the installable archive      | `make pack-check`                      | `npm run pack:check`                                 |
| Scaffold a recipe                  | `make new RECIPE=my-recipe`            | `npm run new -- my-recipe`                           |
| Scaffold a score or gate recipe    | `make new RECIPE=my-recipe KIND=score` | `npm run new -- my-recipe gate`                      |
| Scaffold from a spec file          | `npm run new -- --spec spec.json`      | `node scripts/new-recipe.mjs --spec a.json b.json`   |
| Compile or clean                   | `make build` / `make clean`            | `npm run build` / `npm run clean`                    |

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

1. Run `make new RECIPE=my-recipe`, adding `KIND=score` for an ordered rubric, `KIND=gate` for a yes/no question, `KIND=comparison` for a first/second/tie/neither choice between two candidates, or `KIND=labels` for several independent yes/no labels in one call. The default kind is `choice`. This creates the five recipe files and `tests/recipe/my-recipe.test.ts`, wired to the matching shared helper and test helper. The starter is a generic requirement check; replace it with the intended decision before contributing it.
2. Define inputs and results in `schema.ts` using Zod. Infer types from those schemas. Keep defaults, instructions, and decision rules in `index.ts`.
3. Export one recipe function, one schema whose name ends in `InputSchema`, and one ending in `ResultSchema` from `index.ts`. Export its public types there too. Keep kebab-case recipe IDs and camelCase functions.
4. Complete `metadata.ts`, `demo.json`, and the author-maintained parts of `README.md`.
5. Add tests for the actual decision rules, confidence boundaries, invalid inputs, and malformed responses. Use the existing helpers where appropriate. Starter tests are not a complete contribution test suite.
6. Run `make docs`. Exports, catalog registration, schema descriptions, reference tables, and counts are generated automatically.
7. Run `make ci` and inspect the changes.

### Spec-driven scaffolding

When you already know the decision, write it as a JSON spec and run `node scripts/new-recipe.mjs --spec my-recipe.json`. The spec carries the metadata, input names (`required` or `optional`), the instruction, the kind-specific criteria (a `rubric` with `labelField` for score, `verdicts` and `criteria` for gate, `criteria` for choice and comparison, `labels` for labels), a demo input, and demo probabilities. The scaffolder validates the spec, computes the demo fixture arithmetic, and renders all five recipe files plus the test file in the house style, so only the guide prose may need editing. It rejects a demo whose most likely outcome is below 0.8, since that fixture would render as a review result in the guide. Choice and comparison demo probabilities may omit labels, which default to zero. `readme.limits` accepts a string or an array of sentences. The schema lives in `recipeSpecSchema` in [scripts/new-recipe.mjs](scripts/new-recipe.mjs); `tests/tooling/spec.test.mjs` shows a complete example. Spec files are authoring input, not part of the recipe; do not commit them.

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

Generation also rejects near-duplicate recipes: two recipes whose title, description, and `useWhen` wording overlap heavily, or that share identical input fields and outcome labels with noticeably similar wording. Sharpen the description toward the specific decision, or merge the recipes. The thresholds live in [scripts/lib/distinct.mjs](scripts/lib/distinct.mjs).

`useWhen` and `related` are required by the authoring checks. They are optional in the public metadata schema to keep older metadata objects valid. References must resolve, dependencies must match imports, and dependency cycles are rejected. Related recipes are navigation links, not execution dependencies.

Import paths, function names, schemas, example input, and counts are derived from source. Do not duplicate them in metadata. The current categories are `retrieval`, `conversation`, `workflow`, `answer-quality`, `support`, `memory`, and `knowledge`; use tags for narrower topics.

The generated catalog also includes tag-driven collections: Psychology & behavior (`psychology` tag) and Music & sound (`music` tag). Add the tag to a relevant recipe's metadata to include it; keep its existing category. Collection membership does not create another recipe or change import paths. Collections are defined in [scripts/lib/docs.mjs](scripts/lib/docs.mjs).

## Dependencies and behavior

Recipes use shared helpers under `src/` and may call another recipe through its public `index.js` export. Declare that reuse in `uses` and explain it in the guide. Recipes and shared helpers must not import the catalog, CLI, or root barrel. Keep side effects in the caller.

Accept `RecipeOptions` for an injected client, model, or abort signal. Validate inputs before inference. Return uncertainty as a review outcome and throw for invalid data or provider failures. Preserve model and usage information.

The catalog loads metadata only. `describeRecipe` reads one generated schema description synchronously. The CLI loads a selected execution module only for `run` or `demo`. Root imports remain compatible and export every recipe; direct imports are the lean execution path.

## Documentation

Keep each fact in one place: setup in the root README, contributor workflows here, decision behavior in the recipe guide, and example setup beside the example. Generate inventories, input tables, and usage examples from recipe source. Keep authored text for unique behavior and decision boundaries. Track future work in issues or discussions rather than adding separate planning or progress documents.

## Tests and demos

Recipe tests use mocked Jev responses. Generation validates and runs hand-authored demo responses with an injected fixture client. Neither measures live model accuracy. Tests must not load `.env` or use API quota. Live API calls require a separate explicit request.

Each recipe's test file owns its inputs and expected results, independently of packaged demo fixtures. Reuse [shared test helpers](tests/recipe/helpers/) for contracts; add focused cases for behavior specific to a recipe. Cover invalid inputs, malformed responses, provider errors, confidence boundaries, and caller ID mapping where relevant. Avoid reproducing the implementation inside a test helper.

Use `npm run test:watch` while editing or `npm run test:coverage` for coverage reports. [vitest.config.ts](vitest.config.ts) owns the coverage scope and per-file thresholds; the HTML report is written to `coverage/index.html`. Separate tooling tests cover generation, discovery, import boundaries, CLI commands, packaging, and a synthetic 1,000-entry catalog. For research evaluation on real inputs, follow the [evaluator validation guide](docs/ai-alignment-research.md).

Do not commit API keys, private inputs, generated `dist/`, coverage, archives, or `node_modules`. Commit generated source and documentation so reviewers can inspect them and CI can detect drift.

## Releasing

Publishing is manual. The [`files` allowlist](package.json) and [archive checks](scripts/lib/package.mjs) define what ships. `make pack-check` installs the actual archive in a separate project and verifies every recipe import, root export, declaration, schema, and offline CLI command. It reports archive size and rejects development files, tests, and examples. Detailed recipe guides remain on GitHub.

The package check packs installed runtime dependencies for offline installation. When adding transitive dependencies, extend [the offline consumer setup](scripts/pack-check.mjs) to supply their archives too.

1. Review the release diff, including any breaking changes. Run `make setup`, `make docs`, `npm run format`, and `make ci`; commit the reviewed changes.
2. From the intended clean checkout, choose an unused version with `npm version patch`, `npm version minor`, or `npm version major`. Let CI pass for that version.
3. Verify the npm account, inspect the dry run, and publish from the checked repository directory:

   ```sh
   npm login
   npm whoami
   npm publish --dry-run
   npm publish
   npm view jev-recipes version
   ```

4. After publishing succeeds, push the version commit and tag, then create a GitHub release.

`prepublishOnly` runs full CI; `prepack` checks generated files and builds. Publishing a previously packed archive does not rerun the checkout's checks. These hooks use npm directly; Make is optional.
