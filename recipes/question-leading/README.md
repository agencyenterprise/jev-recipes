# Check whether a question steers an answer

<!-- BEGIN GENERATED: usage -->

Label whether a question's wording favors, disfavors, or stays neutral toward a proposed answer.

Use when: You need to check leading questions or answer pressure in a survey, interview, or evaluation prompt.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { questionLeading } from 'jev-recipes/question-leading';

const result = await questionLeading({
  question: "Surely you agree the new layout is easier to use, don't you?",
  proposedAnswer: 'The new layout is easier to use.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo question-leading`.

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
  "verdict": "favors",
  "confidence": 0.97,
  "probabilities": {
    "favors": 0.97,
    "disfavors": 0.01,
    "neutral": 0.01,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`query-specificity`](../query-specificity/README.md): Use query-specificity to check whether an information need is focused and unambiguous.
- [`claim-stance`](../claim-stance/README.md): Use claim-stance to label the response's expressed position after a question has been answered.
- [`tone-check`](../tone-check/README.md): Use tone-check to assess draft wording against caller-supplied writing criteria.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field            | Required | Shape                        |
| ---------------- | -------- | ---------------------------- |
| `question`       | Yes      | string                       |
| `proposedAnswer` | Yes      | string                       |
| `context`        | No       | string                       |
| `minConfidence`  | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Supply non-empty text for each required field. Optional `context` must also be non-empty when supplied. `minConfidence` defaults to `0.8` and accepts values from `0` to `1`.

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict     | Meaning                                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| `favors`    | The wording presupposes, rewards, or pressures agreement with the proposed answer.                          |
| `disfavors` | The wording dismisses, penalizes, or pressures rejection of the proposed answer.                            |
| `neutral`   | The question permits the proposed answer without discernible wording pressure toward or away from it.       |
| `unclear`   | Ambiguous or conflicting framing, an unrelated answer, or missing context prevents determining a direction. |

The result has `status: 'ready'` when confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it has `status: 'review'`. An `unclear` verdict always requires review, even at high confidence or with a zero threshold. `ready` describes confidence in the annotation, not approval to act.

## Decision boundaries

These cases document the intended decision policy. They are not human-adjudicated labels or live model evaluation results.

| Supplied situation                                                                                   | Intended verdict |
| ---------------------------------------------------------------------------------------------------- | ---------------- |
| Question: "Surely you agree the new layout is better?" Proposed answer: the new layout is better.    | `favors`         |
| Question: "You do not really believe the new layout is better, do you?" Same proposed answer.        | `disfavors`      |
| Question: "Is the new layout better, worse, or about the same?" Same proposed answer.                | `neutral`        |
| Question: "Is the deadline Friday?" Proposed answer: yes, the deadline is Friday.                    | `neutral`        |
| Question: "Only careless reviewers prefer the new layout. Do you prefer it?" Proposed answer: yes.   | `disfavors`      |
| Question: "The recorded deadline is Friday. What day does the record give?" Proposed answer: Friday. | `neutral`        |
| Question praises and condemns the same answer with no resolved direction.                            | `unclear`        |
| Question asks for a deadline; proposed answer discusses the color of a logo.                         | `unclear`        |

## Reuse

Use this to review evaluation prompts or survey questions before testing them. Hold the underlying task fixed and compare response outcomes across wording variants to measure effects. See the [AI alignment research guide](../../docs/ai-alignment-research.md) for evaluator validation.

Uses the shared choice helper and makes one logical Jev request. It does not call another recipe or perform application actions.

## Limits

- Labels directional wording relative to one proposed answer, not author intent, factual correctness, or observed persuasion.
- Neutral does not establish that a prompt or experiment is unbiased in every respect.
- Actual effects on model or human answers require controlled comparisons; wording labels alone are not causal evidence.
