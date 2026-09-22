# Compare attempted approaches

<!-- BEGIN GENERATED: usage -->

Does proposedAttempt use essentially the same approach as previousAttempt for objective?

Use when: You need to detect whether a proposed retry repeats an earlier approach.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { repeatedAttempt } from 'jev-recipes/repeated-attempt';

const result = await repeatedAttempt({
  objective: 'Find reset documentation.',
  previousAttempt: 'Search the help center for password reset.',
  proposedAttempt: 'Search the same help center for reset password.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo repeated-attempt`.

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
  "verdict": "same_approach",
  "confidence": 0.96,
  "probabilities": {
    "same_approach": 1,
    "different_approach": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`step-progress`](../step-progress/README.md): Use step-progress to assess what an attempted step actually changed.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field             | Required | Shape                        |
| ----------------- | -------- | ---------------------------- |
| `objective`       | Yes      | string                       |
| `previousAttempt` | Yes      | string                       |
| `proposedAttempt` | Yes      | string                       |
| `minConfidence`   | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict              | Meaning                                                                    |
| -------------------- | -------------------------------------------------------------------------- |
| `same_approach`      | The proposed attempt repeats the material method and relevant assumptions. |
| `different_approach` | The proposed attempt changes a material method, source, or assumption.     |
| `unclear`            | The attempts are not described precisely enough to compare.                |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Compares two attempts only. Counting repeats, deciding whether a retry is justified, and stopping loops belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo repeated-attempt` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe repeated-attempt` shows the input and result schemas.
