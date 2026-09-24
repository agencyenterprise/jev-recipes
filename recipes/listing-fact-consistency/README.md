# Check a listing description against its fact sheet

<!-- BEGIN GENERATED: usage -->

Does the free-text description contradict the structured facts about the property?

Use when: You need to catch a marketing description that disagrees with the structured listing data on bedrooms, size, year built, or features before the listing is published or syndicated.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { listingFactConsistency } from 'jev-recipes/listing-fact-consistency';

const result = await listingFactConsistency({
  description:
    'Welcome to this beautifully maintained four-bedroom colonial on a half-acre lot. The 2,400 sq ft layout offers a renovated kitchen, hardwood floors throughout, a finished basement, and a two-car attached garage. Built in 1994 and lovingly updated, this home is move-in ready.',
  facts:
    'Property type: Single-family, colonial\nBedrooms: 3\nBathrooms: 2.5\nLiving area: 2,380 sq ft\nLot size: 0.5 acres\nYear built: 1994\nGarage: 2-car attached\nBasement: Unfinished\nFlooring: Hardwood, carpet',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo listing-fact-consistency`.

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
  "probability": 0.95,
  "confidence": 0.95,
  "verdict": "contradicts"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`headline-fit`](../headline-fit/README.md): Use headline-fit to check whether a title represents its body fairly, rather than whether prose contradicts a structured fact sheet.
- [`extraction-fidelity`](../extraction-fidelity/README.md): Use extraction-fidelity to grade how faithfully structured values were pulled from a source document, the reverse direction of this check.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `description`   | Yes      | string                       |
| `facts`         | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `contradicts` when Jev's yes probability is at least 0.5 and `consistent` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `consistent` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict says whether the description conflicts with the supplied facts, not which attribute is wrong or which input is correct. A description that omits facts or adds unverifiable marketing claims is still consistent, so this check does not catch under-disclosure or puffery. Neither input is compared to the actual property, tax records, or an MLS feed, and tolerance for rounding is a judgment the caller may want to tighten with per-field numeric checks in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo listing-fact-consistency` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe listing-fact-consistency` to inspect the input and result schemas.
