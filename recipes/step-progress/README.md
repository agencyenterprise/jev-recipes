# Check step progress

<!-- BEGIN GENERATED: usage -->

How does observation change progress toward objective relative to previousState?

Use when: You need to compare a new observation with the previous state of a task.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { stepProgress } from 'jev-recipes/step-progress';

const result = await stepProgress({
  objective: 'Find the password reset documentation.',
  previousState: 'No relevant page has been identified.',
  observation: 'The search returned the official password reset guide.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo step-progress`.

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
  "verdict": "progress",
  "confidence": 0.96,
  "probabilities": {
    "progress": 1,
    "no_progress": 0,
    "setback": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`step-complete`](../step-complete/README.md): Use step-complete to check whether the completion condition has been met.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `objective`     | Yes      | string                       |
| `previousState` | Yes      | string                       |
| `observation`   | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict       | Meaning                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------- |
| `progress`    | The observation establishes a useful new fact or achieved condition toward the objective.      |
| `no_progress` | The observation leaves the relevant state essentially unchanged.                               |
| `setback`     | The observation establishes loss of previously achieved progress or a worsened relevant state. |
| `unclear`     | The change in progress cannot be determined.                                                   |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Compares one observation with a supplied prior state. It does not measure elapsed time or schedule the next step.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo step-progress` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe step-progress` shows the input and result schemas.
