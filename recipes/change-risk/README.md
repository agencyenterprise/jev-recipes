# Grade change risk

<!-- BEGIN GENERATED: usage -->

How risky is change to ship, given context, on a five-level rubric?

Use when: You need to size the risk of a described code change before choosing reviewers, test depth, rollout strategy, or approval requirements.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { changeRisk } from 'jev-recipes/change-risk';

const result = await changeRisk({
  change:
    'Replace the session-token validation in the auth middleware with the new JWT verifier, and drop the fallback to the legacy cookie session for all API routes.',
  context:
    'The middleware runs on every authenticated request. About 5% of active users still hold legacy cookie sessions.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo change-risk`.

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
  "score": 2.9,
  "level": 3,
  "confidence": 0.8,
  "probabilities": {
    "0": 0,
    "1": 0.02,
    "2": 0.12,
    "3": 0.8,
    "4": 0.06
  },
  "risk": "high"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`task-complexity`](../task-complexity/README.md): Use task-complexity to grade how hard the work is, rather than how dangerous shipping it is.
- [`action-scope`](../action-scope/README.md): Use action-scope to check whether a change stays within the work that was requested.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `change`        | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

`risk` is one of `negligible`, `low`, `moderate`, `high`, or `critical`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it to order a review queue or pick a rollout tier.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the risk question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade describes the change as written, not the diff itself, so an incomplete or optimistic description yields an optimistic grade. It does not know your test coverage, deployment tooling, or rollback path, which can raise or lower real risk. Application code maps levels to reviewer counts, test requirements, or staged rollouts. The recipe does not decide whether the change is correct.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo change-risk` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe change-risk` to inspect the input and result schemas.
