# Identify who should initiate a callback

<!-- BEGIN GENERATED: usage -->

Which party is expected to initiate the next call?

Use when: You need to decide whether the business or customer is expected to initiate the next call.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { callbackResponsibility } from 'jev-recipes/callback-responsibility';

const result = await callbackResponsibility({
  conversation:
    'Avery: I will call you when the replacement arrives. Sam: Thanks, I will wait for your call.',
  roles: 'Avery is the business representative. Sam is the customer.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo callback-responsibility`.

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
  "verdict": "business",
  "confidence": 0.94,
  "probabilities": {
    "business": 0.94,
    "customer": 0.01,
    "either": 0.01,
    "none": 0.01,
    "unclear": 0.03
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`promise-check`](../promise-check/README.md): Use promise-check to check whether a draft introduces an unsupported commitment.
- [`commitment-strength`](../commitment-strength/README.md): Use commitment-strength to grade how firmly a statement commits its speaker.
- [`followup-timing`](../followup-timing/README.md): Use followup-timing for when another contact is wanted.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `conversation`  | Yes      | string                       |
| `roles`         | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

The verdict identifies business, customer, either, none, or unclear. An unclear verdict always requires review. A business result describes the exchange; it does not authorize a new promise or place a call.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

Requires speaker roles. Does not infer identities from names or assume every agent speaks for the business. Only identifies initiation of a future call, including a conditional call. Does not assign general task ownership or verify the call occurred. An unaccepted suggestion, contradictory exchange, or unresolved pronoun requires review.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo callback-responsibility` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe callback-responsibility` to inspect the input and result schemas.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

**Earlier-evaluator measurement; experimental.**

Measured on 40 golden cases against `jev-1.13.0`: **98% accurate** overall (contested cases 100%).

Recorded 2026-09-27 with package 0.7.0, on the **held-out** split. Recipe fingerprint: `e3afba589f57bf106ce32a86e6d6dd3eb7d42c3c7f43a4e659330e8368a2cad6`.

Scoring revision: 1.

39/40 cases correct; 24 ready, 16 review, 0 failed. Accuracy among ready cases: 100%.

Latency: p50 112.84 ms, p95 164.19 ms. Usage: 27344 input tokens and 2133 output tokens across 40 logical requests.

Labels: author-synthetic (40 cases): AI-authored synthetic boundary cases for jev-recipes; labels have not had independent human review.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 87% to 100%.

**Measured on these synthetic cases.**

Evaluated with the policy frozen on development data: minConfidence 0.8. No threshold search was performed on held-out cases.

Run `npm run eval -- callback-responsibility` to save new results and update this guide. The full report, including misses, is in [evals/results/callback-responsibility.json](../../evals/results/callback-responsibility.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->
