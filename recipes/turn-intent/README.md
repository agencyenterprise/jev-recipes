# Identify a conversation turn

What is the primary communicative purpose of message in context? For mixed messages choose the purpose that changes what the application should do next; choose unclear if none dominates.

```ts
import { turnIntent } from 'jev-recipes/turn-intent';

const result = await turnIntent({
  message: 'Actually, use the staging account, not production.',
  context: 'The assistant is preparing a deployment.',
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

| Verdict          | Meaning                                                                     |
| ---------------- | --------------------------------------------------------------------------- |
| `request`        | The message asks for new work or information.                               |
| `answer`         | The message supplies information requested earlier.                         |
| `correction`     | The message corrects a prior fact or instruction.                           |
| `cancellation`   | The message asks to stop or pause an existing task.                         |
| `acknowledgment` | The message acknowledges prior content without requesting substantive work. |
| `other`          | The purpose is clear but does not fit the listed purposes.                  |
| `unclear`        | The primary purpose cannot be established.                                  |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Returns the primary purpose only. It does not split a message into separate requests or execute instructions.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo turn-intent` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe turn-intent` shows the input and result schemas.
