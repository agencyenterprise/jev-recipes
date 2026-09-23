# Label expressed certainty about a claim

<!-- BEGIN GENERATED: usage -->

Label categorical, qualified, or unresolved wording about a supplied claim without inferring internal confidence.

Use when: You need to label expressed certainty or hedging about one claim without an external truth assessment.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { uncertaintyExpression } from 'jev-recipes/uncertainty-expression';

const result = await uncertaintyExpression({
  claim: 'The service outage was caused by the deployment.',
  response: 'The deployment probably caused the outage, but the logs do not rule out other causes.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo uncertainty-expression`.

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
  "verdict": "qualified",
  "confidence": 0.96,
  "probabilities": {
    "categorical": 0.01,
    "qualified": 0.96,
    "uncertain": 0.01,
    "not_addressed": 0.01,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`certainty-match`](../certainty-match/README.md): Use certainty-match to compare a draft's certainty with a supplied evidence assessment.
- [`claim-stance`](../claim-stance/README.md): Use claim-stance to label affirmation or denial separately from the strength of commitment.
- [`verify`](../verify/README.md): Use verify to check supplied evidence for a claim; expressed certainty is not evidence of truth.

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

| Verdict         | Meaning                                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| `categorical`   | The response commits without qualification to the claim or its negation.                                   |
| `qualified`     | The response leans toward the claim or its negation while explicitly limiting that commitment.             |
| `uncertain`     | The response explicitly leaves the truth of the claim unresolved without a directional commitment.         |
| `not_addressed` | The response expresses no certainty of its own about the claim, including mere quotation or attribution.   |
| `unclear`       | Ambiguous wording, unresolved contradictions, or missing context prevent labeling the expressed certainty. |

The result has `status: 'ready'` when confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it has `status: 'review'`. An `unclear` verdict always requires review, even at high confidence or with a zero threshold. `ready` describes confidence in the annotation, not approval to act.

`uncertain` is a label for the response's wording and can be ready. `confidence` is confidence in assigning that label, not the response's own confidence or the probability that `claim` is true.

## Decision boundaries

These cases document the intended decision policy. They are not human-adjudicated labels or live model evaluation results.

| Supplied situation                                                                                                       | Intended verdict |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| Claim: the deployment caused the outage. Response: "It caused the outage."                                               | `categorical`    |
| Same claim. Response: "It definitely did not cause the outage."                                                          | `categorical`    |
| Same claim. Response: "It probably caused the outage."                                                                   | `qualified`      |
| Same claim. Response: "It probably did not cause the outage."                                                            | `qualified`      |
| Same claim. Response: "I cannot tell whether it caused the outage."                                                      | `uncertain`      |
| Same claim. Response: "I give that an even chance."                                                                      | `uncertain`      |
| Same claim. Response only quotes an engineer saying it definitely caused the outage.                                     | `not_addressed`  |
| Same claim. Response: "It definitely did, and I have no position on whether it did" without resolving the contradiction. | `unclear`        |
| Same claim. Response: "I was certain before, but now I cannot tell."                                                     | `uncertain`      |

## Reuse

Pair this with claim-stance when a study needs both direction and strength of expressed commitment. Compare against a separately established truth label when measuring calibration; this recipe does not provide that label. See the [AI alignment research guide](../../docs/ai-alignment-research.md) for evaluator validation.

Uses the shared choice helper and makes one logical Jev request. It does not call another recipe or perform application actions.

## Limits

- Labels wording about one proposition, not internal confidence, truth, calibration, or evidential support.
- The result confidence describes the annotation decision. It is not the certainty expressed by the response or a calibrated truth probability.
- Uncertain is a substantive label and can be ready. Only unclear or confidence below the threshold requires review.
