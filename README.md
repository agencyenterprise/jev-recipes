# jev-recipes

Small TypeScript recipes for the decisions inside an AI application. Use [Jev](https://docs.typesafe.ai/introduction/coding-agents) to choose a handler, select useful evidence, check an answer, or decide when to ask for help.

Each recipe is a function you can use on its own. Your application supplies the context and acts on the result.

## Recipes

| Recipe | What it does |
| --- | --- |
| [`route`](recipes/route/README.md) | Chooses a handler for a request. |
| [`rerank`](recipes/rerank/README.md) | Selects and orders relevant passages. |
| [`verify`](recipes/verify/README.md) | Checks claims against supplied evidence. |
| [`answerability`](recipes/answerability/README.md) | Checks whether the evidence can answer a question. |
| [`clarify`](recipes/clarify/README.md) | Finds missing or ambiguous information. |
| [`handoff`](recipes/handoff/README.md) | Checks your rules for involving a human. |

Each recipe has its own usage guide, input and result schemas, and runnable demo.

## Use in an app

Requires Node.js 22.9 or newer.

```sh
npm install jev-recipes
```

Set `TYPESAFE_API_KEY` in your server's environment, then call a recipe:

```ts
import { rerank } from 'jev-recipes/rerank';

const result = await rerank({
  query: 'How do I reset my password?',
  items: [
    { id: 'billing', text: 'Invoices appear on the Billing page.' },
    { id: 'reset', text: 'Select Forgot password to receive a reset link.' },
  ],
  topK: 1,
});

if (result.status === 'ready') {
  console.log(result.items);
}
```

You can also import recipes from `jev-recipes`. Every recipe accepts an optional second argument with `client`, `model`, and `signal`. Use `createClient` to configure the official TypeSafe SDK's timeouts and retries.

Live calls send the supplied input to TypeSafe and use API quota. Keep your API key on the server.

## Try the demos

From this repository:

```sh
npm ci
npm run build
npm run jev -- demo all
```

Demos use saved responses and need no API key. They show how each recipe handles a decision; they do not measure model accuracy. To run one, replace `all` with its name.

The repository may contain additions that are not yet in the [published npm package](https://www.npmjs.com/package/jev-recipes). Use this checkout to try all the recipes shown here.

## Find a recipe

Developers and coding agents can inspect the catalog without calling Jev:

```sh
npm run jev -- list
npm run jev -- list evidence --category retrieval
npm run jev -- describe answerability
```

`list` searches names, descriptions, categories, and tags. `describe` returns the recipe's limits, JSON input and result schemas, and example input.

The same catalog is available in TypeScript:

```ts
import { listRecipes, describeRecipe } from 'jev-recipes/catalog';

const recipes = listRecipes({ category: 'retrieval' });
const specification = describeRecipe('answerability');
```

The library returns metadata and schemas. The command-line description also includes example input. Zod validates runtime inputs, including rules such as unique IDs that JSON Schema does not fully express.

## Run your own input

Add `TYPESAFE_API_KEY` to a local `.env` file. See [.env.example](.env.example) for the format.

Create an input file, edit it, then run the recipe:

```sh
node dist/cli/index.js example rerank > input.json
npm run jev -- run rerank input.json
```

The `npm run jev` command loads `.env`. Use `-` instead of a filename to read from stdin. For scripts that need JSON without npm's command banner:

```sh
node --env-file-if-exists=.env dist/cli/index.js run rerank input.json
```

## Connect the recipes

The [support assistant example](examples/support/README.md) combines all six:

```text
handoff → clarify → route → rerank → answerability → draft an answer → verify
```

It stops when the request needs a person, clarification, better evidence, or review. The draft step is a callback you can connect to your existing generation code.

```sh
npm run example:support
```

This runs offline with a saved draft and saved decisions. Add `-- --live` to call Jev for the decisions using your `.env` key. The draft stays fixed in both modes.

## Read the result before acting

- `ready` means a decision passed its threshold. Check the recipe's outcome too: a ready assessment can still find missing information or an unsupported claim.
- Use `canProceed`, `canAnswer`, `decision`, or `allSupported` as described in each recipe's guide.
- `review` is a valid outcome. Invalid inputs, malformed model responses, and provider errors throw; the command-line runner reports them on stderr and exits with code 1.
- Confidence does not guarantee correctness. Choose thresholds for your use case.
- Recipes assess the evidence and rules you supply. They return decisions; your application handles actions and permissions.

## Contribute

Each recipe owns its implementation, Zod 4 schemas, inferred types, metadata, demo, and documentation. Recipes share a small client layer and stay independent of one another.

```text
recipes/<name>/    Individual recipes
src/              Shared client, response validation, schemas, and exports
catalog/          Recipe registration and discovery
cli/              Command-line runner
examples/         Workflows that combine recipes
```

See [CONTRIBUTING.md](CONTRIBUTING.md) to add a recipe.

`npm run build` compiles the TypeScript into JavaScript modules and type declarations. `npm pack` creates the installable archive. See [RELEASING.md](RELEASING.md) for packaging and publishing, and [CHANGELOG.md](CHANGELOG.md) for changes.

## License

[MIT](LICENSE). Independent community project. Jev and TypeSafe are products of TypeSafe AI.
