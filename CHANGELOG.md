# Changelog

## Unreleased

- Add `take-turn` and `choose-action` for narrative turn eligibility and game action recommendations, with optional ordered player history, offline tests, and a gameplay composition guide. The source catalog now contains 80 recipes.
- Clarify that `.mjs` is a standalone Node quickstart option; existing JavaScript ES module and TypeScript projects can use their normal file types and start commands.

- Add six annotation recipes: `response-refusal`, `uncertainty-expression`, `evaluation-mention`, `attribution-match`, `question-leading`, and `evidence-independence`, bringing the source catalog to 78 recipes.
- Document their decision boundaries and research limitations; add offline contract, review-policy, discovery, and package checks without new runtime dependencies.
- Fix the package checker to accept both legacy npm archive reports and the npm 12 object format, including dependency archives.

- Add six focused recipes: `instruction-conflict`, `task-dependency`, `task-duplicate`, `constraint-strength`, `requirement-testability`, and `claim-stance`.
- Add a catalog growth roadmap, an AI alignment research protocol, research discovery tags, and an offline first-use command in the README.

- Generate exports, catalog data, schema descriptions, and documentation from recipe folders; add authoring checks and a recipe scaffold.
- Add usage guidance and related recipes to the catalog, ranked search, optional search limits, and lazy recipe loading.
- Add Make commands and offline tooling checks, including a 1,000-entry capacity exercise and installation of the actual npm archive.
- Move published offline demo assets under `dist/recipes/` so npm does not automatically include source recipe guides.
- Keep recipe tests under `tests/recipe/`; enforce an npm content allowlist and exclude development files and source guides.
- Remove the standalone support example and its build, CI, and publishing references.

- Document installed-package imports and CLI commands first; move repository setup into the contributor guide and rename the local CLI script to `jev-recipes`.

- Add recipe tests under `tests/recipe/`, mocked Jev responses, recipe coverage reports and thresholds, and test checks in CI.

- Unify recipe execution helpers, result validation, subject registration, and documentation across the catalog.

- Expand the catalog to 66 focused recipes across answer quality, retrieval, conversation, tools, support, memory, and knowledge maintenance.
- Add shared choice, candidate-selection, and item-check helpers; keep recipe criteria and schemas in their own folders.
- Register every new recipe for root and subpath imports, discovery, CLI input examples, and offline demos.
- Document the complete catalog, explicit internal reuse, and Cool projects that compose small decisions.

- Add independent `answerability`, `clarify`, and `handoff` recipes with Zod schemas, inferred types, documentation, and offline fixtures.
- Add recipe-owned metadata, a searchable catalog, and CLI `describe` with JSON schemas and example input.
- Add `demo all` for offline recipe illustrations.
- Extend package exports and release checks without adding dependencies.

## 0.0.1

- Initial foundation with route, rerank, and verify recipes.
- TypeScript library with Zod schemas and inferred types.
- CLI with offline demos, editable example input, and live Jev calls.
- Build, formatting, and package checks for manual npm releases.
