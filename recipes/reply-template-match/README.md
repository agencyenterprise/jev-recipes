# Select a reply template

Which supplied approved template applies to request and context? Match any stated template conditions and do not select a template that promises unsupported actions.

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

console.log(result.status, result.selection);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `request`       | Non-empty text                               |
| `templates`     | 1 to 50 `{ id, text }` items with unique IDs |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

`verdict` is `matched`, `none`, or `ambiguous`. A confident match returns the original item ID in `selection`. A low-confidence match keeps that ID only in `suggestedSelection`. `none` returns a null selection and can be `ready`; `ambiguous` always requires review. Probabilities are grouped under `candidates` by your original IDs, plus `none` and `ambiguous`.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared candidate-selection helper. This folder owns its selection question and input schema. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Selects a supplied template. It does not fill placeholders, approve its content, personalize it, or send a response.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo reply-template-match` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe reply-template-match` shows the input and result schemas.
