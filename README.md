# jev-recipes

[![npm version](https://img.shields.io/npm/v/jev-recipes?logo=npm)](https://www.npmjs.com/package/jev-recipes)

66 small TypeScript recipes for the decisions inside an AI application. Route a request, select useful evidence, or check a claim with a function call.

[Jev](https://docs.typesafe.ai/introduction/coding-agents) provides the underlying decisions. `jev-recipes` provides the instructions, input and result validation, and confidence handling for each task.

## What you get

| The package handles                                   | You supply                                            |
| ----------------------------------------------------- | ----------------------------------------------------- |
| A defined decision with instructions and criteria     | Your request, evidence, candidates, or business rules |
| Calling Jev and validating its response               | Your TypeSafe API key                                 |
| Typed results and confidence or review outcomes       | What your application does with the result            |
| A searchable catalog, usage guides, and offline demos | The recipe that fits your task                        |

Call one recipe from your server code or combine several. Your application keeps its own interface, data retrieval, generation, and actions. Customers see the resulting behavior, such as a request reaching the right support team.

Developers use TypeScript imports or the included command-line tool. To let an agent call a recipe, expose the function through that agent's tool interface.

## Start with one decision

| You want to…                  | Use                                                                                            | Provide → receive                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Choose who handles a request  | [`route`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/route/README.md)   | Request and route descriptions → selected route or review          |
| Select passages for an answer | [`rerank`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/rerank/README.md) | Question and candidate passages → passages ordered by relevance    |
| Check claims against evidence | [`verify`](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/verify/README.md) | Claims paired with evidence → individual checks and `allSupported` |

[Browse all 66 recipes](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md) for answer quality, retrieval, conversations, tools, support, memory, and knowledge maintenance. Each guide explains its inputs, results, and limits.

## Use a recipe

Requires Node.js 22.9 or newer. Install the package in your application:

```sh
npm install jev-recipes
```

Set `TYPESAFE_API_KEY` in your server's environment. For a local terminal session:

```sh
export TYPESAFE_API_KEY='your-api-key'
```

Then call a recipe from your application:

```ts
import { route } from 'jev-recipes/route';

const result = await route({
  request: 'I was charged twice.',
  routes: {
    billing: 'Payments, invoices, and refunds',
    technical: 'Errors and broken integrations',
  },
});

console.log({ status: result.status, route: result.route });
```

An illustrative result, showing those two fields:

```json
{ "status": "ready", "route": "billing" }
```

Your code can assign the request to `result.route` when it is `ready`. On `review`, the route is null; your application can ask for clarification or involve a person.

You can also import from `jev-recipes` and pass `{ client, model, signal }` as a second argument; see [shared options](https://github.com/agencyenterprise/jev-recipes/blob/main/recipes/README.md#shared-options-and-behavior).

Live calls send the supplied input to TypeSafe and use API quota. Keep the key on the server.

## Understand the result

Read the fields for your task, such as `route`, `items`, or `allSupported`. Every result includes the model and token usage.

- `ready` means the assessment passed the recipe's threshold. Read the outcome too: a confident assessment can still find missing information or an unsupported claim.
- `review` calls for a fallback or closer inspection, such as when confidence is low, a choice is ambiguous, or no passage is relevant.
- Batch recipes include individual checks. `verify` has per-claim statuses and an `allSupported` flag, with no overall status.
- Invalid inputs, malformed responses, and provider failures throw. Handle these as errors separately from review outcomes.

Confidence does not guarantee correctness. Each recipe guide documents its thresholds and review behavior.

## Explore from the terminal

After installation, use the CLI from your app's directory. These commands need no API key:

```sh
npx jev-recipes demo route
npx jev-recipes list evidence
npx jev-recipes describe route
```

`demo` shows a saved decision, `list` finds recipes, and `describe` shows the input and result schemas with example input. Output is JSON. Demos are illustrations, not measurements of model accuracy.

To try your own input, save an example:

```sh
npx jev-recipes example route > input.json
```

Edit `input.json`, then run it with `TYPESAFE_API_KEY` set:

```sh
npx jev-recipes run route input.json
```

The CLI reads the key from its environment; it does not load `.env` automatically.

## Contribute

[Contributing](https://github.com/agencyenterprise/jev-recipes/blob/main/CONTRIBUTING.md) covers repository setup, tests, and adding recipes. See the [changelog](https://github.com/agencyenterprise/jev-recipes/blob/main/CHANGELOG.md) for release notes.

## Cool projects

Start with a useful decision, then connect recipes as your application needs them:

| Project idea                                   | Recipes to combine                                             | Your application supplies                              |
| ---------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| An assistant that checks its answers           | `rerank`, `answerability`, `citation-match`, `answer-coverage` | Retrieved documents and a draft answer                 |
| Support that remembers attempted fixes         | `attempted-step`, `troubleshooting-fit`, `handoff`             | Conversation history, procedures, and escalation rules |
| An agent that notices repeated attempts        | `result-usefulness`, `step-progress`, `repeated-attempt`       | Tool execution, attempt history, and retry limits      |
| A knowledge base that catches outdated answers | `change-meaning`, `answer-invalidation`, `cache-match`         | Source changes and saved answers                       |
| Memory that respects the task's scope          | `preference-kind`, `memory-value`, `memory-scope`              | Candidate facts, storage consent, and retention rules  |

The [support assistant example](https://github.com/agencyenterprise/jev-recipes/blob/main/examples/support/README.md) combines recipes with your own draft generator. Orchestration stays in your application. Recipes that call another recipe document that reuse in their guide.

## License

[MIT](https://github.com/agencyenterprise/jev-recipes/blob/main/LICENSE). Independent community project. Jev and TypeSafe are products of TypeSafe AI.
