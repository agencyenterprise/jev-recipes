# Check whether symptoms implicate a recent change

<!-- BEGIN GENERATED: usage -->

Do symptoms plausibly point at the recently deployed change as the cause, judged on the timing and scope each describes?

Use when: An incident is open shortly after a deploy and you need a fast read on whether the change is a plausible cause, to decide whether to propose a rollback or keep looking elsewhere.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { rollbackSignal } from 'jev-recipes/rollback-signal';

const result = await rollbackSignal({
  symptoms:
    'Starting at 09:42 UTC the error rate on POST /orders jumped from 0.2% to 8%. Every failure is a null reference in PricingService.applyDiscount. GET endpoints and the cart service are unaffected.',
  change:
    'Deployed at 09:40 UTC: PricingService now loads discount rules lazily from the new promotions table instead of the in-memory cache. Only the pricing module was touched; no schema or infrastructure changes.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo rollback-signal`.

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
  "probability": 0.94,
  "confidence": 0.94,
  "verdict": "implicated"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`causal-attribution`](../causal-attribution/README.md): Use causal-attribution to classify how a text attributes a cause in general, rather than to check whether a specific change fits an incident.
- [`change-risk`](../change-risk/README.md): Use change-risk before deploying to grade how likely a change is to cause trouble, rather than after the fact to check whether it did.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `symptoms`      | Yes      | string                       |
| `change`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `implicated` when Jev's yes probability is at least 0.5 and `unrelated` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `unrelated` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict is a plausibility read from two descriptions, not a root cause finding. A change can be implicated by timing and scope and still be innocent, and an `unrelated` verdict only says the described timing and scope do not line up. The recipe does not parse timestamps or diffs, so compute the deploy-to-onset gap and the list of touched services in application code and state them in the text. Rollback decisions and approvals stay with the incident commander.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo rollback-signal` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe rollback-signal` to inspect the input and result schemas.
