# Route many requests in batches

<!-- BEGIN GENERATED: usage -->

Which named route handles each of up to 500 requests, judged in batched Jev requests so a queue of tickets, emails, or events is routed in a handful of calls instead of one per item?

Use when: You have a backlog or stream of messages to route to the same set of handlers and want batched throughput with a per-item review outcome.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { routeMany } from 'jev-recipes/route-many';

const result = await routeMany({
  requests: [
    {
      id: 't-1041',
      text: 'I was charged twice for my subscription this month. Please refund one of the charges.',
    },
    {
      id: 't-1042',
      text: 'The export button on the reports page does nothing when clicked. Console shows a 500 error.',
    },
    { id: 't-1043', text: 'Can I get a demo of the enterprise plan for a team of 40?' },
    { id: 't-1044', text: 'hi' },
  ],
  routes: {
    billing: 'Payments, invoices, subscriptions, and refunds',
    technical: 'Errors, outages, and broken product features',
    sales: 'Pricing questions, plan upgrades, demos, and new purchases',
  },
  batchSize: 20,
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo route-many`.

<details>
<summary>Illustrative result from the offline fixture</summary>

```json
{
  "model": "demo-fixture",
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0
  },
  "status": "review",
  "items": [
    {
      "id": "t-1041",
      "status": "ready",
      "route": "billing",
      "suggestedRoute": "billing",
      "confidence": 0.95,
      "probabilities": {
        "billing": 0.95,
        "technical": 0.01,
        "sales": 0.01,
        "__review__": 0.03
      }
    },
    {
      "id": "t-1042",
      "status": "ready",
      "route": "technical",
      "suggestedRoute": "technical",
      "confidence": 0.94,
      "probabilities": {
        "billing": 0.01,
        "technical": 0.94,
        "sales": 0.01,
        "__review__": 0.04
      }
    },
    {
      "id": "t-1043",
      "status": "ready",
      "route": "sales",
      "suggestedRoute": "sales",
      "confidence": 0.93,
      "probabilities": {
        "billing": 0.02,
        "technical": 0.01,
        "sales": 0.93,
        "__review__": 0.04
      }
    },
    {
      "id": "t-1044",
      "status": "review",
      "route": null,
      "suggestedRoute": null,
      "confidence": 0.85,
      "probabilities": {
        "billing": 0.05,
        "technical": 0.05,
        "sales": 0.05,
        "__review__": 0.85
      }
    }
  ],
  "routed": 3,
  "requestCount": 4,
  "requestsMade": 1
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`route`](../route/README.md): Use route for a single request, or when each request has its own set of routes.
- [`ticket-match`](../ticket-match/README.md): Use ticket-match to link a new message to an existing ticket rather than a queue.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                               |
| --------------- | -------- | --------------------------------------------------- |
| `requests`      | Yes      | { id, text }[]; at least 1 items; at most 500 items |
| `routes`        | Yes      | object                                              |
| `batchSize`     | No       | integer; minimum 1; maximum 50                      |
| `minConfidence` | No       | number; minimum 0; maximum 1                        |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

`requests` holds up to 500 items with unique ids. `routes` maps route names to descriptions, exactly as in `route`. `batchSize` sets how many requests share one Jev call, from 1 to 50, defaulting to 20. Batches run concurrently.

## Result

`items` has one entry per request, in input order, with the same fields as a `route` result: `status`, `route`, `suggestedRoute`, `confidence`, and `probabilities`. `routed` counts the items that received a ready route. `requestCount` is the number of inputs and `requestsMade` the number of Jev calls, so you can see the batching ratio.

The result `status` is `review` when any item is `review`. Items are independent, so a caller can act on the ready ones and queue the rest.

`usage` sums tokens across all calls. `model` comes from the first response.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

Measured on 40 golden cases against `jev-1.13.0`: **98% accurate** overall (adversarial cases 90%).

Recorded 2026-09-27 with package 0.7.0, on the **held-out** split. Recipe fingerprint: `ab78b9ec3027283b20df73fc1b254b21d8f3fccc0fc9dc29d7949507b6266cd1`.

39/40 cases correct; 25 ready, 15 review, 0 failed. Accuracy among ready cases: 100%.

Latency: p50 123.49 ms, p95 197.96 ms. Usage: 30241 input tokens and 3403 output tokens across 60 logical requests.

Labels: author-synthetic (40 cases): AI-authored synthetic boundary cases for jev-recipes; labels have not had independent human review.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 87% to 100%.

**Measured on these synthetic cases.**

A case counts as correct only when every item in it is right. Across the 80 individual items, **99%** were judged correctly.

Evaluated with the policy frozen on development data: minConfidence 0.8. No threshold search was performed on held-out cases.

Run `npm run eval -- route-many` to save new results and update this guide. The full report, including misses, is in [evals/results/route-many.json](../../evals/results/route-many.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->

## Reuse and calls

Uses the shared batch runner to split requests into chunks and merge the results. One live invocation makes `ceil(requests / batchSize)` Jev requests, each carrying one routing question per request in that chunk. This folder owns the routing instruction, the review policy, and the aggregation.

## Limits

Smaller batches cost more calls and larger batches risk lower per-item accuracy. Start at the default, measure against labeled data, and adjust `batchSize` per workload.

If one batch fails, the whole call rejects. Retry at the caller level, or split the input and call the recipe per group when partial results matter.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo route-many` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe route-many` to inspect the input and result schemas.
