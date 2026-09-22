# Changelog

## Unreleased

- Unify recipe execution helpers, result validation, subject registration, and documentation across the catalog.

- Expand the catalog to 66 focused recipes across answer quality, retrieval, conversation, tools, support, memory, and knowledge maintenance.
- Add shared choice, candidate-selection, and item-check helpers; keep recipe criteria and schemas in their own folders.
- Register every new recipe for root and subpath imports, discovery, CLI input examples, and offline demos.
- Document the complete catalog, explicit internal reuse, and Cool projects that compose small decisions.

- Add independent `answerability`, `clarify`, and `handoff` recipes with Zod schemas, inferred types, documentation, and offline fixtures.
- Add recipe-owned metadata, a searchable catalog, and CLI `describe` with JSON schemas and example input.
- Add `demo all` and a support-assistant example that composes six recipes, accepts an application draft callback, and verifies claims against selected evidence.
- Extend package exports and release checks without adding dependencies.

## 0.0.1

- Initial foundation with route, rerank, and verify recipes.
- TypeScript library with Zod schemas and inferred types.
- CLI with offline demos, editable example input, and live Jev calls.
- Build, formatting, and package checks for manual npm releases.
