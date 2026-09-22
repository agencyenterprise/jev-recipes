# Check writing criteria

Check a draft against each supplied writing criterion.

```ts
import { toneCheck } from 'jev-recipes/tone-check';

const result = await toneCheck({
  draft: 'You caused this problem. Read the manual.',
  criteria: [
    {
      id: 'blame',
      text: 'Avoid blaming the customer.',
    },
  ],
});

console.log(result.status, result.checks);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `draft`         | Non-empty text                               |
| `criteria`      | 1 to 50 `{ id, text }` items with unique IDs |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

`checks` contains the original ID, verdict, status, confidence, and probabilities for each item. `allPassed` is true only when every check is ready and has verdict `pass`. Any uncertain check makes overall status `review`.

| Verdict   | Meaning                                              |
| --------- | ---------------------------------------------------- |
| `pass`    | The wording satisfies this criterion.                |
| `fail`    | The wording violates this criterion.                 |
| `unclear` | The criterion or wording is too ambiguous to assess. |

`unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared item-check helper. This folder owns its question, verdict criteria, and aggregate decision. A live invocation makes one logical Jev request; SDK retries can add transport attempts. All item questions are sent in that request.

## Limits

Checks supplied writing criteria. It does not rewrite text, determine factual accuracy, or check exact character counts.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo tone-check` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe tone-check` shows the input and result schemas.
