# Classify a described failure

<!-- BEGIN GENERATED: usage -->

Which supplied category best describes the observed failure?

Use when: You need to assign an observed failure to one of your supplied categories.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { failureKind } from 'jev-recipes/failure-kind';

const result = await failureKind({
  failure: 'The export was rejected because the report name is missing.',
  categories: [
    { id: 'missing-input', text: 'A required input was not supplied.' },
    {
      id: 'temporary',
      text: 'A temporary service interruption prevented the operation.',
    },
  ],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo failure-kind`.

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
  "selection": "missing-input",
  "suggestedSelection": "missing-input",
  "confidence": 0.96,
  "probabilities": {
    "candidates": {
      "missing-input": 1,
      "temporary": 0
    },
    "none": 0,
    "ambiguous": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`result-outcome`](../result-outcome/README.md): Use result-outcome when first determining what a result reports.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `failure`       | Yes      | string                                             |
| `categories`    | Yes      | { id, text }[]; at least 1 items; at most 50 items |
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

Maps text to your categories. Use structured error codes first; this recipe does not diagnose a root cause or initiate retries.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo failure-kind` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe failure-kind` shows the input and result schemas.
