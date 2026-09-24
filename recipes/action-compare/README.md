# Compare two candidate actions

<!-- BEGIN GENERATED: usage -->

Which of firstAction and secondAction better advances goal within constraints?

Use when: An agent has narrowed to two next steps and needs a head-to-head preference under the stated goal and constraints.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { actionCompare } from 'jev-recipes/action-compare';

const result = await actionCompare({
  goal: 'Find out why the nightly export job failed last night.',
  firstAction: "Open the job's log for last night's run and read the last 200 lines.",
  secondAction: 'Re-run the export job now and see if it fails again.',
  constraints: 'Do not trigger production jobs during business hours.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo action-compare`.

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
  "verdict": "first",
  "confidence": 0.88,
  "probabilities": {
    "first": 0.88,
    "second": 0.04,
    "tie": 0.04,
    "neither": 0.02,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`choose-action`](../choose-action/README.md): Use choose-action to select one action from a longer list of candidates.
- [`action-scope`](../action-scope/README.md): Use action-scope to check whether a single action stays within the requested work.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `goal`          | Yes      | string                       |
| `firstAction`   | Yes      | string                       |
| `secondAction`  | Yes      | string                       |
| `constraints`   | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `constraints` is optional and is omitted from the request when absent.

## Result

`verdict` is `first`, `second`, `tie`, `neither`, or `unclear`. `first` and `second` name the preferred action. `tie` means both advance the goal about equally. `neither` means no action advances the goal within the constraints, which usually signals that the agent should replan.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. `probabilities` covers all five outcomes.

## Reuse and calls

Uses the shared comparison helper, which fixes the five outcomes and tells Jev that presentation order is irrelevant. This folder owns the question wording and the four outcome descriptions. A live invocation makes one logical Jev request.

## Limits

The recipe prefers one described action over another. It does not know the true state of your systems, so an action that sounds right may still fail. Constraints are judged as text; enforce permissions, rate limits, and safety rules in code. For more than two candidates use [`choose-action`](../choose-action/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo action-compare` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe action-compare` to inspect the input and result schemas.
