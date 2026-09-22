# Select a field value

Which supplied candidate is the value of field in document? Select an existing candidate only. Do not calculate a value, invent one, or infer an unstated field.

```ts
import { fieldSelect } from 'jev-recipes/field-select';

const result = await fieldSelect({
  field: 'Invoice reference',
  document: 'Invoice INV-2026-A. Purchase order PO-77.',
  candidates: [
    {
      id: 'invoice',
      text: 'INV-2026-A',
    },
    {
      id: 'purchase-order',
      text: 'PO-77',
    },
  ],
});

console.log(result.status, result.selection);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `field`         | Non-empty text                               |
| `document`      | Non-empty text                               |
| `candidates`    | 1 to 50 `{ id, text }` items with unique IDs |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

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
