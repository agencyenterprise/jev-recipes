# Recognize requested follow-up timing

<!-- BEGIN GENERATED: usage -->

When does the sender want another contact, if any?

Use when: You need to distinguish immediate contact, a later time, an event condition, and no follow-up request.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { followupTiming } from 'jev-recipes/followup-timing';

const result = await followupTiming({
  message: 'Please check back after our finance team approves the budget.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo followup-timing`.

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
  "verdict": "after_event",
  "confidence": 0.93,
  "probabilities": {
    "now": 0.01,
    "later": 0.02,
    "after_event": 0.93,
    "not_requested": 0.01,
    "declined": 0.01,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`response-needed`](../response-needed/README.md): Use response-needed to decide whether the current message needs a reply.
- [`contact-opt-out`](../contact-opt-out/README.md): Use contact-opt-out for the scope of a request to stop future contact.
- [`callback-responsibility`](../callback-responsibility/README.md): Use callback-responsibility to identify who should initiate a call.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `message`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

The verdict is now, later, after_event, not_requested, declined, or unclear. An unclear verdict always requires review. Dates, deadlines, event subscriptions, and dispatch remain application code.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

Does not extract dates, time zones, or event identifiers and does not schedule contact. A timing request does not override stored contact preferences or establish permission to contact. Missing references, unresolved alternatives, and conflicting timing instructions require review.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo followup-timing` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe followup-timing` to inspect the input and result schemas.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

Measured on 40 golden cases against `jev-1.13.0`: **100% accurate** overall (contested cases 100%, adversarial cases 100%).

Recorded 2026-09-27 with package 0.7.0, on the **held-out** split. Recipe fingerprint: `4866c46f354ce9b8856fe256afca3700a757a07e3bdf69be816718bd9dbbeca3`.

40/40 cases correct; 37 ready, 3 review, 0 failed. Accuracy among ready cases: 100%.

Latency: p50 110.68 ms, p95 137.93 ms. Usage: 25044 input tokens and 2540 output tokens across 40 logical requests.

Labels: author-synthetic (40 cases): AI-authored synthetic boundary cases for jev-recipes; labels have not had independent human review.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 91% to 100%.

**Measured on these synthetic cases.**

Evaluated with the policy frozen on development data: minConfidence 0.8. No threshold search was performed on held-out cases.

Run `npm run eval -- followup-timing` to save new results and update this guide. The full report, including misses, is in [evals/results/followup-timing.json](../../evals/results/followup-timing.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->
