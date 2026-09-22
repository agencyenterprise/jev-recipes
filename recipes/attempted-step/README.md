# Check a previously attempted step

<!-- BEGIN GENERATED: usage -->

Does conversation establish whether the customer already performed step?

Use when: You need to know whether a customer already tried a troubleshooting step.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { attemptedStep } from 'jev-recipes/attempted-step';

const result = await attemptedStep({
  step: 'Clear the browser cache and try again.',
  conversation: 'I already cleared my browser cache and tried again. The error is still there.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo attempted-step`.

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
  "verdict": "tried",
  "confidence": 0.96,
  "probabilities": {
    "tried": 1,
    "not_tried": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`troubleshooting-fit`](../troubleshooting-fit/README.md): Use troubleshooting-fit to check whether the procedure fits the symptoms.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `step`          | Yes      | string                       |
| `conversation`  | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict     | Meaning                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------- |
| `tried`     | The conversation explicitly states or unambiguously reports that this step was performed. |
| `not_tried` | The conversation explicitly establishes the step has not been performed.                  |
| `unclear`   | There is no reliable statement of whether the step was performed.                         |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Interprets reports of an attempt. It does not verify that the step was completed correctly or repeat the action.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo attempted-step` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe attempted-step` shows the input and result schemas.
