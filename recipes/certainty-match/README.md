# Check certainty wording

<!-- BEGIN GENERATED: usage -->

Does the certainty expressed in draft match assessment?

Use when: You want the wording of a draft to reflect the certainty of an assessment.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { certaintyMatch } from 'jev-recipes/certainty-match';

const result = await certaintyMatch({
  draft: 'The outage was definitely caused by the deploy.',
  assessment: 'The deploy is one possible cause; the cause has not been established.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo certainty-match`.

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
  "verdict": "overstated",
  "confidence": 0.96,
  "probabilities": {
    "overstated": 1,
    "appropriate": 0,
    "understated": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`tone-check`](../tone-check/README.md): Use tone-check to evaluate other explicit writing criteria.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `draft`         | Yes      | string                       |
| `assessment`    | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict       | Meaning                                                                       |
| ------------- | ----------------------------------------------------------------------------- |
| `overstated`  | The draft expresses stronger certainty than the assessment supports.          |
| `appropriate` | The draft expresses a degree of certainty consistent with the assessment.     |
| `understated` | The draft expresses materially weaker certainty than the assessment supports. |
| `unclear`     | The certainty levels cannot be compared from the supplied wording.            |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Compares wording with a supplied assessment. It does not calibrate probabilities or establish the assessment itself.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo certainty-match` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe certainty-match` shows the input and result schemas.
