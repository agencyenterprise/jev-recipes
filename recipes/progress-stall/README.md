# Detect a stalled agent

<!-- BEGIN GENERATED: usage -->

Does transcript, the recent agent steps, show the agent failing to make progress toward objective by repeating actions, circling, or reprocessing the same information?

Use when: You need a yes/no check on a running agent every few steps so a supervisor can interrupt a loop before it burns the remaining budget.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { progressStall } from 'jev-recipes/progress-stall';

const result = await progressStall({
  transcript:
    'Step 14: ran `npm test` -> 3 failures in date-utils.test.ts (timezone offset). Step 15: opened src/date-utils.ts, read formatDate. Step 16: ran `npm test` -> same 3 failures. Step 17: opened src/date-utils.ts, read formatDate again. Step 18: ran `npm test` -> same 3 failures. Step 19: opened src/date-utils.ts, read formatDate. Step 20: ran `npm test` -> same 3 failures.',
  objective:
    'Make the date-utils test suite pass without changing the expected values in the tests.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo progress-stall`.

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
  "probability": 0.94,
  "confidence": 0.94,
  "verdict": "stalled"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`repeated-attempt`](../repeated-attempt/README.md): Use repeated-attempt to check whether one new action is a retry of a specific earlier one, rather than whether a whole window of steps has stalled.
- [`step-progress`](../step-progress/README.md): Use step-progress to grade how much a single observed result moved the objective forward.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `transcript`    | Yes      | string                       |
| `objective`     | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `stalled` when Jev's yes probability is at least 0.5 and `progressing` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `progressing` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default, such as letting the agent run a few more steps before checking again or asking the user whether to continue.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

Measured on 40 golden cases against `jev-1.13.0`: **100% accurate** overall.

Recorded 2026-09-27 with package 0.7.0, on the **held-out** split. Recipe fingerprint: `cd8c13f10bddc73e3eee93efc0f14fe54eef3d28c6e651e224e6b13a449df296`.

40/40 cases correct; 40 ready, 0 review, 0 failed. Accuracy among ready cases: 100%.

Latency: p50 118.82 ms, p95 159.07 ms. Usage: 20504 input tokens and 800 output tokens across 40 logical requests.

Labels: author-synthetic (40 cases): AI-authored synthetic boundary cases for jev-recipes; labels have not had independent human review.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 91% to 100%.

**Measured on these synthetic cases.**

Evaluated with the policy frozen on development data: minConfidence 0.8. No threshold search was performed on held-out cases.

Run `npm run eval -- progress-stall` to save new results and update this guide. The full report, including misses, is in [evals/results/progress-stall.json](../../evals/results/progress-stall.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe sees only the steps in `transcript`. A loop longer than the window looks like progress, and slow but real progress can look like a stall if the window is too short, so choose the window to match the agent's typical step cost. It reports that the agent is stalled, not why or what to do next; interrupting, redirecting, or escalating belongs in application policy. To test whether one new action retries a specific earlier one use [`repeated-attempt`](../repeated-attempt/README.md); to grade a single step's contribution use [`step-progress`](../step-progress/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo progress-stall` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe progress-stall` to inspect the input and result schemas.
