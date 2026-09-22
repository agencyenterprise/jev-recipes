# Check cancellation intent

<!-- BEGIN GENERATED: usage -->

Does message ask to cancel, pause, or continue task?

Use when: You need to detect whether a message asks to stop, pause, or continue a task.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { cancellationCheck } from 'jev-recipes/cancellation-check';

const result = await cancellationCheck({
  task: 'Draft a response to the customer.',
  message: 'Hold off until I send you the updated policy.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo cancellation-check`.

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
  "verdict": "pause",
  "confidence": 0.96,
  "probabilities": {
    "cancel": 0,
    "pause": 1,
    "continue": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`intent-change`](../intent-change/README.md): Use intent-change to assess broader changes to the current goal.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `task`          | Yes      | string                       |
| `message`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict    | Meaning                                                                         |
| ---------- | ------------------------------------------------------------------------------- |
| `cancel`   | The message clearly asks to abandon this task.                                  |
| `pause`    | The message clearly asks to suspend this task temporarily.                      |
| `continue` | The message clearly asks to proceed with this task.                             |
| `unclear`  | The message does not clearly establish one of these instructions for this task. |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Does not stop running work or infer permission to continue from silence. The caller applies the decision.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo cancellation-check` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe cancellation-check` shows the input and result schemas.
