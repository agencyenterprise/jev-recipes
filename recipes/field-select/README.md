# Select a field value

<!-- BEGIN GENERATED: usage -->

Which supplied candidate is the value of field in document?

Use when: You need to select which supplied candidate expresses a field value in a document.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { fieldSelect } from 'jev-recipes/field-select';

const result = await fieldSelect({
  field: 'Invoice reference',
  document: 'Invoice INV-2026-A. Purchase order PO-77.',
  candidates: [
    { id: 'invoice', text: 'INV-2026-A' },
    { id: 'purchase-order', text: 'PO-77' },
  ],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo field-select`.

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
  "verdict": "matched",
  "selection": "invoice",
  "suggestedSelection": "invoice",
  "confidence": 0.96,
  "probabilities": {
    "candidates": {
      "invoice": 1,
      "purchase-order": 0
    },
    "none": 0,
    "ambiguous": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`reference-resolve`](../reference-resolve/README.md): Use reference-resolve to identify what a conversational reference points to.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `field`         | Yes      | string                                             |
| `document`      | Yes      | string                                             |
| `candidates`    | Yes      | { id, text }[]; at least 1 items; at most 50 items |
| `minConfidence` | No       | number; minimum 0; maximum 1                       |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

`verdict` is `matched`, `none`, or `ambiguous`. A confident match returns the original item ID in `selection`. A low-confidence match keeps that ID only in `suggestedSelection`. `none` returns a null selection and can be `ready`; `ambiguous` always requires review. Probabilities are grouped under `candidates` by your original IDs, plus `none` and `ambiguous`.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared candidate-selection helper. This folder owns its selection question and input schema. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Chooses among caller-supplied candidates. Extract candidates with a parser or generator first; validate exact formats and identifiers in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo field-select` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe field-select` shows the input and result schemas.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

Measured on 40 golden cases against `jev-1.13.0`: **100% accurate** overall (contested cases 100%).

Recorded 2026-09-27 with package 0.7.0, on the **held-out** split. Recipe fingerprint: `3410c4137a54287f299baf2ea79eca4e6fe0c84ce9f3a15629f076db7b7dde5c`.

40/40 cases correct; 30 ready, 10 review, 0 failed. Accuracy among ready cases: 100%.

Latency: p50 113.85 ms, p95 159.59 ms. Usage: 20051 input tokens and 2010 output tokens across 40 logical requests.

Labels: author-synthetic (40 cases): AI-authored synthetic boundary cases for jev-recipes; labels have not had independent human review.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 91% to 100%.

**Measured on these synthetic cases.**

A case counts as correct only when every item in it is right. Across the 80 individual items, **100%** were judged correctly.

Evaluated with the policy frozen on development data: minConfidence 0.8. No threshold search was performed on held-out cases.

Run `npm run eval -- field-select` to save new results and update this guide. The full report, including misses, is in [evals/results/field-select.json](../../evals/results/field-select.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->
