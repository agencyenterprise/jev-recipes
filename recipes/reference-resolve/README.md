# Resolve a reference

Which supplied candidate does reference refer to in message and context? Resolve only this reference. Do not invent an entity or break a genuine tie.

```ts
import { referenceResolve } from 'jev-recipes/reference-resolve';

const result = await referenceResolve({
  message: 'Please cancel the hardware order, not my subscription.',
  reference: 'the hardware order',
  candidates: [
    {
      id: 'order',
      text: 'A pending hardware order.',
    },
    {
      id: 'subscription',
      text: 'An active monthly storage subscription.',
    },
  ],
});

console.log(result.status, result.selection);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `message`       | Non-empty text                               |
| `reference`     | Non-empty text                               |
| `candidates`    | 1 to 50 `{ id, text }` items with unique IDs |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

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
