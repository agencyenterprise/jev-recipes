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

## Reuse and calls

Uses the shared choice helper. This folder owns the routing question, route criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Routes with overlapping descriptions can be difficult to distinguish. Describe their responsibilities clearly. Routing does not execute handlers or establish permission to act.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo route` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe route` to inspect the input and result schemas.
