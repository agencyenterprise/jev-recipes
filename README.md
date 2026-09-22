# jev-recipes

[![npm version](https://img.shields.io/npm/v/jev-recipes?logo=npm)](https://www.npmjs.com/package/jev-recipes)

<!-- BEGIN GENERATED: summary -->

66 small TypeScript recipes for decisions inside an AI application. Route a request, select useful evidence, or check a claim with a function call.

[Browse all 66 recipes](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md).

<!-- END GENERATED: summary -->

[Jev](https://docs.typesafe.ai/introduction) makes the underlying decisions. This package supplies focused instructions, validated inputs and results, and clear review outcomes. Your application decides what to do next.

## Use a recipe

Requires Node.js 22.9 or newer. Install in your application:

```sh
npm install jev-recipes
```

Set your API key in your server environment:

```sh
export TYPESAFE_API_KEY='your-api-key'
```

Choose a recipe, import it, and call it:

<!-- BEGIN GENERATED: quickstart -->

```ts
import { route } from 'jev-recipes/route';

const result = await route({
  request: 'I was charged twice for my subscription. Can someone check the invoice?',
  routes: {
    billing: 'Payments, invoices, subscriptions, and refunds',
    technical: 'Errors, outages, and broken integrations',
  },
});
console.log(result.status, result.route);
```

<!-- END GENERATED: quickstart -->

For `route`, a `ready` result contains the chosen route. A `review` result has a null route: ask for clarification or involve a person. Invalid input, malformed responses, and provider failures throw errors.

Live calls send the supplied input to TypeSafe and use API quota. Keep the key on the server. No Makefile or build step is needed to use the installed package.

## Find the right recipe

| I want to…                                     | Start with                                                                                                       |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Send a request to the right handler            | [`route`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/route/README.md)                     |
| Select relevant passages                       | [`rerank`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/rerank/README.md)                   |
| Check whether I have enough evidence to answer | [`answerability`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/answerability/README.md)     |
| Check claims against evidence                  | [`verify`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/verify/README.md)                   |
| Check whether a draft answers each question    | [`answer-coverage`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/answer-coverage/README.md) |

Search the catalog and inspect a recipe without an API key:

```sh
npx jev-recipes list "enough evidence" --limit 5
npx jev-recipes describe answerability
npx jev-recipes demo answerability
```

`list` ranks matching recipes and supports `--category`. `describe` shows when to use a recipe, related alternatives, input and result schemas, and example input. `demo` runs a saved illustration without calling a model. CLI output is JSON, so it also works in scripts and agent tools.

## Run your own input from the terminal

```sh
npx jev-recipes example route > input.json
```

Edit the file, then run it with your key set:

```sh
npx jev-recipes run route input.json
```

The installed CLI reads its environment; it does not load `.env` automatically. Errors go to stderr with exit code 1. A review outcome is a completed evaluation, so inspect the result before acting.

## Understand the result

- Read the recipe's outcome as well as its confidence or review status. A confident assessment can identify an unsupported claim or missing information.
- Batch recipes preserve individual checks. `verify` includes `allSupported` and per-claim statuses rather than one overall status.
- Results include model and token usage. Confidence is not a guarantee of correctness.
- Pass `{ client, model, signal }` as a second argument when you need to configure a call.

Use direct imports such as `jev-recipes/route` to load a recipe and its dependencies. Root imports remain supported. Installation still downloads one package; direct imports do not selectively download files.

Your application owns retrieval, generation, storage, and actions. Each recipe returns a decision. See [shared behavior and limits](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md#shared-options-and-behavior).

## Contribute

The recipe folder owns its code, schemas, metadata, demo, and guide. Tests stay under `tests/recipe/` and are not published. Exports and the catalog are generated from the recipe folders.

```sh
make setup
make docs
make ci
```

Run `make help` for all commands. [Contributing](https://github.com/agencyenterprise/jev-recipes/blob/main/CONTRIBUTING.md) explains authoring and generation; [releasing](https://github.com/agencyenterprise/jev-recipes/blob/main/RELEASING.md) explains package checks and publishing.

## License

[MIT](https://github.com/agencyenterprise/jev-recipes/blob/main/LICENSE). Independent community project. Jev and TypeSafe are products of TypeSafe AI.
