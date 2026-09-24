# Check a listing against a request

<!-- BEGIN GENERATED: usage -->

Does listing describe a product that satisfies what request asks for, including stated must-have attributes?

Use when: You need a yes/no filter on search or recommendation results so shoppers only see listings that meet their stated requirements.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { productMatch } from 'jev-recipes/product-match';

const result = await productMatch({
  request:
    'Looking for a stainless steel water bottle, at least 32 oz, that fits a standard car cup holder. Must be dishwasher safe. A straw lid would be nice but is not required.',
  listing:
    'Summit 40 oz Insulated Bottle. 18/8 stainless steel, double-wall vacuum insulation. Tapered base fits most car cup holders. Dishwasher safe (top rack). Includes screw-top lid; straw lid sold separately.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo product-match`.

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
  "probability": 0.91,
  "confidence": 0.91,
  "verdict": "matches"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`rerank`](../rerank/README.md): Use rerank to order many listings by relevance to one query rather than gate each one.
- [`tool-fit`](../tool-fit/README.md): Use tool-fit for the analogous check of whether a tool satisfies a task description.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `request`       | Yes      | string                       |
| `listing`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `matches` when Jev's yes probability is at least 0.5 and `mismatched` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `mismatched` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default, such as showing the listing lower or asking the shopper to confirm.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe compares two pieces of text. It cannot check stock, current price, or attributes the listing does not mention, and a listing that is silent on a required attribute is treated as `mismatched`. Requirements the request marks as optional do not disqualify a listing, so write requests so that must-haves and nice-to-haves are distinguishable. For ordering many candidates use [`rerank`](../rerank/README.md); this recipe gates one listing at a time.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo product-match` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe product-match` to inspect the input and result schemas.
