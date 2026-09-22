# jev recipes

Small, composable recipes for [Jev](https://docs.typesafe.ai/introduction/coding-agents): check what a request needs, decide when to involve a human, and ground answers in evidence.

A TypeScript library and a small command-line runner. Each recipe owns its implementation, Zod schemas, discovery metadata, example, and documentation. Public data types are inferred from those schemas.

**Release status:** `0.0.1` is published on npm with `route`, `rerank`, and `verify`. The additional recipes, catalog, and support example below are unreleased changes in this checkout. Try them locally or from a packed tarball until the next release; the package version is still `0.0.1`.

| Recipe                                             | Use it to                                   | Inspect before proceeding                      |
| -------------------------------------------------- | ------------------------------------------- | ---------------------------------------------- |
| [`route`](recipes/route/README.md)                 | Choose a handler                            | `status`, `route`                              |
| [`rerank`](recipes/rerank/README.md)               | Select useful evidence                      | `status`, `items`                              |
| [`verify`](recipes/verify/README.md)               | Check claims against evidence               | `allSupported`, `checks`                       |
| [`answerability`](recipes/answerability/README.md) | Check whether evidence answers the question | `canAnswer`, `verdict`                         |
| [`clarify`](recipes/clarify/README.md)             | Find missing or ambiguous requirements      | `canProceed`, `missing`, `ambiguous`, `checks` |
| [`handoff`](recipes/handoff/README.md)             | Check your escalation rules                 | `decision`, `matchedRules`, `uncertainRules`   |

## Try it locally

Requires Node.js 22.9 or newer. From this repository:

```sh
npm ci
npm run build
npm run jev -- list
npm run jev -- demo rerank
```

All six demos work without a key. Each recipe's `README.md` explains its API and limits; `demo.json` supplies executable example input and a saved response for the CLI. The demos run the recipe's validation and decision handling without calling Jev or measuring model accuracy.

```sh
npm run jev -- demo all
npm run example:support
```

## Discover a recipe

```sh
npm run jev -- list
npm run jev -- list rag
npm run jev -- list --category conversation
npm run jev -- list evidence --category retrieval
npm run jev -- describe answerability
```

Discovery is local and needs no API key. `list` searches names, descriptions, categories, and tags; all query words must match. `describe` returns metadata, limitations, JSON input/result schemas, and example input. A coding agent can use that output to select a recipe and prepare a call. Zod remains the runtime validator: refinements such as unique IDs are documented but are not fully represented by JSON Schema.

```ts
import { listRecipes, describeRecipe } from 'jev-recipes/catalog';

const recipes = listRecipes({ category: 'retrieval', query: 'rag' });
const specification = describeRecipe('answerability');
```

The library description includes metadata and schemas; the CLI also includes fixture input. No MCP server or agent-specific integration is required.

## Compose a support assistant

The [support example](examples/support/README.md) connects all six recipes:

```text
handoff → clarify → route → rerank → answerability → your draft callback → verify
```

It stops when a person, clarification, better evidence, or review is needed. Each recipe remains usable on its own. The example uses a saved draft; replace that callback with your existing generator when adapting it to an app.

```sh
npm run example:support
npm run example:support -- --live
```

The first command is offline. The second uses live Jev decisions and the same saved draft, loading the key from `.env`. Both identify their mode in the output.

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

For another local project, run `npm pack` here and install the resulting `.tgz` file there. That exercises the same package contents npm will distribute. See [RELEASING.md](RELEASING.md) for the commands. The published foundation can be installed with `npm install jev-recipes`. Use a tarball to try the unreleased additions.

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
  route/  rerank/  verify/  answerability/  clarify/  handoff/
    index.ts          Recipe implementation
    schema.ts         Input/result schemas and z.infer types
    metadata.ts       Description, category, tags, and limitations
    demo.json         Example input and an offline response fixture
    README.md         Usage and limits
src/                  Shared client, answer validation, schemas, and exports
catalog/              Explicit recipe registration and discovery
cli/                  Arguments, files, stdin, and output
examples/support/     Application composition, separate from recipe logic
```

Recipes import only their own files and shared implementation modules. The catalog registers recipes explicitly; the CLI consumes that catalog. Application workflows belong in `examples/`, keeping orchestration out of the recipe functions. There is no application server, database, or background process.

## Development

```sh
npm run format
npm run ci
npm run pack:check
```

`npm run ci` checks formatting, type-checks the source, makes a clean build, and runs all offline demos plus the support example. GitHub runs the same checks on Node 22 and 24. The demos show request and result shapes; live model accuracy has not been measured for this initial release.

See [CONTRIBUTING.md](CONTRIBUTING.md) for adding a recipe. The catalog makes new recipes discoverable through one registration. A user-data evaluation runner, code installer, and MCP server are outside this release.

## Distribution

`npm run build` compiles the TypeScript into ESM JavaScript and `.d.ts` declarations under `dist/`. `npm pack` creates a `.tgz` containing that output, the recipe demos and documentation, the support example fixture and documentation, the changelog, and the license. npm installs the TypeSafe SDK and Zod as runtime dependencies. Consumers do not run a build.

Use [RELEASING.md](RELEASING.md) to inspect the archive, try it in a separate project, run live evaluations, and prepare the next version. Publishing and version selection remain manual.

## License

MIT. Independent community project; Jev and TypeSafe are products of TypeSafe AI.
