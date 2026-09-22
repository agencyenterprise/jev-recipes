# Interpret a reported tool outcome

<!-- BEGIN GENERATED: usage -->

What outcome does result report for task?

Use when: You need to classify what a tool result reports happened during a task.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { resultOutcome } from 'jev-recipes/result-outcome';

const result = await resultOutcome({
  task: 'Export the customer report.',
  result: 'The export could not be created because the account lacks export access.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo result-outcome`.

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
  "verdict": "failure",
  "confidence": 0.96,
  "probabilities": {
    "success": 0,
    "partial_success": 0,
    "failure": 1,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`step-progress`](../step-progress/README.md): Use step-progress to compare an observation with the previous state.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `task`          | Yes      | string                       |
| `result`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                              |
| ----------------- | ------------------------------------------------------------------------------------ |
| `success`         | The response explicitly reports the full requested task completed.                   |
| `partial_success` | The response reports some requested work completed and some unfinished.              |
| `failure`         | The response explicitly reports the requested work failed or could not be performed. |
| `unclear`         | The response does not establish a task outcome.                                      |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Interprets a report; it does not independently confirm an external action occurred. Prefer structured result fields when available.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo result-outcome` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe result-outcome` shows the input and result schemas.
