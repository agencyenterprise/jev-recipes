# Decide whether to retry

<!-- BEGIN GENERATED: usage -->

Does failure describe a transient condition where an identical retry could succeed, given any attempt history?

Use when: You need a yes/no decision after a tool call or request fails and the error text, not a status code, is the only signal you have.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { retryWorthwhile } from 'jev-recipes/retry-worthwhile';

const result = await retryWorthwhile({
  failure: 'HTTP 429 Too Many Requests: rate limit exceeded for this API key. Retry-After: 30.',
  attempt:
    'First attempt, issued immediately after a batch of 50 similar calls to the same endpoint.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo retry-worthwhile`.

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
  "probability": 0.95,
  "confidence": 0.95,
  "verdict": "retry"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`failure-kind`](../failure-kind/README.md): Use failure-kind to place the failure in one of your own categories when you need more than a retry or stop answer.
- [`repeated-attempt`](../repeated-attempt/README.md): Use repeated-attempt to check whether a proposed next attempt is really a fresh approach rather than the same one again.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `failure`       | Yes      | string                       |
| `attempt`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `attempt` is optional and is omitted from the request when absent.

## Result

`verdict` is `retry` when Jev's yes probability is at least 0.5 and `stop` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `stop` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default, such as a single bounded retry or surfacing the failure to the user.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe reads the failure as text and asks only whether repeating the same attempt could succeed. It does not know your retry budget, backoff policy, or whether the action is idempotent, and it does not say whether a modified attempt with corrected input or permissions would work. Supply prior attempts in `attempt` so repeated identical failures lower the answer. Use [`failure-kind`](../failure-kind/README.md) to sort failures into your own categories and [`repeated-attempt`](../repeated-attempt/README.md) to check that a proposed next try is actually different.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo retry-worthwhile` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe retry-worthwhile` to inspect the input and result schemas.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

**Earlier-evaluator measurement; experimental.**

Measured on 40 golden cases against `jev-1.13.0`: **100% accurate** overall.

Recorded 2026-09-27 with package 0.7.0, on the **held-out** split. Recipe fingerprint: `4325f3b69b7412e092d660cb8a88b35faf53642a1310dff64aabd0557ca88f46`.

Scoring revision: 1.

40/40 cases correct; 39 ready, 1 review, 0 failed. Accuracy among ready cases: 100%.

Latency: p50 109 ms, p95 136.32 ms. Usage: 18828 input tokens and 800 output tokens across 40 logical requests.

Labels: author-synthetic (40 cases): AI-authored synthetic boundary cases for jev-recipes; labels have not had independent human review.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 91% to 100%.

**Measured on these synthetic cases.**

Evaluated with the policy frozen on development data: minConfidence 0.8. No threshold search was performed on held-out cases.

Run `npm run eval -- retry-worthwhile` to save new results and update this guide. The full report, including misses, is in [evals/results/retry-worthwhile.json](../../evals/results/retry-worthwhile.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->
