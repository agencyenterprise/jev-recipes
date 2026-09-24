# Label the aspects of a product review

<!-- BEGIN GENERATED: usage -->

Which of these does review comment on: quality, price, shipping, service, or a defect?

Use when: You need to tag product reviews by the aspects they discuss in one call, for aspect-level ratings, routing defect reports, or filtering review feeds.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { reviewFacets } from 'jev-recipes/review-facets';

const result = await reviewFacets({
  review:
    'The blender itself is solid and crushes ice with no trouble, and for the sale price it was a steal. Unfortunately the box arrived dented and the lid gasket was torn, so it leaks. Support sent a replacement gasket within two days, which I appreciated.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo review-facets`.

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
  "detected": [
    "mentionsQuality",
    "mentionsPrice",
    "mentionsShipping",
    "mentionsService",
    "reportsDefect"
  ],
  "labels": {
    "mentionsQuality": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "mentionsPrice": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.93,
      "confidence": 0.93
    },
    "mentionsShipping": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.88,
      "confidence": 0.88
    },
    "mentionsService": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.96,
      "confidence": 0.96
    },
    "reportsDefect": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.94,
      "confidence": 0.94
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`feedback-kind`](../feedback-kind/README.md): Use feedback-kind when you need the single primary kind of a piece of feedback.
- [`issue-impact`](../issue-impact/README.md): Use issue-impact to grade how badly a reported defect blocks the customer.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `review`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per aspect: `mentionsQuality`, `mentionsPrice`, `mentionsShipping`, `mentionsService`, and `reportsDefect`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present aspects in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per aspect in a single Jev request. This folder owns the five questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Each aspect is judged independently, so combinations are expected. The labels report which aspects the review discusses, not the sentiment toward them; a glowing comment about price and a complaint about price both set `mentionsPrice`. `reportsDefect` requires a specific broken, damaged, or malfunctioning product, so general disappointment without a described fault is `absent`. For the single dominant kind of a piece of feedback use [`feedback-kind`](../feedback-kind/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo review-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe review-facets` to inspect the input and result schemas.
