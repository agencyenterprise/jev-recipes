# Check tool result usefulness

<!-- BEGIN GENERATED: usage -->

Does result provide information useful for task?

Use when: You need to assess whether a tool result provides useful information for a task.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { resultUsefulness } from 'jev-recipes/result-usefulness';

const result = await resultUsefulness({
  task: 'Find password reset instructions.',
  result: 'Search completed successfully. No matching documents were found.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo result-usefulness`.

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
  "verdict": "no_useful_information",
  "confidence": 0.96,
  "probabilities": {
    "useful": 0,
    "no_useful_information": 1,
    "irrelevant": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`result-outcome`](../result-outcome/README.md): Use result-outcome to classify the reported outcome rather than its usefulness.

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

| Verdict                 | Meaning                                                                           |
| ----------------------- | --------------------------------------------------------------------------------- |
| `useful`                | The response contains substantive information useful for the task.                |
| `no_useful_information` | The response reports no results, an inability to help, or only empty boilerplate. |
| `irrelevant`            | The response contains substantive information about a different task or subject.  |
| `unclear`               | The response cannot be interpreted well enough to assess usefulness.              |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses response content, not transport success or source truth. Handle empty bodies and status codes in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo result-usefulness` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe result-usefulness` shows the input and result schemas.
