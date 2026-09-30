# Get started with Jev recipes

Jev recipes is a TypeScript library for routing requests, reranking evidence, and reviewing agent actions. Each small function asks Jev one bounded question and validates the response. Your application owns tools, permissions, and what happens next.

## Install and run a saved example

Use Node.js 22.9 or newer with ES modules.

```sh
npm install jev-recipes
npx jev-recipes demo route
```

The demo runs offline without an API key. It replays a hand-authored response to demonstrate the contract, not live accuracy. A fixture is the saved input and response used for that demonstration.

For a new TypeScript project, install the compiler and Node.js type definitions:

```sh
npm install --save-dev typescript @types/node
```

## Make your first live call

Set `TYPESAFE_API_KEY` in your server environment. Live calls send the supplied input to TypeSafe and use API quota. Keep the key on your server.

```ts
import { route } from 'jev-recipes/route';

try {
  const result = await route({
    request: 'Please correct a duplicate charge.',
    routes: {
      billing: 'Payments, invoices, and refunds',
      technical: 'Errors, outages, and integrations',
    },
    minConfidence: 0.8,
  });
  if (result.status === 'ready') {
    console.log('Selected handler:', result.route);
  } else {
    console.log('Review required:', result.suggestedRoute);
  }
} catch (error) {
  console.error('Decision failed:', error);
}
```

Handle ready decisions, review decisions, and provider failures separately. A validated decision does not execute an action. Keep dispatch and access checks in your application.

TypeScript infers each recipe’s input and result from its exported schemas. Use `RouteInput` and `RouteResult` when you need named types. Zod runtime validation still runs because static types do not validate incoming data.

## Route requests and handle uncertainty

The [route recipe](../recipes/route/README.md) takes a request and a map of named handlers. Its default confidence threshold is 80%. A reserved review choice also requires review, regardless of confidence.

Confidence is a model estimate, not measured accuracy. The saved routing example reports 90% confidence for billing: at an 80% threshold it is ready; at 95% it needs review. Changing that threshold reuses the same saved response. It does not make a new model call.

## Rerank evidence

Pass a query and retrieved passages to [rerank](../recipes/rerank/README.md). It selects and orders supplied passages by relevance; it does not fetch documents or prove that a passage is true.

Passage IDs stay attached to the selected items. Use `topK` to cap output and `minRelevance` to set a minimum score. Inspect each recipe’s contract and limitations before using its result.

## Evaluate on your own data

Run the evaluator on labeled cases from your workflow, retain the responses, and compare decisions with the labels.

```sh
npx jev-recipes evaluate route --cases ./routing-cases.jsonl --out ./results/baseline
npx jev-recipes replay ./results/baseline --min-confidence 0.9 --out ./results/review-at-90
npx jev-recipes compare ./results/baseline ./results/review-at-90
```

Overall accuracy includes failed cases. Review rate and accuracy among ready decisions answer different questions. Keep related case families in the same split; near-duplicate cases do not provide independent evidence. Reserve held-out cases until after choosing a policy.

Replay compares thresholds with the observed responses held fixed. A changed recipe or model needs a new live evaluation. Saved fixtures and synthetic scores do not establish production accuracy. Earlier measurements remain labeled as earlier evidence.

Read the [evaluation guide](evaluation.md) for datasets, splits, and retained evidence.

## Connect your workflow

The [integration guide](integrations.md) covers direct TypeSafe API access, Vercel AI Gateway, client injection, and cancellation. Both transports use the System One request format. Transport compatibility does not establish model accuracy.

Explore the [getting-started examples](../examples/getting-started/README.md), [support-routing starter](../examples/support-routing/web/README.md), or [coding assistant guide](coding-assistants.md).
