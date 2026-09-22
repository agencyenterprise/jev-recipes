# Detect a topic shift

Does message stay with currentTopic, introduce a different topic, or contain both? A new detail within the same subject is not automatically a new topic.

```ts
import { topicShift } from 'jev-recipes/topic-shift';

const result = await topicShift({
  currentTopic: 'Resetting a password.',
  message: 'Also, where can I download my invoices?',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `currentTopic`  | Non-empty text                               |
| `message`       | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict      | Meaning                                                                 |
| ------------ | ----------------------------------------------------------------------- |
| `same_topic` | The message remains within the current subject.                         |
| `new_topic`  | The message moves to a different subject.                               |
| `mixed`      | The message substantively addresses both the current and a new subject. |
| `unclear`    | The subject relationship cannot be resolved.                            |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Compares one message with a supplied topic. It does not generate topic labels or split conversation threads.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo topic-shift` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe topic-shift` shows the input and result schemas.
