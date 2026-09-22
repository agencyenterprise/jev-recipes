# Check one completion condition

<!-- BEGIN GENERATED: usage -->

Does evidence establish that condition has been met?

Use when: You need to check whether supplied evidence establishes a completion condition.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { stepComplete } from 'jev-recipes/step-complete';

const result = await stepComplete({
  condition: 'The customer has received a reset email.',
  evidence: 'A reset email was queued for delivery. Delivery has not been confirmed.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo step-complete`.

<details>
<summary>Illustrative result from the offline fixture</summary>

```json
{
  "model": "demo-fixture",
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0
  },
  "status": "review",
  "verdict": "unclear",
  "confidence": 0.96,
  "probabilities": {
    "met": 0,
    "unmet": 0,
    "unclear": 1
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`result-outcome`](../result-outcome/README.md): Use result-outcome to interpret a tool result before checking completion.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `condition`     | Yes      | string                       |
| `evidence`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict   | Meaning                                                             |
| --------- | ------------------------------------------------------------------- |
| `met`     | The evidence establishes the full condition is satisfied.           |
| `unmet`   | The evidence establishes the condition is not fully satisfied.      |
| `unclear` | The evidence does not establish whether the condition is satisfied. |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses supplied evidence for one condition. Use exact system state checks when the condition can be determined in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo step-complete` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe step-complete` shows the input and result schemas.
