# Propose a support queue

One request goes to Jev. A ready decision proposes a queue. A low-confidence suggestion can receive one second opinion. An explicit no-fit answer, an unavailable provider, or an uncertain fallback stays in review. The application owns ticket assignment and customer contact.

This example tests the bet that a small decision can handle straightforward requests while a larger model handles some uncertainty. The [recorded comparison](../../evals/support-routing/README.md) remains experimental. A valid response does not establish a correct route.

## Try the workflow

From the repository root, with Node.js 22.9 or newer:

```sh
npm ci --ignore-scripts
npm run build
node examples/support-routing/run.mjs
```

The four fixture scenarios cover a ready answer, fallback, no fit, and provider failure. They make no network calls. For the visual version, use the [Next.js starter](web/README.md).

To call Jev through Vercel Gateway, set `VERCEL_GATEWAY_API_KEY` (or `AI_GATEWAY_API_KEY`) in the root `.env`, then run:

```sh
node --env-file=.env examples/support-routing/run.mjs --live --request 'Please correct my invoice.'
```

Add `--fallback-model google/gemini-2.5-flash-lite` to enable one structured chat call when Jev supplies a low-confidence suggestion. Model availability depends on your Gateway account. No fallback model is enabled by default in the CLI or web app.

## Read the flow

[workflow.mjs](workflow.mjs) reads in execution order: validate the request, ask Jev, preserve clear decisions, resolve an eligible second opinion, and return a proposal. [schema.mjs](schema.mjs) defines the boundaries. [fallback.mjs](fallback.mjs) is an optional Gateway adapter for a separate structured chat decision, not a System One client.

```js
import { proposeSupportRoute } from './examples/support-routing/workflow.mjs';

const proposal = await proposeSupportRoute(
  {
    request: 'Please correct my invoice.',
    routes: { billing: 'Invoices and payments', technical: 'Product errors' },
    minConfidence: 0.8,
  },
  { client, signal, fallback },
);
```

`client` implements the existing System One contract. `fallback` is optional and accepts `(input, { signal })`; it returns `{ status: 'ready', route: '<supplied queue>' }` or `{ status: 'review', route: null }`, with optional model identity. It must honor cancellation. You own the queues, threshold, fallback model, retry policy, and any side effects.

The result contains `status`, `route`, `source`, `reason`, and an ordered `trace`. Only `ready` has a route. Invalid caller input throws before a provider call. A provider or fallback validation failure returns review; cancellation throws and stops subsequent work. Fallback cannot invent a queue or rescue an explicit no-fit answer. The Gateway adapter has a 30-second timeout and makes one request without retries.

Trace entries can contain inputs reflected by providers, model output, or error details. Keep them server-side and redact before sharing. The web endpoint exposes only a small decision summary.

## What this adds

[Customer queue](../customer-queue/README.md) shows ordinary recipe composition. This example adds a bounded fallback, a trace, a visual starter, and a paired rules/Jev/fallback comparison. Neither example moves a ticket. Keyword rules remain a useful baseline; model judgment is useful when requests express intent without a known keyword or require interpreting context.

Repository maintainers own this example. Open package issues in the [project tracker](https://github.com/agencyenterprise/jev-recipes/issues); authors own any deployed applications derived from it. There is no hosted deployment of this starter in the repository.
