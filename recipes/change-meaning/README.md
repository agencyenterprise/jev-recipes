# Assess a text revision

<!-- BEGIN GENERATED: usage -->

Does the revision from before to after change material meaning, conditions, or obligations?

Use when: You need to know whether a revision changes material meaning or obligations.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { changeMeaning } from 'jev-recipes/change-meaning';

const result = await changeMeaning({
  before: 'Guests may export reports.',
  after: 'Only workspace owners may export reports.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo change-meaning`.

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
  "verdict": "meaning_changed",
  "confidence": 0.96,
  "probabilities": {
    "meaning_changed": 1,
    "editorial_only": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`answer-invalidation`](../answer-invalidation/README.md): Use answer-invalidation to assess how changed evidence affects a saved claim.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `before`        | Yes      | string                       |
| `after`         | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                                               |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| `meaning_changed` | The revision changes a material fact, condition, instruction, or implication.                         |
| `editorial_only`  | The revision preserves material meaning and changes only wording or presentation, or makes no change. |
| `unclear`         | The material effect cannot be determined from the supplied text.                                      |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Compares supplied passages. It does not parse a repository diff or perform exact numeric and date comparisons.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo change-meaning` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe change-meaning` shows the input and result schemas.
