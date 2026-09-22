# Check answer relevance

How directly does draft address request? Judge alignment with the requested subject and task, not factual correctness or completeness.

```ts
import { answerRelevance } from 'jev-recipes/answer-relevance';

const result = await answerRelevance({
  request: 'How do I reset my password?',
  draft: 'You can download invoices from the Billing page.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `request`       | Non-empty text                               |
| `draft`         | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| `relevant`        | The draft directly addresses the requested subject and task.                                           |
| `partly_relevant` | The draft mixes relevant content with a substantial unrelated tangent or addresses a neighboring task. |
| `off_topic`       | The draft does not address the requested subject or task.                                              |
| `unclear`         | The request or draft is too ambiguous to assess alignment.                                             |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Relevance does not establish correctness or complete coverage. Use answer-coverage and verify for those decisions.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo answer-relevance` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe answer-relevance` shows the input and result schemas.
