# Classify a described failure

Which supplied category best describes the observed failure? Classify the described failure rather than inventing an underlying cause.

```ts
import { failureKind } from 'jev-recipes/failure-kind';

const result = await failureKind({
  failure: 'The export was rejected because the report name is missing.',
  categories: [
    {
      id: 'missing-input',
      text: 'A required input was not supplied.',
    },
    {
      id: 'temporary',
      text: 'A temporary service interruption prevented the operation.',
    },
  ],
});

console.log(result.status, result.selection);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `failure`       | Non-empty text                               |
| `categories`    | 1 to 50 `{ id, text }` items with unique IDs |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

`verdict` is `matched`, `none`, or `ambiguous`. A confident match returns the original item ID in `selection`. A low-confidence match keeps that ID only in `suggestedSelection`. `none` returns a null selection and can be `ready`; `ambiguous` always requires review. Probabilities are grouped under `candidates` by your original IDs, plus `none` and `ambiguous`.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared candidate-selection helper. This folder owns its selection question and input schema. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Maps text to your categories. Use structured error codes first; this recipe does not diagnose a root cause or initiate retries.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo failure-kind` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe failure-kind` shows the input and result schemas.
