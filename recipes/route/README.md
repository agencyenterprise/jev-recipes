# Route a request

<!-- BEGIN GENERATED: usage -->

Choose a named handler or return a review decision.

Use when: You need to send a request to the right handler, team, or department.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { route } from 'jev-recipes/route';

const result = await route({
  request: 'I was charged twice for my subscription. Can someone check the invoice?',
  routes: {
    billing: 'Payments, invoices, subscriptions, and refunds',
    technical: 'Errors, outages, and broken integrations',
  },
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo route`.

<details>
<summary>Illustrative result from the offline fixture</summary>

```json
{
  "model": "demo-fixture",
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0
  },
  "status": "ready",
  "route": "billing",
  "suggestedRoute": "billing",
  "confidence": 0.9,
  "probabilities": {
    "billing": 0.95,
    "technical": 0.02,
    "__review__": 0.03
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`turn-intent`](../turn-intent/README.md): Use turn-intent to identify what a message is doing before choosing a handler.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `request`       | Yes      | string                       |
| `routes`        | Yes      | object                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

A confident selection returns `status: "ready"` and the route name in `route`. A low-confidence result or the reserved `__review__` choice returns `status: "review"` and a null `route`.

`suggestedRoute` preserves a low-confidence suggestion. It is null when no route is selected. `confidence` and `probabilities` describe the model decision, including the `__review__` option.

The result includes model and token usage. Inspect the outcome as well as its review status.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

**Earlier-evaluator measurement; experimental.**

Measured on 40 golden cases against `jev-1.13.0`: **98% accurate** overall (adversarial cases 90%).

Recorded 2026-09-27 with package 0.7.0, on the **held-out** split. Recipe fingerprint: `47f2015674f4ab7c9498d3ccfbd072384bc90f6c451edadcfe62cf24de2d402d`.

Scoring revision: 1.

39/40 cases correct; 24 ready, 16 review, 0 failed. Accuracy among ready cases: 100%.

Latency: p50 108.27 ms, p95 139.26 ms. Usage: 15985 input tokens and 1658 output tokens across 40 logical requests.

Labels: author-synthetic (40 cases): AI-authored synthetic boundary cases for jev-recipes; labels have not had independent human review.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 87% to 100%.

**Measured on these synthetic cases.**

Evaluated with the policy frozen on development data: minConfidence 0.8. No threshold search was performed on held-out cases.

Run `npm run eval -- route` to save new results and update this guide. The full report, including misses, is in [evals/results/route.json](../../evals/results/route.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->

## Reuse and calls

Uses the shared choice helper. This folder owns the routing question, route criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Routes with overlapping descriptions can be difficult to distinguish. Describe their responsibilities clearly. Routing does not execute handlers or establish permission to act.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo route` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe route` to inspect the input and result schemas.

## Build a conversation

Use `route` for one request. Use `route-many` for independent requests in a batch. When the application needs missing details before routing, compose `clarify` with `route` as shown in the [support conversation starter](../../examples/support-routing/README.md).
