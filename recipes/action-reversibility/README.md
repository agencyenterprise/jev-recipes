# Grade action reversibility

<!-- BEGIN GENERATED: usage -->

How reversible is action, given any context, from a trivial undo to an irreversible external effect?

Use when: You need to decide whether an agent may proceed on its own or must pause for approval before a step that cannot be taken back.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { actionReversibility } from 'jev-recipes/action-reversibility';

const result = await actionReversibility({
  action:
    'Send the drafted outage apology email to the 1,200 customers on the affected-accounts list.',
  context:
    'The draft has been approved. The send goes through the marketing platform, which has no recall feature once a campaign is dispatched.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo action-reversibility`.

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
  "score": 3.85,
  "level": 4,
  "confidence": 0.89,
  "probabilities": {
    "0": 0,
    "1": 0.01,
    "2": 0.02,
    "3": 0.08,
    "4": 0.89
  },
  "reversibility": "irreversible"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`action-scope`](../action-scope/README.md): Use action-scope to check whether the action stays within the requested work before grading how reversible it is.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `action`        | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

`reversibility` is one of `trivial`, `effortful`, `partial`, `practical`, or `irreversible`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it to set an approval threshold or to order pending actions by how much care they need.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values. `probabilities` is keyed by level index.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

**Current measurement; labels unspecified; experimental.**

Measured on 44 golden cases against `jev-1.13.0`: **89% accurate** overall (contested cases 60%, adversarial cases 60%).

Recorded 2026-10-04 with package 0.9.11, on the **development** split. Recipe fingerprint: `1725aabfba04f76bbd33199de824e59997c8ab4750feef1ba71b221ff775c4a0`.

Scoring revision: 2.

39/44 cases correct; 20 ready, 24 review, 0 failed. Accuracy among ready cases: 100%.

Latency: p50 112.1 ms, p95 166.27 ms. Usage: 25554 input tokens and 748 output tokens across 44 logical requests.

Labels: unspecified (44 cases): Not recorded by the dataset author.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 76% to 95%.

| `minConfidence` | Deferred to review | Accuracy of ready results |
| --------------- | ------------------ | ------------------------- |
| 0.5             | 16%                | 95%                       |
| 0.6             | 23%                | 97%                       |
| 0.7             | 39%                | 100%                      |
| 0.8             | 55%                | 100%                      |
| 0.9             | 61%                | 100%                      |
| 0.95            | 71%                | 100%                      |

The lowest threshold reaching 95% accuracy on ready results is 0.55.

Run `npm run eval -- action-reversibility` to save new results and update this guide. The full report, including misses, is in [evals/results/action-reversibility.json](../../evals/results/action-reversibility.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->

## Reuse and calls

Uses the shared score helper. This folder owns the reversibility question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade describes the action as written. It does not know which undo, backup, or recall facilities your system provides, so supply them in `context` when they change the answer. Reversibility is not permission: an irreversible action may be exactly what was asked for, and a trivially reversible one may still be out of scope, which [`action-scope`](../action-scope/README.md) checks. Application code decides which levels proceed automatically and which wait for approval.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo action-reversibility` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe action-reversibility` to inspect the input and result schemas.
