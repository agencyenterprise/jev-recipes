# Detect goal drift

<!-- BEGIN GENERATED: usage -->

Does step still serve goal, or has work drifted to something goal did not ask for?

Use when: You need a yes/no check on each step of a long-running agent so it stops before spending effort on work nobody asked for.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { goalDrift } from 'jev-recipes/goal-drift';

const result = await goalDrift({
  goal: 'Fix the failing login test in auth.spec.ts so the suite passes.',
  step: 'Rewrite the entire session middleware module to use async/await and rename all of its helper functions for consistency.',
  context:
    'The failing test asserts that an expired token returns 401. The middleware currently throws and the request ends in a 500. No other tests are failing.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo goal-drift`.

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
  "probability": 0.91,
  "confidence": 0.91,
  "verdict": "drifted"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`step-progress`](../step-progress/README.md): Use step-progress to grade how much an observed result moved the objective forward, rather than whether the next step still belongs to it.
- [`intent-change`](../intent-change/README.md): Use intent-change when the user may have redirected the goal, so a step that looks drifted is actually following a new instruction.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `goal`          | Yes      | string                       |
| `step`          | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

`verdict` is `drifted` when Jev's yes probability is at least 0.5 and `aligned` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `aligned` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default, such as pausing the agent or asking the user to confirm the step.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe judges one step against the goal as stated. It cannot tell that the user later widened or redirected the goal unless `context` says so; use [`intent-change`](../intent-change/README.md) when a new message may have changed the target. It reports drift, not whether the drifted work is harmful or valuable, and it does not grade how much progress a step made, which [`step-progress`](../step-progress/README.md) covers. Whether to stop, ask, or continue belongs in application policy.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo goal-drift` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe goal-drift` to inspect the input and result schemas.
