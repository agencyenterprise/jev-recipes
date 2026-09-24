# Grade how actionable an alert is

<!-- BEGIN GENERATED: usage -->

How actionable is alert for the on-call engineer who receives it, on a five-level rubric from pure noise to a guided first step?

Use when: You need to triage or audit alert text before paging someone: to route noisy alerts to a digest, to flag vague alerts for rewriting, or to rank a flood of alerts by how much they tell the responder.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { alertActionability } from 'jev-recipes/alert-actionability';

const result = await alertActionability({
  alert:
    'HIGH: payments-gateway 5xx rate is 6.4% over the last 5 minutes (threshold 2%) in prod-eu-west-1. Upstream dependency stripe-proxy is returning 502s for 40% of calls.',
  context:
    'payments-gateway is the public API in front of card processing. stripe-proxy is an internal sidecar that batches calls to Stripe.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo alert-actionability`.

<details>
<summary>Illustrative result from the offline fixture</summary>

```json
{
  "model": "demo-fixture",
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0
  },
  "status": "review",
  "score": 2.96,
  "level": 3,
  "confidence": 0.78,
  "probabilities": {
    "0": 0,
    "1": 0.02,
    "2": 0.1,
    "3": 0.78,
    "4": 0.1
  },
  "actionability": "located"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`feedback-actionability`](../feedback-actionability/README.md): Use feedback-actionability for review comments and user feedback rather than operational alerts.
- [`issue-impact`](../issue-impact/README.md): Use issue-impact to grade how much a reported problem matters, rather than how well the alert tells you what to do about it.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `alert`         | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

`actionability` is one of `noise`, `vague`, `symptom`, `located`, `guided`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it for ranking or thresholds where a single label loses information.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade describes the alert text, not the incident behind it. A well-worded alert can still be a false positive, and a terse alert can point at a real outage. The recipe does not know your topology or runbooks, so `context` should carry any service names the responder would need to decode the alert. Deduplication, paging thresholds, and escalation timers belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo alert-actionability` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe alert-actionability` to inspect the input and result schemas.
