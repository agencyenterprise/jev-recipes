# Changelog

## Unreleased

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
