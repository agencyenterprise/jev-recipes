# Compare two listings for a request

<!-- BEGIN GENERATED: usage -->

Which of firstListing and secondListing better satisfies request?

Use when: You need a head-to-head preference between two product listings for a shopper request, for tie-breaking, recommendation evaluation, or ranker calibration.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { listingCompare } from 'jev-recipes/listing-compare';

const result = await listingCompare({
  request:
    'Wireless over-ear headphones with active noise cancelling and at least 30 hours of battery. Must fold flat for travel.',
  firstListing:
    'AeroSound X3 over-ear wireless headphones. Hybrid active noise cancelling, 40-hour battery, foldable design with travel case. Bluetooth 5.3.',
  secondListing:
    'PulseBeat Studio wired over-ear headphones. Passive noise isolation, detachable 3 m cable, rigid headband. Studio-grade 50 mm drivers.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo listing-compare`.

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
  "verdict": "first",
  "confidence": 0.93,
  "probabilities": {
    "first": 0.93,
    "second": 0.01,
    "tie": 0.01,
    "neither": 0.03,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`passage-compare`](../passage-compare/README.md): Use passage-compare for the same pairwise judgment over text passages and a question.
- [`rerank`](../rerank/README.md): Use rerank to score many listings independently against one request.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `request`       | Yes      | string                       |
| `firstListing`  | Yes      | string                       |
| `secondListing` | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `first`, `second`, `tie`, `neither`, or `unclear`. `first` and `second` name the listing that better satisfies the request. `tie` means both fit about equally. `neither` means no listing describes a product that satisfies the request, which is a confident answer rather than a failure.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. `probabilities` covers all five outcomes.

## Reuse and calls

Uses the shared comparison helper, which fixes the five outcomes and tells Jev that presentation order is irrelevant. This folder owns the question wording and the four outcome descriptions. A live invocation makes one logical Jev request.

## Limits

The recipe compares exactly two listings. For many candidates, use [`rerank`](../rerank/README.md) or run pairwise comparisons in application code. It judges how well each described product fits the request, weighing must-have attributes before preferences, and does not consider price, stock, or seller reputation unless the request mentions them. It cannot verify that a listing's claims are true. When building evaluation data, run each pair in both orders and keep only agreeing results.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo listing-compare` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe listing-compare` to inspect the input and result schemas.
