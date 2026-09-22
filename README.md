# jev recipes

Small, composable recipes for [Jev](https://docs.typesafe.ai/introduction/coding-agents): choose a handler, rank useful passages, and check claims against evidence.

**Version 0.0.1.** A TypeScript library and a small command-line runner. Each recipe owns its implementation, Zod schemas, example, and documentation. Public data types are inferred from those schemas.

| Recipe                               | Input                          | Result                                     |
| ------------------------------------ | ------------------------------ | ------------------------------------------ |
| [`route`](recipes/route/README.md)   | A request and named handlers   | A selected handler or a review decision    |
| [`rerank`](recipes/rerank/README.md) | A query and candidate passages | Relevant passages, ordered by relevance    |
| [`verify`](recipes/verify/README.md) | Claims paired with evidence    | A verdict and review status for each claim |

## Try it locally

Requires Node.js 22.9 or newer. From this repository:

```sh
npm ci
npm run build
npm run jev -- list
npm run jev -- demo rerank
```

All three demos work without a key. Each recipe's `README.md` explains its API and limits; `demo.json` supplies executable example input and a saved response for the CLI. The demos run the recipe's validation and decision handling without calling Jev or measuring model accuracy.

```sh
npm run jev -- demo route
npm run jev -- demo verify
```

## Run your own input

Copy `.env.example` to `.env`, then set `TYPESAFE_API_KEY` from your TypeSafe account. Keep the key out of source control.

```sh
cp .env.example .env
node dist/cli/index.js example rerank > input.json
```

Edit `input.json` with your query and passages, then run:

```sh
npm run jev -- run rerank input.json
```

Use `-` in place of the filename to read JSON from stdin. The `npm run jev` script loads `.env`; direct `jev-recipes` or `node` invocations use the process environment unless you explicitly load an env file. Use the direct command when piping JSON so npm's script banner is not included:

```sh
node --env-file-if-exists=.env dist/cli/index.js run rerank input.json
```

Live runs send the recipe's input to TypeSafe and consume API quota. Jev performs inference remotely; the recipe's filtering and review rules run in your process. This project does not store inputs or add telemetry.

## Use from an app

The package exposes the same functions used by the command-line runner. In this checkout, package self-references work after `npm run build`:

```ts
import { rerank } from 'jev-recipes';

const result = await rerank({
  query: 'How do I reset my password?',
  items: [
    { id: 'billing', text: 'Invoices appear on the Billing page.' },
    { id: 'reset', text: 'Select Forgot password to receive a reset link.' },
  ],
  topK: 1,
});

console.log(result.status, result.items);
```

Individual recipe imports are also available:

```ts
import { route } from 'jev-recipes/route';
import { verify } from 'jev-recipes/verify';
```

For another local project, run `npm pack` here and install the resulting `.tgz` file there. That exercises the same package contents npm will distribute. See [RELEASING.md](RELEASING.md) for the commands. This README does not assume the package is published on npm yet.

### Client configuration

The default client reads `TYPESAFE_API_KEY` and uses `jev-latest`. You can reuse a client and supply a model or cancellation signal per call:

```ts
import { createClient, route } from 'jev-recipes';

const client = createClient({ timeout: 15_000, retry: { maxRetries: 1 } });
const result = await route(
  {
    request: 'I was charged twice.',
    routes: {
      billing: 'Invoices, payments, subscriptions, and refunds',
      technical: 'Errors, outages, and broken integrations',
    },
    minConfidence: 0.8,
  },
  { client, signal: AbortSignal.timeout(20_000) },
);
```

Transport, authentication, retries, and timeouts use the official `@typesafe-ai/sdk`. The shared client disables SDK logging by default. API keys belong on the server, never in browser code. The SDK timeout applies per attempt; a cancellation signal can bound the complete operation. Pass a supported model ID through `{ model: '...' }` to pin evaluations when comparing versions.

## Behavior to know

- `ready` means a configured threshold passed. It does not mean the model is certainly correct or that an action was executed.
- A review outcome is a successful evaluation, not a technical error. `verify` attaches a status to each check; a ready verdict can still be `contradicted` or `unsupported`.
- Zod 4 validates inputs and model responses. Invalid input, missing credentials, provider failures, and malformed answers throw. The CLI writes an error to stderr and exits with code 1.
- Confidence is distinct from a choice's probability. Reranking uses independent yes/no relevance values, which do not sum to 1.
- Threshold defaults are illustrative. Evaluate on your own labeled examples before relying on them.
- These functions return decisions only. They do not execute handlers, modify documents, search the web, or establish whether a source is true.
- Inputs are not silently truncated. Batch limits are documented per recipe; provider context limits can require smaller batches.

## Project layout

```text
recipes/
  route/
  rerank/
  verify/
    index.ts          Recipe implementation
    schema.ts         Input/result schemas and z.infer types
    demo.json         Example input and an offline response fixture
    README.md         Usage and limits
src/
  client.ts           Thin adapter over the official SDK
  answers.ts          Validate model responses
  schema.ts           Shared Zod schemas and inferred types
  index.ts            Public exports
cli/
  index.ts            Arguments, files, stdin, and output
  recipes.ts          Explicit recipe registration
  schema.ts           Command and demo validation
```

Recipes depend on `src/`, never on one another or on the CLI. The CLI calls the public recipe functions. There is no application server, database, or background process.

## Development

```sh
npm run format
npm run ci
npm run pack:check
```

`npm run ci` checks formatting, type-checks the source, makes a clean build, and runs the offline demos. GitHub runs the same checks on Node 22 and 24. The demos show request and result shapes; live model accuracy has not been measured for this initial release.

See [CONTRIBUTING.md](CONTRIBUTING.md) for adding a recipe. Version 0.0.1 is the foundation: recipe installation into other projects, a user-data evaluation runner, and an MCP server are not included yet.

## Distribution

`npm run build` compiles the TypeScript into ESM JavaScript and `.d.ts` declarations under `dist/`. `npm pack` creates a `.tgz` containing that output, the recipe demos and documentation, the changelog, and the license. npm installs the TypeSafe SDK and Zod as runtime dependencies. Consumers do not run a build.

Use [RELEASING.md](RELEASING.md) to inspect the archive, try it in a separate project, run live evaluations, and publish version 0.0.1. Publishing is manual.

## License

MIT. Independent community project; Jev and TypeSafe are products of TypeSafe AI.
