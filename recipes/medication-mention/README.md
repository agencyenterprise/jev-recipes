# Detect a medication or dosage mention

<!-- BEGIN GENERATED: usage -->

Does message mention a medication, supplement, or dosage?

Use when: You need to route patient messages that name a drug, supplement, or dose toward pharmacy or prescriber review, or flag them for careful handling before storage.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { medicationMention } from 'jev-recipes/medication-mention';

const result = await medicationMention({
  message:
    'I have been taking 20 mg of lisinopril every morning and started a magnesium supplement last week. Since then I feel dizzy when I stand up. Is that normal, or should I stop one of them?',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo medication-mention`.

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
  "probability": 0.97,
  "confidence": 0.97,
  "verdict": "mentioned"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`pii-presence`](../pii-presence/README.md): Use pii-presence to detect personal identifiers that need protected handling alongside medication details.
- [`memory-subject`](../memory-subject/README.md): Use memory-subject to decide whose record a stated medication fact belongs to before storing it.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `message`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `mentioned` when Jev's yes probability is at least 0.5 and `absent` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `absent` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The gate reports that a medication, supplement, or dose is named in the message. It does not extract the name or dose, confirm the product exists, check interactions, or judge whether the dosing is appropriate; those belong to a drug-reference lookup and clinical review. Misspelled or colloquial names count when the wording clearly refers to a product. Use the result to route messages toward pharmacy or prescriber review and to flag content that needs careful handling before storage.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo medication-mention` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe medication-mention` to inspect the input and result schemas.
