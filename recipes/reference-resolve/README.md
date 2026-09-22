# Resolve a reference

<!-- BEGIN GENERATED: usage -->

Which supplied candidate does reference refer to in message and context?

Use when: You need to resolve a phrase such as this one to a supplied candidate.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { referenceResolve } from 'jev-recipes/reference-resolve';

const result = await referenceResolve({
  message: 'Please cancel the hardware order, not my subscription.',
  reference: 'the hardware order',
  candidates: [
    { id: 'order', text: 'A pending hardware order.' },
    { id: 'subscription', text: 'An active monthly storage subscription.' },
  ],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo reference-resolve`.

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
  "selection": "order",
  "suggestedSelection": "order",
  "confidence": 0.96,
  "probabilities": {
    "candidates": {
      "order": 1,
      "subscription": 0
    },
    "none": 0,
    "ambiguous": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`correction-target`](../correction-target/README.md): Use correction-target when the message corrects a particular field or statement.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `message`       | Yes      | string                                             |
| `reference`     | Yes      | string                                             |
| `candidates`    | Yes      | { id, text }[]; at least 1 items; at most 50 items |
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

Resolves a supplied reference among candidates. It does not extract references, verify identity, or authorize changes.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo reference-resolve` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe reference-resolve` shows the input and result schemas.
