# Detect a change of intent

<!-- BEGIN GENERATED: usage -->

How does message change currentGoal?

Use when: You need to check whether a new message changes the current task or goal.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { intentChange } from 'jev-recipes/intent-change';

const result = await intentChange({
  currentGoal: 'Draft a reply explaining password resets.',
  message: 'Keep it under three sentences.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo intent-change`.

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
  "verdict": "refines",
  "confidence": 0.96,
  "probabilities": {
    "continues": 0,
    "refines": 1,
    "replaces": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`cancellation-check`](../cancellation-check/README.md): Use cancellation-check for the narrower question of stopping, pausing, or continuing.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `currentGoal`   | Yes      | string                       |
| `message`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

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

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo intent-change` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe intent-change` shows the input and result schemas.
