# Check what a question takes for granted

<!-- BEGIN GENERATED: usage -->

Label whether a question takes a supplied claim for granted or leaves that claim open.

Use when: You need to identify a specific assumption in a question before using it in a conversation, survey, or evaluation.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { questionAssumption } from 'jev-recipes/question-assumption';

const result = await questionAssumption({
  question: 'Why did you delete the file?',
  claim: 'You deleted the file.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo question-assumption`.

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
  "verdict": "assumed",
  "confidence": 0.98,
  "probabilities": {
    "assumed": 0.98,
    "not_assumed": 0.01,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`question-leading`](../question-leading/README.md): Use question-leading to check pressure toward or away from an answer, which is different from assuming a claim.
- [`claim-stance`](../claim-stance/README.md): Use claim-stance to label affirmation or denial of a claim in a response.
- [`verify`](../verify/README.md): Use verify to assess evidential support for the claim itself.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `question`      | Yes      | string                       |
| `claim`         | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Supply one `question`, including the framing the respondent sees, and one specific `claim`. Optional `context` can resolve references. Context supporting a claim does not by itself mean the question assumes that claim.

All supplied text must be non-empty. `minConfidence` defaults to `0.8` and accepts values from `0` to `1`. See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict       | Meaning                                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `assumed`     | The question or its visible framing treats the supplied claim as established.                                                     |
| `not_assumed` | The question leaves the claim open, supposes it conditionally, merely quotes it without adoption, or clearly does not concern it. |
| `unclear`     | Unresolved references, ambiguous scope, or conflicting framing prevent a decision.                                                |

The result has `status: 'ready'` when confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it has `status: 'review'`. An `unclear` verdict always requires review, even at full confidence and a zero threshold. `ready` describes the annotation, not whether the question is suitable for an experiment.

## Decision boundaries

These cases document the intended policy. They are not human-adjudicated labels or live model evaluation results.

| Question and supplied claim                                                              | Intended verdict |
| ---------------------------------------------------------------------------------------- | ---------------- |
| "Why did you delete the file?" Claim: you deleted the file.                              | `assumed`        |
| "Did you delete the file?" Same claim.                                                   | `not_assumed`    |
| "If you deleted the file, why?" Same claim.                                              | `not_assumed`    |
| "When, if at all, did you delete the file?" Same claim.                                  | `not_assumed`    |
| "You deleted the file. Was that accidental?" Same claim.                                 | `assumed`        |
| "I would prefer yes: did you delete the file?" Same claim.                               | `not_assumed`    |
| "Why did you not delete the file?" Claim: you deleted the file.                          | `not_assumed`    |
| "Why did you not delete the file?" Claim: you did not delete the file.                   | `assumed`        |
| "Is 'Why did you delete the file?' a loaded question?" Claim: you deleted the file.      | `not_assumed`    |
| "Did you delete the file?" Context says logs show deletion. Claim: you deleted the file. | `not_assumed`    |
| "What color is the logo?" Claim: you deleted the file.                                   | `not_assumed`    |
| "Why did they do it?" Claim: Alex deleted the file. Neither reference is resolved.       | `unclear`        |

## Reuse

Use this to flag a specified assumption in an interview question, survey, or evaluation prompt. [Question-leading](../question-leading/README.md) measures pressure toward an answer: a question can pressure agreement while still leaving the underlying claim open. [Verify](../verify/README.md) assesses supporting evidence for the claim itself.

For research use, validate labels against independent human annotations and compare response outcomes under controlled wording changes. See the [AI alignment research guide](../../docs/ai-alignment-research.md).

Uses the shared choice helper and makes one logical Jev request. It does not call another recipe or rewrite questions.

## Limits

- Checks one supplied claim; it does not discover every assumption in a question.
- A claim can be assumed and false, or left open and true. This recipe does not judge truth or author intent.
- `not_assumed` does not establish neutrality. Actual effects on responses require controlled comparisons.
