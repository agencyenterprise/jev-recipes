# Classify customer feedback

<!-- BEGIN GENERATED: usage -->

What is the primary kind of feedback in message?

Use when: You need to classify the kind of feedback expressed in a message.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { feedbackKind } from 'jev-recipes/feedback-kind';

const result = await feedbackKind({
  message: 'Could you add CSV export to the activity page?',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo feedback-kind`.

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
  "verdict": "feature_request",
  "confidence": 0.96,
  "probabilities": {
    "bug_report": 0,
    "feature_request": 1,
    "question": 0,
    "praise": 0,
    "complaint": 0,
    "other": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`turn-intent`](../turn-intent/README.md): Use turn-intent for the broader purpose of a conversational turn.

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
