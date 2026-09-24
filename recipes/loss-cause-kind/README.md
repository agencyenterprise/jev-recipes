# Identify the cause of loss in a claim narrative

<!-- BEGIN GENERATED: usage -->

What cause of loss does narrative describe: weather, fire, water, theft, collision, wear and tear, vandalism, or something else?

Use when: A claims intake or routing system needs to sort a free-form loss description into a cause-of-loss category so it can pick the right adjuster queue, forms, or follow-up questions.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { lossCauseKind } from 'jev-recipes/loss-cause-kind';

const result = await lossCauseKind({
  narrative:
    "We returned from a long weekend on Monday evening and found the back door forced open, with the frame splintered around the deadbolt. Two laptops, my wife's jewelry box, a camera bag, and the cash we kept in the desk drawer were gone. Drawers were pulled out in every bedroom. We called the police that night and have a report number; the neighbor's doorbell camera shows two people in the yard at around 3 am on Sunday.",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo loss-cause-kind`.

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
  "verdict": "theft",
  "confidence": 0.91,
  "probabilities": {
    "weather": 0.01,
    "fire": 0,
    "water": 0.01,
    "theft": 0.91,
    "collision": 0,
    "wear_and_tear": 0,
    "vandalism": 0.04,
    "other": 0.01,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`failure-kind`](../failure-kind/README.md): Use failure-kind to classify why a technical operation failed rather than what caused an insured loss.
- [`shipment-issue-kind`](../shipment-issue-kind/README.md): Use shipment-issue-kind for what went wrong with a delivery; this recipe classifies the peril behind a property or vehicle loss.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `narrative`     | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is one of `weather`, `fire`, `water`, `theft`, `collision`, `wear_and_tear`, `vandalism`, `other`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The verdict names the cause the claimant's wording describes; it does not investigate, verify, or reconstruct what actually happened, and it must not be used to decide coverage, apply exclusions, or assess fault. Chains of events resolve to the single initiating cause the narrative emphasizes, so a storm that caused a roof leak is weather, while a leak with no stated origin is water; if you need every contributing cause, extract them separately. Vehicle, property, and marine losses all pass through the same categories; the recipe does not know which line of business the claim belongs to unless the narrative makes it obvious.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo loss-cause-kind` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe loss-cause-kind` to inspect the input and result schemas.
