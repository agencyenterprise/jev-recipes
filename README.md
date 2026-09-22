# jev-recipes

[![npm version](https://img.shields.io/npm/v/jev-recipes?logo=npm)](https://www.npmjs.com/package/jev-recipes)

Small TypeScript recipes for the decisions inside an AI application. Use [Jev](https://docs.typesafe.ai/introduction/coding-agents) to choose a handler, select useful evidence, check an answer, or decide when to ask for help.

Each recipe is a function you can use on its own. Your application supplies the context and acts on the result.

## Recipes

[Browse all 66 recipes](recipes/README.md). Each handles a focused decision and has its own schemas, example, and usage guide.

| Group                                                              | Recipes | Examples                                                |
| ------------------------------------------------------------------ | ------- | ------------------------------------------------------- |
| [Answer quality](recipes/README.md#answer-quality)                 | 10      | `answer-coverage`, `answer-relevance`, `citation-match` |
| [Retrieval and evidence](recipes/README.md#retrieval-and-evidence) | 13      | `rerank`, `verify`, `answerability`                     |
| [Conversation](recipes/README.md#conversation)                     | 11      | `clarify`, `turn-intent`, `followup-link`               |
| [Tools and tasks](recipes/README.md#tools-and-tasks)               | 12      | `route`, `handoff`, `tool-fit`                          |
| [Customer support](recipes/README.md#customer-support)             | 10      | `issue-impact`, `attempted-step`, `workaround-fit`      |
| [Memory](recipes/README.md#memory)                                 | 5       | `memory-value`, `memory-scope`, `memory-relation`       |
| [Knowledge maintenance](recipes/README.md#knowledge-maintenance)   | 5       | `document-role`, `audience-fit`, `change-meaning`       |

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
npm run jev -- describe answer-coverage
```

`list` searches names, descriptions, categories, and tags. `describe` returns the recipe's limits, JSON input and result schemas, and example input.

The same catalog is available in TypeScript:

```ts
import { listRecipes, describeRecipe } from 'jev-recipes/catalog';

const recipes = listRecipes({ category: 'retrieval' });
const specification = describeRecipe('answer-coverage');
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

## Read the result before acting

- `ready` means a decision passed its threshold. Check the recipe's outcome too: a ready assessment can still find missing information or an unsupported claim.
- Inspect `verdict`, `selection`, or the recipe's aggregate result such as `allAnswered` or `canProceed`. Each guide explains its output.
- `review` is a valid outcome. Invalid inputs, malformed model responses, and provider errors throw; the command-line runner reports them on stderr and exits with code 1.
- Confidence does not guarantee correctness. Choose thresholds for your use case.
- Recipes assess the evidence and rules you supply. They return decisions; your application handles actions and permissions.

## Contribute

Each recipe owns its implementation, Zod 4 schemas, inferred types, metadata, demo, and documentation. Recipes share small decision helpers. A recipe that reuses another names that dependency in its guide and catalog metadata. Larger workflows belong in examples.

```text
recipes/<name>/    Individual recipes
src/              Shared client, response validation, schemas, and exports
catalog/          Recipe discovery and registrations grouped by subject
cli/              Command-line runner
examples/         Workflows that combine recipes
```

See [CONTRIBUTING.md](CONTRIBUTING.md) to add a recipe.

`npm run build` compiles the TypeScript into JavaScript modules and type declarations. `npm pack` creates the installable archive. See [RELEASING.md](RELEASING.md) for packaging and publishing, and [CHANGELOG.md](CHANGELOG.md) for changes.

## Cool projects

Keep the recipes small and connect them in your application. These ideas show how a few decisions can support a larger project:

| Project idea                                       | Recipes to combine                                                   | Your application supplies                                              |
| -------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| An assistant that answers every part of a question | `rerank`, `answerability`, `citation-match`, `answer-coverage`       | Document retrieval, a draft generator, and the question parts to check |
| Support that remembers attempted fixes             | `attempted-step`, `troubleshooting-fit`, `workaround-fit`, `handoff` | Conversation history, approved procedures, and escalation rules        |
| An agent that notices repeated attempts            | `result-usefulness`, `step-progress`, `repeated-attempt`             | Tool execution, attempt history, retry limits, and stop rules          |
| A knowledge base that catches outdated answers     | `change-meaning`, `answer-invalidation`, `cache-match`               | Source change tracking, saved answers, and access and freshness checks |
| Memory that respects the task's scope              | `preference-kind`, `memory-value`, `memory-scope`, `memory-relation` | Candidate facts, storage consent, and retention rules                  |

The [support assistant example](examples/support/README.md) is implemented in this repository. It combines six recipes, stops when review or better information is needed, and accepts your own draft callback:

```text
handoff → clarify → route → rerank → answerability → draft an answer → verify
```

```sh
npm run example:support
```

That command uses saved decisions and a saved draft. Add `-- --live` to use live Jev decisions with your `.env` key; the example still uses the saved draft. The other projects above are composition ideas, not additional bundled applications.

## License

[MIT](LICENSE). Independent community project. Jev and TypeSafe are products of TypeSafe AI.
