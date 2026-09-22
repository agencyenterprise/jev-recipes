# Locate a correction target

<!-- BEGIN GENERATED: usage -->

Which supplied field or statement is message correcting?

Use when: You need to identify which supplied field or statement a message corrects.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { correctionTarget } from 'jev-recipes/correction-target';

const result = await correctionTarget({
  message: 'The billing email is finance@example.com, not support@example.com.',
  targets: [
    { id: 'billing-email', text: 'Billing email: support@example.com' },
    { id: 'shipping-city', text: 'Shipping city: Portland' },
  ],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo correction-target`.

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
  "selection": "billing-email",
  "suggestedSelection": "billing-email",
  "confidence": 0.96,
  "probabilities": {
    "candidates": {
      "billing-email": 1,
      "shipping-city": 0
    },
    "none": 0,
    "ambiguous": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`reference-resolve`](../reference-resolve/README.md): Use reference-resolve for references that are not corrections.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `message`       | Yes      | string                                             |
| `targets`       | Yes      | { id, text }[]; at least 1 items; at most 50 items |
| `context`       | No       | string                                             |
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

Selects one correction target. It does not extract a replacement value or update a record.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo correction-target` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe correction-target` shows the input and result schemas.
