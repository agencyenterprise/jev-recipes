# Label a response's stance toward a claim

<!-- BEGIN GENERATED: usage -->

Label whether a response affirms, denies, mixes positions on, or does not address a supplied claim.

Use when: You need to label whether a response agrees or disagrees with a claim, including in AI alignment research.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { claimStance } from 'jev-recipes/claim-stance';

const result = await claimStance({
  claim: 'The report says all tests passed.',
  response: 'No. The report lists two failing tests.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo claim-stance`.

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
  "verdict": "denies",
  "confidence": 0.96,
  "probabilities": {
    "affirms": 0.01,
    "denies": 0.96,
    "mixed": 0.01,
    "not_addressed": 0.01,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`verify`](../verify/README.md): Use verify to check whether a claim is supported by evidence; stance does not establish truth.
- [`answer-consistency`](../answer-consistency/README.md): Use answer-consistency to compare the compatibility of two statements.
- [`draft-compare`](../draft-compare/README.md): Use draft-compare for a preference between two responses under a supplied rubric.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `claim`         | Yes      | string                       |
| `response`      | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Supply non-empty text for each required field. Optional `context` must also be non-empty when supplied. `minConfidence` defaults to `0.8` and accepts values from `0` to `1`.

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict         | Meaning                                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `affirms`       | The response commits to the supplied claim being true, without an unreconciled denial.                                        |
| `denies`        | The response commits to the supplied claim being false, without an unreconciled affirmation.                                  |
| `mixed`         | The response both affirms and denies the same claim under the same conditions without resolving the conflict.                 |
| `not_addressed` | The response expresses no position on the claim; a mere quotation, attributed statement, or acknowledgment is not a position. |
| `unclear`       | The response expresses uncertainty or its wording and references do not resolve its position.                                 |

The result has `status: 'ready'` when confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it has `status: 'review'`. An `unclear` verdict always requires review, even at high confidence or with a zero threshold. `ready` describes confidence in the assessment, not approval to act.

## Decision boundaries

These cases document the intended decision policy. They are not live model evaluation results.

| Supplied situation                                                                                              | Intended verdict |
| --------------------------------------------------------------------------------------------------------------- | ---------------- |
| Claim: all tests passed. Response: "Yes, every test passed."                                                    | `affirms`        |
| Claim: all tests passed. Response: "No, two tests failed."                                                      | `denies`         |
| Claim: all tests passed. Response: "All tests passed, and two of those same tests failed" without a correction. | `mixed`          |
| Claim: all tests passed. Response: "The user wrote: all tests passed" with no endorsement.                      | `not_addressed`  |
| Claim: all tests passed. Response: "Thanks for explaining your view."                                           | `not_addressed`  |
| Claim: all tests passed. Response: "I cannot tell whether they all passed."                                     | `unclear`        |
| Claim: all tests passed. Response: "I said they all passed, but that was incorrect. Two failed."                | `denies`         |

## Reuse

This labels how a response treats a supplied proposition. Combine it with separate evidence and experimental conditions when studying agreement, belief pressure, or response changes. See the [AI alignment research guide](../../docs/ai-alignment-research.md).

Uses the shared choice helper and makes one logical Jev request. It does not call another recipe or perform application actions.

## Limits

- Labels only the expressed stance toward one supplied claim. It does not infer beliefs, intention, deception, or alignment from text.
- A single agreement label does not establish sycophancy. Research use requires controlled comparisons and independent validation of the labels.
