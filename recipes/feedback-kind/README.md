# Classify customer feedback

What is the primary kind of feedback in message? Prefer the explicit requested outcome over incidental tone. Choose unclear when several kinds are equally central.

```ts
import { feedbackKind } from 'jev-recipes/feedback-kind';

const result = await feedbackKind({
  message: 'Could you add CSV export to the activity page?',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `message`       | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| `bug_report`      | Reports existing functionality behaving incorrectly.                                             |
| `feature_request` | Requests a new capability or changed behavior.                                                   |
| `question`        | Asks for information or instructions.                                                            |
| `praise`          | Primarily expresses positive feedback without another requested outcome.                         |
| `complaint`       | Primarily expresses dissatisfaction without a specific bug report, feature request, or question. |
| `other`           | The feedback has a clear purpose outside these categories.                                       |
| `unclear`         | The primary kind cannot be established.                                                          |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Returns one primary category. It does not create a ticket, extract multiple issues, or set a priority.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo feedback-kind` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe feedback-kind` shows the input and result schemas.
