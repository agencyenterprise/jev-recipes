# Contributing

Keep each recipe focused on one bounded decision. Prefer a direct function and the existing shared helpers. Applications compose recipes in their own code.

The goal is 1,000 useful, distinct recipes. Before adding one, name its target user, bounded question, minimal input, output, and nearest existing alternative. Explain what new decision it provides. Avoid aliases, domain substitutions, deterministic checks better handled in code, and decisions already covered by composition. Add small reviewed batches based on actual use and missing decisions, rather than category quotas.

## Everyday commands

Requires Node.js 22.9 or newer. Make is optional; every task has an npm equivalent. The Makefile works with GNU Make 3.81 and newer and is only for contributors.

| Task                               | Make                                   | npm equivalent                                                                          |
| ---------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------- |
| Install development dependencies   | `make setup`                           | `npm ci --ignore-scripts` + `npm ci --ignore-scripts --prefix examples/support-routing` |
| Generate exports and catalog data  | `make generate`                        | `npm run generate`                                                                      |
| Generate code and documentation    | `make docs`                            | `npm run docs`                                                                          |
| Run offline tests                  | `make test`                            | `npm test`                                                                              |
| Test one recipe                    | `make test RECIPE=route`               | `npm run test:recipes -- tests/recipe/route.test.ts`                                    |
| Run the full verification pipeline | `make ci`                              | `npm run ci`                                                                            |
| Check the installable archive      | `make pack-check`                      | `npm run pack:check`                                                                    |
| Scaffold a recipe                  | `make new RECIPE=my-recipe`            | `npm run new -- my-recipe`                                                              |
| Scaffold a score or gate recipe    | `make new RECIPE=my-recipe KIND=score` | `npm run new -- my-recipe gate`                                                         |
| Scaffold from a spec file          | `npm run new -- --spec spec.json`      | `node scripts/new-recipe.mjs --spec a.json b.json`                                      |
| Compile or clean                   | `make build` / `make clean`            | `npm run build` / `npm run clean`                                                       |

The support starter has its own locked dependencies and tests against its installed package. `make setup` installs both dependency sets. The archive check also runs its conversation tests against the package being built.

`make ci` checks generated files without changing them, checks formatting and types, runs recipe coverage, builds, tests the tooling, and tests the actual npm archive. It makes no live Jev calls. Fix stale generated files with `make docs`; format author-maintained files with `npm run format`.

## Your first contribution

