# Link a follow-up request

Which supplied earlier request does message follow up on? Link by the intended task, not merely a shared word. A new unrelated request belongs to none.

```ts
import { followupLink } from 'jev-recipes/followup-link';

const result = await followupLink({
  message: 'Can you make that explanation shorter?',
  requests: [
    {
      id: 'reset',
      text: 'Explain how password resets work.',
    },
    {
      id: 'invoice',
      text: 'Download my invoice.',
    },
  ],
});

console.log(result.status, result.selection);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `message`       | Non-empty text                               |
| `requests`      | 1 to 50 `{ id, text }` items with unique IDs |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

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
