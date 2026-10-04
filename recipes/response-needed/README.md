# Check whether a reply is needed

<!-- BEGIN GENERATED: usage -->

Does message require a substantive reply in context?

Use when: You need to decide whether a message calls for a substantive reply.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { responseNeeded } from 'jev-recipes/response-needed';

const result = await responseNeeded({
  message: 'Thanks, that solved it!',
  context: 'The assistant provided password reset instructions.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo response-needed`.

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
  "verdict": "no_reply_needed",
  "confidence": 0.96,
  "probabilities": {
    "reply_needed": 0,
    "no_reply_needed": 1,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`turn-intent`](../turn-intent/README.md): Use turn-intent to classify the message purpose in more detail.

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

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                        |
| ----------------- | ------------------------------------------------------------------------------ |
| `reply_needed`    | The message requests or requires substantive follow-through.                   |
| `no_reply_needed` | The message closes or acknowledges the exchange without an unresolved request. |
| `unclear`         | The supplied context does not establish whether a response is expected.        |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses conversational need. Channel-specific response obligations and customer service policies remain application rules.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo response-needed` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe response-needed` shows the input and result schemas.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

**Current synthetic measurement; experimental.**

Measured on 60 golden cases against `jev-1.13.0`: **100% accurate** overall (adversarial cases 100%).

Recorded 2026-10-04 with package 0.9.11, on the **development** split. Recipe fingerprint: `accce497113821fcd870e3ebd3806c7cbe214d13e3a6ca96544043ab52b168b6`.

Scoring revision: 2.

60/60 cases correct; 60 ready, 0 review, 0 failed. Accuracy among ready cases: 100%.

Latency: p50 105.19 ms, p95 139.93 ms. Usage: 26798 input tokens and 2610 output tokens across 60 logical requests.

Labels: author-synthetic (60 cases): AI-authored synthetic boundary cases for jev-recipes; labels have not had independent human review.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 94% to 100%.

| `minConfidence` | Deferred to review | Accuracy of ready results |
| --------------- | ------------------ | ------------------------- |
| 0.5             | 0%                 | 100%                      |
| 0.6             | 0%                 | 100%                      |
| 0.7             | 0%                 | 100%                      |
| 0.8             | 0%                 | 100%                      |
| 0.9             | 2%                 | 100%                      |
| 0.95            | 5%                 | 100%                      |

The lowest threshold reaching 95% accuracy on ready results is 0.5.

Run `npm run eval -- response-needed` to save new results and update this guide. The full report, including misses, is in [evals/results/response-needed.json](../../evals/results/response-needed.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->
