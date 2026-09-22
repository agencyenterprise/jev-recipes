# Check answer consistency

Do firstStatement and secondStatement make compatible claims about the same subject and circumstances? Distinguish different conditions from a contradiction.

```ts
import { answerConsistency } from 'jev-recipes/answer-consistency';

const result = await answerConsistency({
  firstStatement: 'Guests can export reports.',
  secondStatement: 'Guests cannot export reports.',
});

console.log(result.status, result.verdict);
```

## Input

| Field             | Accepts                                      |
| ----------------- | -------------------------------------------- |
| `firstStatement`  | Non-empty text                               |
| `secondStatement` | Non-empty text                               |
| `context`         | Optional non-empty text                      |
| `minConfidence`   | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict       | Meaning                                                                                 |
| ------------- | --------------------------------------------------------------------------------------- |
| `consistent`  | Both statements concern the same subject and can hold under the supplied circumstances. |
| `conflicting` | The statements concern the same circumstances and make mutually incompatible claims.    |
| `unrelated`   | The statements concern different subjects or scopes that should not be compared.        |
| `unclear`     | The supplied circumstances do not resolve whether the statements conflict.              |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Checks semantic consistency between two statements. Exact numeric and date comparisons belong in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo answer-consistency` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe answer-consistency` shows the input and result schemas.
