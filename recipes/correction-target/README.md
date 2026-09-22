# Locate a correction target

Which supplied field or statement is message correcting? Identify the target, not the replacement value. Use ambiguous when the message corrects multiple targets without a single primary target.

```ts
import { correctionTarget } from 'jev-recipes/correction-target';

const result = await correctionTarget({
  message: 'The billing email is finance@example.com, not support@example.com.',
  targets: [
    {
      id: 'billing-email',
      text: 'Billing email: support@example.com',
    },
    {
      id: 'shipping-city',
      text: 'Shipping city: Portland',
    },
  ],
});

console.log(result.status, result.selection);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `message`       | Non-empty text                               |
| `targets`       | 1 to 50 `{ id, text }` items with unique IDs |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

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
