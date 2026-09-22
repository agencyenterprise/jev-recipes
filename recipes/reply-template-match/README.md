# Select a reply template

<!-- BEGIN GENERATED: usage -->

Which supplied approved template applies to request and context?

Use when: You want to select a supplied approved reply template for a request.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { replyTemplateMatch } from 'jev-recipes/reply-template-match';

const result = await replyTemplateMatch({
  request: 'How do I reset my password?',
  templates: [
    {
      id: 'reset',
      text: 'For password reset requests: Select Forgot password on the sign-in page.',
    },
    {
      id: 'invoice',
      text: 'For invoice requests: Open Billing and select Download invoice.',
    },
  ],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo reply-template-match`.

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

- [`route`](../route/README.md): Use route to select a handler rather than a response template.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `request`       | Yes      | string                                             |
| `templates`     | Yes      | { id, text }[]; at least 1 items; at most 50 items |
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

Selects a supplied template. It does not fill placeholders, approve its content, personalize it, or send a response.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo reply-template-match` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe reply-template-match` shows the input and result schemas.
