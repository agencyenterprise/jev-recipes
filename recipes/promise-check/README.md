# Check reply commitments

<!-- BEGIN GENERATED: usage -->

Does reply promise actions or outcomes beyond allowedCommitments?

Use when: You need to catch commitments in a reply that exceed what is allowed.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { promiseCheck } from 'jev-recipes/promise-check';

const result = await promiseCheck({
  reply: 'Your refund is guaranteed.',
  allowedCommitments: 'We may promise to review a refund request. We cannot promise approval.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo promise-check`.

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
  "verdict": "unsupported",
  "confidence": 0.96,
  "probabilities": {
    "within_commitments": 0,
    "unsupported": 1,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`action-scope`](../action-scope/README.md): Use action-scope to check a proposed action against the requested work.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field                | Required | Shape                        |
| -------------------- | -------- | ---------------------------- |
| `reply`              | Yes      | string                       |
| `allowedCommitments` | Yes      | string                       |
| `minConfidence`      | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict              | Meaning                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `within_commitments` | Every promise is permitted by the supplied commitments, or the reply contains no promise. |
| `unsupported`        | At least one promise exceeds or contradicts the supplied commitments.                     |
| `unclear`            | The wording or allowed commitments leave a promise ambiguous.                             |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

**Current mixed-source measurement; experimental.**

Measured on 102 golden cases against `jev-1.13.0`: **96% accurate** overall (contested cases 67%, adversarial cases 100%).

Recorded 2026-10-04 with package 0.9.12, on the **development** split. Recipe fingerprint: `49ee0d45f1abd476d39302edeeb80b4e9cf47a46f82642872688fc03f45497fe`.

Scoring revision: 2.

98/102 cases correct; 93 ready, 9 review, 0 failed. Accuracy among ready cases: 100%.

Latency: p50 97.11 ms, p95 132.29 ms. Usage: 47940 input tokens and 4440 output tokens across 102 logical requests.

Labels: unspecified (42 cases): Existing repository labels; independent review and original authorship were not recorded. author-synthetic (60 cases): AI-authored synthetic boundary cases for jev-recipes; labels have not had independent human review.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 90% to 98%.

| `minConfidence` | Deferred to review | Accuracy of ready results |
| --------------- | ------------------ | ------------------------- |
| 0.5             | 3%                 | 98%                       |
| 0.6             | 4%                 | 98%                       |
| 0.7             | 7%                 | 99%                       |
| 0.8             | 9%                 | 100%                      |
| 0.9             | 11%                | 100%                      |
| 0.95            | 16%                | 100%                      |

The lowest threshold reaching 95% accuracy on ready results is 0.5.

Run `npm run eval -- promise-check` to save new results and update this guide. The full report, including misses, is in [evals/results/promise-check.json](../../evals/results/promise-check.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Reviews expressed promises. It does not approve refunds, establish contractual obligations, or execute actions.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo promise-check` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe promise-check` shows the input and result schemas.
