# Check whether a comparable property fits the subject

<!-- BEGIN GENERATED: usage -->

Is comparable similar enough to subject in type, size, age, condition, and location wording to support a valuation comparison?

Use when: You need to screen candidate comparable sales or rentals against a subject property from their descriptions, so that only plausible comparables reach a valuation model or an appraiser's review.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { comparableFit } from 'jev-recipes/comparable-fit';

const result = await comparableFit({
  subject:
    'Single-family ranch, 3 bedrooms, 2 baths, 1,650 sq ft, built 1978, updated kitchen and roof (2019), attached 2-car garage, 0.3-acre lot on a quiet suburban cul-de-sac in Maple Grove.',
  comparable:
    'Condominium, 2 bedrooms, 2 baths, 1,100 sq ft, built 2015, 14th floor of a downtown high-rise with concierge, one deeded parking space, HOA dues $610/month.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo comparable-fit`.

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
  "probability": 0.04,
  "confidence": 0.96,
  "verdict": "dissimilar"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`entity-match`](../entity-match/README.md): Use entity-match to decide whether two records describe the same property, rather than whether two different properties are similar enough to compare.
- [`passage-compare`](../passage-compare/README.md): Use passage-compare to pick which of two passages better answers a question, rather than to judge similarity between two property descriptions.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `subject`       | Yes      | string                       |
| `comparable`    | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `comparable` when Jev's yes probability is at least 0.5 and `dissimilar` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `dissimilar` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict rests on the attributes the two descriptions state, not on market data. Sale prices, sale dates, distances, and the size of any adjustment are computed in valuation code, and a comparable that fits here can still be unusable because of a stale or non-arm's-length sale the description omits. The recipe applies a general standard of similarity rather than your tolerance bands, so encode explicit thresholds on size, age, or distance in code when you have them. Neither description is verified against public records.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo comparable-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe comparable-fit` to inspect the input and result schemas.
