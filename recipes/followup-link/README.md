# Link a follow-up request

<!-- BEGIN GENERATED: usage -->

Which supplied earlier request does message follow up on?

Use when: You need to connect a follow-up message to one of the earlier requests.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { followupLink } from 'jev-recipes/followup-link';

const result = await followupLink({
  message: 'Can you make that explanation shorter?',
  requests: [
    { id: 'reset', text: 'Explain how password resets work.' },
    { id: 'invoice', text: 'Download my invoice.' },
  ],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo followup-link`.

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
  "selection": "reset",
  "suggestedSelection": "reset",
  "confidence": 0.96,
  "probabilities": {
    "candidates": {
      "reset": 1,
      "invoice": 0
    },
    "none": 0,
    "ambiguous": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`reference-resolve`](../reference-resolve/README.md): Use reference-resolve to identify a referenced item rather than an earlier request.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `message`       | Yes      | string                                             |
| `requests`      | Yes      | { id, text }[]; at least 1 items; at most 50 items |
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

Selects from the supplied earlier requests. Supply enough conversation context to resolve references.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo followup-link` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe followup-link` shows the input and result schemas.
