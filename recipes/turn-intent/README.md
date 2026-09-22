# Identify a conversation turn

<!-- BEGIN GENERATED: usage -->

What is the primary communicative purpose of message in context?

Use when: You need to classify a message as a request, answer, correction, cancellation, or acknowledgment.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { turnIntent } from 'jev-recipes/turn-intent';

const result = await turnIntent({
  message: 'Actually, use the staging account, not production.',
  context: 'The assistant is preparing a deployment.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo turn-intent`.

<details>
<summary>Illustrative result from the offline fixture</summary>

```json
{
  "model": "demo-fixture",
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0
  },
  "status": "ready",
  "verdict": "correction",
  "confidence": 0.96,
  "probabilities": {
    "request": 0,
    "answer": 0,
    "correction": 1,
    "cancellation": 0,
    "acknowledgment": 0,
    "other": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`intent-change`](../intent-change/README.md): Use intent-change to assess how the message changes an existing goal.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `message`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

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
