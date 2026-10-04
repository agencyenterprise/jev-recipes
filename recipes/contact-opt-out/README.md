# Recognize a contact opt-out

<!-- BEGIN GENERATED: usage -->

What scope of future contact does the sender ask to stop?

Use when: You need to distinguish stopping all contact from stopping a channel or campaign.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { contactOptOut } from 'jev-recipes/contact-opt-out';

const result = await contactOptOut({
  message: 'Please stop texting me. Email about my open support case is fine.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo contact-opt-out`.

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
  "verdict": "channel",
  "confidence": 0.95,
  "probabilities": {
    "all_contact": 0.01,
    "channel": 0.95,
    "campaign": 0.01,
    "none": 0.01,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`cancellation-check`](../cancellation-check/README.md): Use cancellation-check for cancelling a product or service, rather than future contact.
- [`buying-intent`](../buying-intent/README.md): Use buying-intent for purchase interest. Declining an offer alone does not establish an opt-out.
- [`followup-timing`](../followup-timing/README.md): Use followup-timing for a requested delay or condition for future contact.

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

The verdict identifies the expressed scope: all_contact, channel, campaign, none, or unclear. An unclear verdict always requires review. Keep the original message when applying a scoped change; this result does not name the affected channel or campaign.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

This is a language decision, not a consent registry. Never treat none as permission to send a message. Respect stored preferences and map explicit restrictions to application-owned subscription identifiers.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo contact-opt-out` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe contact-opt-out` to inspect the input and result schemas.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

Measured on 60 golden cases against `jev-1.13.0`: **100% accurate** overall (contested cases 100%).

Recorded 2026-10-04 with package 0.9.11, on the **development** split. Recipe fingerprint: `cf942449ed8153c6445d9bf776146328e9d17bffef15889a4280357e0e83d640`.

Scoring revision: 2.

60/60 cases correct; 50 ready, 10 review, 0 failed. Accuracy among ready cases: 100%.

Latency: p50 105.35 ms, p95 144.22 ms. Usage: 37041 input tokens and 3261 output tokens across 60 logical requests.

Labels: author-synthetic (60 cases): AI-authored synthetic boundary cases for jev-recipes; labels have not had independent human review.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 94% to 100%.

| `minConfidence` | Deferred to review | Accuracy of ready results |
| --------------- | ------------------ | ------------------------- |
| 0.5             | 10%                | 100%                      |
| 0.6             | 12%                | 100%                      |
| 0.7             | 13%                | 100%                      |
| 0.8             | 17%                | 100%                      |
| 0.9             | 20%                | 100%                      |
| 0.95            | 27%                | 100%                      |

The lowest threshold reaching 95% accuracy on ready results is 0.5.

Run `npm run eval -- contact-opt-out` to save new results and update this guide. The full report, including misses, is in [evals/results/contact-opt-out.json](../../evals/results/contact-opt-out.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->