You can help without adding a recipe. [Ask a usage question](https://github.com/agencyenterprise/jev-recipes/issues/new?template=usage-question.yml) if you are unsure where to start. An issue is useful context, but small corrections do not need one first.

| Contribution                              | Start here                                                                           | Focused check                                                                                                                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Correct an explanation or example command | The README or guide containing the problem; keep generated sections intact           | Run the documented offline command if it changed, then `npm run format:check`                                                                                                           |
| Add a regression case                     | The existing `tests/recipe/<name>.test.ts` or relevant `tests/tooling/*.test.mjs`    | `npm run test:recipes -- tests/recipe/route.test.ts` for a recipe, or `npm run build` followed by `node --test tests/tooling/cli-input.test.mjs` for the CLI; substitute your test file |
| Improve a runnable example                | Its README and the [example contribution guide](examples/README.md#add-your-project) | Run that example's documented offline command and its existing focused tests                                                                                                            |
| Add a new decision                        | [Add a recipe](#add-a-recipe) and the existing scaffolder                            | Generate docs, run the recipe's focused tests, then `npm run ci`                                                                                                                        |

1. Set up the checkout with the install commands in [Everyday commands](#everyday-commands). Run `npm run build` before examples or tooling tests that use `dist/`.
2. Keep the change focused. For a regression, make the test demonstrate the reported problem before changing implementation. A sanitized [standalone reproduction](examples/reproduction/README.md) is a useful starting point.
3. Run the focused check above. Use `npm exec -- prettier --write path/to/changed-file` to format your authored files. If recipe source or generated documentation changed, run `npm run docs` and include its output.
4. Before submitting code changes, run `npm run ci`. For a prose-only correction, report the formatting check and any example command you verified; do not claim checks you did not run.
5. In the pull-request template, explain the problem, resulting behavior, and commands you checked. Include compatibility implications if relevant. Do not include credentials or private inputs.

Offline fixtures test software behavior. A valid but unexpected model decision belongs in the [model-decision form](https://github.com/agencyenterprise/jev-recipes/issues/new?template=model-decision.yml), with a sanitized case and the reasoning for the expected answer. You do not need a paid live call to contribute a report or regression case.

## Consumer compatibility checks

The existing full verification pipeline runs on Ubuntu with Node 22 and 24. Separate consumer jobs build one npm archive and install it into fresh projects on Linux at the declared minimum Node version, Windows with Node 24, and macOS with Node 24. These focused jobs cover a direct import, the offline reproduction, CLI version/demo commands, and international input via files and stdin in UTF-8 and UTF-16. They do not establish support for every framework or runtime combination.

To run the same consumer check locally after building:

```sh
npm pack --ignore-scripts
npm run check:consumer -- jev-recipes-<version>.tgz
```

Replace `<version>` with the archive name printed by npm. This check downloads runtime dependencies from npm into a temporary project, then runs offline. It removes the temporary project when finished. The existing `npm run pack:check` remains the broader, offline archive check.

The standalone reproduction has its own lockfile. CI checks it against its pinned release and the latest published release, as well as replaying its source against the new archive in the consumer jobs. Its pin is intentional: bug reports must be repeatable. To change the example's baseline, install an explicitly selected published version with `--save-exact` in that folder and review both package files.

```sh
npm run check:reproduction -- pinned
npm run check:reproduction -- latest
```

Both commands copy the example outside the checkout, install from npm, verify its result without a model call, and clean up. The latest check changes only the temporary copy. A CI failure signals that the example or package needs attention; CI never silently rewrites its pinned version.

## Repository structure

```text
recipes/<name>/  Code, schemas, metadata, demo, and guide for one recipe
src/            Shared client and decision helpers; generated root exports
catalog/        Metadata search, synchronous descriptions, and lazy execution
catalog/generated/  Generated names, metadata, loaders, and schema descriptions
cli/            Command-line interface
adapters/       Framework adapters for the Vercel AI SDK and LangChain.js
scripts/        Generation, scaffolding, documentation, and package checks
tests/recipe/  Existing recipe tests and shared helpers
tests/adapters/ Framework adapter tests with mocked Jev responses
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

The generated catalog also includes tag-driven collections: Agent harness (`harness` tag), Psychology & behavior (`psychology` tag), and Music & sound (`music` tag). Add the tag to a relevant recipe's metadata to include it; keep its existing category. Collection membership does not create another recipe or change import paths. Collections are defined in [scripts/lib/docs.mjs](scripts/lib/docs.mjs).

## Dependencies and behavior

Recipes use shared helpers under `src/` and may call another recipe through its public `index.js` export. `src/fanout.ts` carries a choice question plus independent labels in one request; `src/batch.ts` splits a list of inputs into chunks, runs one request per chunk concurrently, and merges the results. Prefer these over separate calls when the extra questions share one state, since Jev answers every question in a request in parallel. Declare that reuse in `uses` and explain it in the guide. Recipes and shared helpers must not import the catalog, CLI, or root barrel. Keep side effects in the caller.

Adapters under `adapters/` may import the catalog and recipes, but recipes must not import adapters. `ai` and `@langchain/core` are optional peer dependencies: keep them out of `dependencies`, import them only inside their adapter module, and add a matching development dependency for tests. The package check links the development copies of peer packages into its consumer project, since a consumer supplies them.

Accept `RecipeOptions` for an injected client, model, or abort signal. Validate inputs before inference. Return uncertainty as a review outcome and throw for invalid data or provider failures. Preserve model and usage information.

The catalog loads metadata only. `describeRecipe` reads one generated schema description synchronously. The CLI loads a selected execution module only for `run` or `demo`. Root imports remain compatible and export every recipe; direct imports are the lean execution path.

## Documentation

Keep each fact in one place: setup in the root README, contributor workflows here, decision behavior in the recipe guide, and example setup beside the example. Generate inventories, input tables, and usage examples from recipe source. Keep authored text for unique behavior and decision boundaries. Track future work in issues or discussions rather than adding separate planning or progress documents.

## Tests and demos

Recipe tests use mocked Jev responses. Generation validates and runs hand-authored demo responses with an injected fixture client. Neither measures live model accuracy. Tests must not load `.env` or use API quota. Live API calls require a separate explicit request.

Each recipe's test file owns its inputs and expected results, independently of packaged demo fixtures. Reuse [shared test helpers](tests/recipe/helpers/) for contracts; add focused cases for behavior specific to a recipe. Cover invalid inputs, malformed responses, provider errors, confidence boundaries, and caller ID mapping where relevant. Avoid reproducing the implementation inside a test helper.

Use `npm run test:watch` while editing or `npm run test:coverage` for coverage reports. [vitest.config.ts](vitest.config.ts) owns the coverage scope and per-file thresholds; the HTML report is written to `coverage/index.html`. Separate tooling tests cover generation, discovery, import boundaries, CLI commands, packaging, and a synthetic 1,000-entry catalog. For research evaluation on real inputs, follow the [evaluator validation guide](docs/ai-alignment-research.md).

Do not commit API keys, private inputs, generated `dist/`, coverage, archives, or `node_modules`. Commit generated source and documentation so reviewers can inspect them and CI can detect drift.

## Model evaluation

Offline tests prove software behavior, not accuracy. Golden datasets under `evals/<recipe>/cases.jsonl` measure a recipe against the live model. Each line is one case:

```json
{
  "id": "double-charge-refund",
  "input": { "request": "...", "routes": { "billing": "..." } },
  "expected": { "suggestedRoute": "billing" },
  "rationale": "A duplicate charge is a payments issue.",
  "contested": false,
  "adversarial": false
}
```

`expected` names result fields by dotted path (`items.0.verdict`, `checks`) and must avoid confidence-gated fields such as `status`, `route`, or `drop`; use the ungated twin such as `suggestedRoute` or a per-item `verdict`. Mark `contested` cases where reasonable annotators could disagree and `adversarial` cases whose wording is engineered to push the wrong answer; the report breaks accuracy out for both.

| Task                                     | Command                              |
| ---------------------------------------- | ------------------------------------ |
| Validate every dataset offline           | `npm run eval:validate`              |
| Evaluate one recipe and update its guide | `npm run eval -- route`              |
| Evaluate everything and update guides    | `npm run eval`                       |
| Evaluate without changing files          | `npm run eval -- --no-write`         |
| Check featured development baselines     | `npm run eval -- --featured --check` |
| Smoke-test every demo against the model  | `npm run eval:smoke`                 |

Live runs need `TYPESAFE_API_KEY` in `.env` or the environment and spend quota. Each normal run retains a compressed source archive under `evals/evidence/<recipe>/development-<run-id>/`, saves a development baseline in `evals/baselines/<recipe>.json`, updates `evals/results/<recipe>.json`, and refreshes the measured-accuracy section in that recipe's guide. Commit the source archive alongside the report and guide; CI verifies their consistency. `--check` uses the baseline's model and policy, and fails if accuracy drops by more than five percentage points. It validates all selected baselines before making calls and leaves held-out reports unchanged. Use `npm run eval -- route --check` for a single recipe. `--no-write` prints a summary without saving. The existing `--write` flag also saves results and updates guides.

The console summary reports accuracy and a suggested confidence threshold. Saved reports include calibration by confidence band, defer rates and ready-result accuracy at each `minConfidence`, and a confusion table. Threshold calculations replay the recorded responses through the recipe's review policy without additional model calls. Commit the snapshots and updated guides so reviewers can inspect the measurements.

For calibration, the harness uses a top-level confidence when present, otherwise the minimum confidence over the items named in `expected`. Readiness comes from the recipe's actual policy, including mandatory review and batch behavior. A recipe without a `minConfidence` input has no confidence-threshold table.

Add a labeled dataset with any recipe meant for production use. Choose a confidence policy on development cases and measure it separately on held-out cases. No fixed sample count guarantees readiness; record label provenance, rare outcomes, uncertainty, and the policy's observed errors. See [evaluation guidance](docs/evaluation.md).

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

4. After publishing succeeds, push the version commit and tag, then create a GitHub release. Summarize user-visible changes and any compatibility or migration steps in the release notes, including changes to recipe inputs, outputs, confidence behavior, or supported runtimes. State explicitly when no migration is needed. Run `npm run check:reproduction -- latest` to verify the example against the published package.

`prepublishOnly` runs full CI; `prepack` checks generated files and builds. Publishing a previously packed archive does not rerun the checkout's checks. These hooks use npm directly; Make is optional.

## Readable changes

Write the main function in execution order: validate inputs, prepare the question, request the judgment, apply the review policy, and return the result. Use names that state the operation or fact. Prefer explicit branches and guard clauses over deeply nested expressions. Extract helpers for meaningful reusable operations rather than one-line indirections. If a comment is needed to explain what code does, improve its names and structure first; keep contract rationale in the guide.

Complete each small change with its schemas, runnable example, documentation, and meaningful behavior tests. Keep fixture correctness, recorded replay, and live accuracy separate. When held-out errors influence an edit, move those cases into regression/development evidence and reserve new families before making the next accuracy claim. Preserve weak results and experimental labels.

## Share applications and record adoption

Built a project with Jev? Contribute a runnable example or a walkthrough of your deployed app under `examples/<project-name>/`. The [example contribution guide](examples/README.md#add-your-project) explains what to include. Hosting and ongoing app maintenance stay with the project author.

Use the [integration issue form](https://github.com/agencyenterprise/jev-recipes/issues/new?template=share-integration.yml) to share a public app or source example. Include the imported recipes, observed package version, and relationship to this project. Describe review and failure behavior; do not post credentials or private inputs. Maintainer-built examples and independent integrations are recorded separately.

The [adoption evidence guide](docs/adoption.md) explains the manual public-signal collector and its limits. The [coding-assistant guide](docs/coding-assistants.md) describes the repository skill; it is separate from the npm package. Keep showcase claims tied to observed behavior or supplied source, and distinguish offline tests from live model quality.
