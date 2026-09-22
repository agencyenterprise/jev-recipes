# Recipe tests

Every recipe has a matching TypeScript test file in this directory. Run from the repository root:

```sh
make test
npm run test:watch
npm run test:coverage
make test RECIPE=route
# Without Make:
npm run test:recipes -- tests/recipe/route.test.ts
```

The suite calls recipe functions with a mock Jev client. Shared decision handling and response validation run normally. Tests block the SDK inference method and global fetch, do not load .env, and require no API key.

## What the tests cover

- Valid verdicts, confidence boundaries, custom thresholds, and review decisions.
- Input validation before a Jev request, including blank text, duplicate IDs, and list limits.
- Malformed responses and provider failures.
- Mapping internal choices back to caller IDs, ranking, filtering, and batch results.
- Citation matching through the real verify recipe, including mixed-confidence evidence.
- Forwarding model choices, abort signals, and request data.

These tests verify how recipes handle supplied decisions. They do not evaluate whether Jev chooses the right verdict for real text. That requires a separate labeled dataset and live model evaluation.

## Structure

Each recipe owns its input fixture and fixed expected verdicts in its test file. Fixtures are independent of the packaged demos. Helpers in helpers/ share assertions for classification, candidate selection, batch checks, and input validation. Recipe-specific cases stay in that recipe's test file.

Add a focused case when behavior differs from a shared helper. Avoid teaching a helper to reproduce a recipe's implementation. Keep types inferred from existing schemas and function signatures.

## Coverage

Coverage includes `recipes/*/index.ts` and `recipes/*/schema.ts`, including files that no test imports. Metadata, shared source, the catalog, and the CLI are outside this report's scope. Separate offline tests in `tests/tooling/` cover generation, discovery, import boundaries, CLI commands, package rules, and a 1,000-entry catalog.

Each included file must meet 95% line, statement, and function coverage and 90% branch coverage. Reports are written to coverage/ as a terminal summary, an HTML report at coverage/index.html, and coverage-summary.json. Generated reports are ignored by Git and excluded from the npm package.

npm run typecheck checks both production and test TypeScript. npm run ci includes recipe coverage checks. Tests and their configuration are excluded from the production build.

`make test` (or `npm test`) runs the recipe suite and builds before running the tooling tests. `make ci` also verifies generated files, formatting, types, coverage, and installation of the actual npm archive. The archive check rejects test files even if a publishing rule accidentally includes them.

Vitest 4 and Vite 6 keep the test tooling compatible with the package's Node.js 22.9 minimum. They are development dependencies only.
