# jev-recipes

[![npm version](https://img.shields.io/npm/v/jev-recipes?logo=npm)](https://www.npmjs.com/package/jev-recipes)

66 small TypeScript recipes for AI applications. Choose a handler, select useful evidence, check an answer, or decide when to ask for help.

Use `jev-recipes` through TypeScript imports or its included command-line tool. [Jev](https://docs.typesafe.ai/introduction/coding-agents) powers the live decisions. Your application supplies the context and acts on the result.

## Install

Requires Node.js 22.9 or newer.

```sh
npm install jev-recipes
```

## Use a recipe

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

## Recipes

[Browse all 66 recipes](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md). Each handles a focused decision and has its own schemas, example, and usage guide.

| Group                                                                                                                        | Recipes | Examples                                                |
| ---------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------- |
| [Answer quality](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md#answer-quality)                 | 10      | `answer-coverage`, `answer-relevance`, `citation-match` |
| [Retrieval and evidence](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md#retrieval-and-evidence) | 13      | `rerank`, `verify`, `answerability`                     |
| [Conversation](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md#conversation)                     | 11      | `clarify`, `turn-intent`, `followup-link`               |
| [Tools and tasks](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md#tools-and-tasks)               | 12      | `route`, `handoff`, `tool-fit`                          |
| [Customer support](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md#customer-support)             | 10      | `issue-impact`, `attempted-step`, `workaround-fit`      |
| [Memory](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md#memory)                                 | 5       | `memory-value`, `memory-scope`, `memory-relation`       |
| [Knowledge maintenance](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md#knowledge-maintenance)   | 5       | `document-role`, `audience-fit`, `change-meaning`       |

## Try a demo

After installing the package, run its CLI from your app's directory:

```sh
npx jev-recipes demo rerank
```

Replace `rerank` with another recipe name, or use `all` to try every installed recipe. Demos use saved responses and need no API key. They show how recipes handle decisions; they do not measure model accuracy.

## Find a recipe

Use the CLI to browse the installed recipes without an API key:

```sh
npx jev-recipes list
npx jev-recipes list evidence --category retrieval
npx jev-recipes describe answer-coverage
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

Save an example input from the installed package:

```sh
npx jev-recipes example rerank > input.json
```

Edit `input.json`, then set your API key in the terminal and run the recipe:

```sh
export TYPESAFE_API_KEY='your-api-key'
npx jev-recipes run rerank input.json
```

The CLI reads the key from its environment; it does not load `.env` files automatically. Live runs send your input to TypeSafe and use API quota. Commands return JSON. Use `-` instead of a filename to read from stdin.

## Read the result before acting

- `ready` means a decision passed its threshold. Check the recipe's outcome too: a ready assessment can still find missing information or an unsupported claim.
- Inspect `verdict`, `selection`, or the recipe's aggregate result such as `allAnswered` or `canProceed`. Each guide explains its output.
- `review` is a valid outcome. Invalid inputs, malformed model responses, and provider errors throw; the command-line runner reports them on stderr and exits with code 1.
- Confidence does not guarantee correctness. Choose thresholds for your use case.
- Recipes assess the evidence and rules you supply. They return decisions; your application handles actions and permissions.

## Contribute

See [CONTRIBUTING.md](https://github.com/agencyenterprise/jev-recipes/blob/main/CONTRIBUTING.md) for repository setup, tests, and adding recipes. See [CHANGELOG.md](https://github.com/agencyenterprise/jev-recipes/blob/main/CHANGELOG.md) for changes and [RELEASING.md](https://github.com/agencyenterprise/jev-recipes/blob/main/RELEASING.md) for publishing.

## Cool projects

Keep the recipes small and connect them in your application. These ideas show how a few decisions can support a larger project:

| Project idea                                       | Recipes to combine                                                   | Your application supplies                                              |
| -------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| An assistant that answers every part of a question | `rerank`, `answerability`, `citation-match`, `answer-coverage`       | Document retrieval, a draft generator, and the question parts to check |
| Support that remembers attempted fixes             | `attempted-step`, `troubleshooting-fit`, `workaround-fit`, `handoff` | Conversation history, approved procedures, and escalation rules        |
| An agent that notices repeated attempts            | `result-usefulness`, `step-progress`, `repeated-attempt`             | Tool execution, attempt history, retry limits, and stop rules          |
| A knowledge base that catches outdated answers     | `change-meaning`, `answer-invalidation`, `cache-match`               | Source change tracking, saved answers, and access and freshness checks |
| Memory that respects the task's scope              | `preference-kind`, `memory-value`, `memory-scope`, `memory-relation` | Candidate facts, storage consent, and retention rules                  |

The [support assistant example](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/support/README.md) shows how to combine recipes with your own draft generator. It stops when review or better information is needed:

```text
handoff → clarify → route → rerank → answerability → draft an answer → verify
```

## License

[MIT](https://github.com/agencyenterprise/jev-recipes/blob/main/LICENSE). Independent community project. Jev and TypeSafe are products of TypeSafe AI.
