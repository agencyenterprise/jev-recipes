# Grade handoff completeness

<!-- BEGIN GENERATED: usage -->

How ready is item, a work description being handed to another agent or person, to be picked up without asking questions, on a five-level rubric?

Use when: You need to grade a task description before delegating it, so an orchestrator can enrich it or ask for missing pieces instead of handing off something a worker will bounce back.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { handoffCompleteness } from 'jev-recipes/handoff-completeness';

const result = await handoffCompleteness({
  item: 'Add rate limiting to the public /search endpoint. Use the existing RateLimiter middleware in src/middleware/rate-limit.ts and the Redis instance already configured for sessions. Done when requests beyond 60 per minute per API key return 429 with a Retry-After header and the integration test in tests/api/search.test.ts covers the limit.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo handoff-completeness`.

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
  "score": 2.96,
  "level": 3,
  "confidence": 0.82,
  "probabilities": {
    "0": 0,
    "1": 0.02,
    "2": 0.08,
    "3": 0.82,
    "4": 0.08
  },
  "completeness": "defined"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`plan-completeness`](../plan-completeness/README.md): Use plan-completeness to grade whether a plan covers its goal, rather than whether a single work item is ready to hand off.
- [`clarify`](../clarify/README.md): Use clarify to find the specific missing requirements once an item grades below complete.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `item`          | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`completeness` is one of `bare`, `goal`, `inputs`, `defined`, or `complete`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it to rank a queue of work items by readiness or to pick the enrichment step to run next.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the completeness question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade describes what the item states. It does not know what the recipient already knows, so context shared out of band counts as missing, and it does not judge whether the goal is correct, feasible, or worth doing. Application code decides which level is good enough to hand off. To list the specific gaps, follow up with [`clarify`](../clarify/README.md); to grade a whole plan rather than one item, use [`plan-completeness`](../plan-completeness/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo handoff-completeness` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe handoff-completeness` to inspect the input and result schemas.
