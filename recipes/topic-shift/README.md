# Detect a topic shift

<!-- BEGIN GENERATED: usage -->

Does message stay with currentTopic, introduce a different topic, or contain both?

Use when: You need to detect whether a message moves away from the current topic.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { topicShift } from 'jev-recipes/topic-shift';

const result = await topicShift({
  currentTopic: 'Resetting a password.',
  message: 'Also, where can I download my invoices?',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo topic-shift`.

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
  "verdict": "new_topic",
  "confidence": 0.96,
  "probabilities": {
    "same_topic": 0,
    "new_topic": 1,
    "mixed": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`intent-change`](../intent-change/README.md): Use intent-change when the important question is whether the goal changed.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `currentTopic`  | Yes      | string                       |
| `message`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

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
