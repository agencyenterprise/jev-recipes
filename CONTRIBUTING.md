# Contributing

Keep recipes independent and the shared layer small. Prefer a direct function over a new framework or abstraction.

## Add a recipe

1. Create `recipes/<name>/` with `index.ts`, `schema.ts`, `demo.json`, and `README.md`.
2. Define inputs and results with Zod 4 in `schema.ts`; derive types with `z.infer`. Keep decision defaults in the recipe function. Validate inputs before calling Jev. Put prompts and recipe-specific policy in that folder.
3. Use `src/client.ts` for inference and `src/answers.ts` to validate answers. Accept `RecipeOptions` so callers can supply a client.
4. Return data. Leave side effects to the caller. Represent uncertainty separately from network or response errors.
5. Export the function and types from `src/index.ts`; add its subpath to `package.json` and register it in `cli/recipes.ts`.
6. Run `npm run format`, `npm run ci`, and `npm run pack:check`. Follow [RELEASING.md](RELEASING.md) to try a packed installation.

Each demo is hand-authored and clearly labeled. Live results and accuracy claims require a separate, reproducible evaluation with the model version and dataset documented. Do not present fixtures as evidence of model quality.

Do not commit API keys, private inputs, generated `dist/`, or `node_modules/`. Keep dependencies deliberate. The official Jev SDK and Zod 4 are the runtime dependencies.

All source code is TypeScript with strict checking, two-space indentation, single quotes, and semicolons.

Write code in the order someone would explain the operation. Put the main flow first and supporting functions below it. Use descriptive names for each step. Refactor unclear code instead of adding explanatory comments. Keep types beside their schemas; do not add separate type files.
