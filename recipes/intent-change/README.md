# Detect a change of intent

How does message change currentGoal? Compare the intended outcome rather than surface wording. An added constraint refines a goal; asking for a different outcome replaces it.

```ts
import { intentChange } from 'jev-recipes/intent-change';

const result = await intentChange({
  currentGoal: 'Draft a reply explaining password resets.',
  message: 'Keep it under three sentences.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `currentGoal`   | Non-empty text                               |
| `message`       | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict     | Meaning                                                                    |
| ----------- | -------------------------------------------------------------------------- |
| `continues` | The message continues the same goal without a material change.             |
| `refines`   | The message adds or changes constraints while preserving the main outcome. |
| `replaces`  | The message asks for a different outcome in place of the current goal.     |
| `unclear`   | The relationship to the current goal cannot be resolved.                   |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Classifies a goal change. It does not rewrite the goal, alter a task queue, or measure exact requested limits.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo intent-change` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe intent-change` shows the input and result schemas.
