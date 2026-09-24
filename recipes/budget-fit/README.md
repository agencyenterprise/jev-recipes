# Check plan against budget

<!-- BEGIN GENERATED: usage -->

Does plan, as described, plausibly fit within budget, the stated limits on steps, time, cost, or calls?

Use when: You need a yes/no check before an agent starts executing a plan under a step, time, cost, or call limit, so it can trim or ask instead of running out midway.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { budgetFit } from 'jev-recipes/budget-fit';

const result = await budgetFit({
  plan: '1. Clone the repository and install dependencies. 2. Run the full test suite to record the baseline (about 12 minutes). 3. For each of the 9 failing tests, read the test, read the code under test, propose a fix, apply it, and rerun the full suite. 4. Open a pull request with a summary of every fix.',
  budget:
    'At most 20 tool calls and 30 minutes of wall-clock time. No more than 5 full test-suite runs.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo budget-fit`.

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
  "probability": 0.08,
  "confidence": 0.92,
  "verdict": "exceeds"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`task-complexity`](../task-complexity/README.md): Use task-complexity to size a task on a rubric before a budget exists, rather than checking a plan against a stated one.
- [`plan-completeness`](../plan-completeness/README.md): Use plan-completeness to check that the plan covers its goal; a plan can fit the budget by leaving work out.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `plan`          | Yes      | string                       |
| `budget`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `fits` when Jev's yes probability is at least 0.5 and `exceeds` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `exceeds` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default, such as asking for a smaller plan or a larger budget before starting.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict is a semantic estimate from `plan` and `budget` as written. It cannot measure real step counts, latency, or spend, so enforce hard limits in code and use this recipe to catch plans that are obviously too large before they run. It reports fit or excess, not the margin or which step to cut, and a plan can fit by omitting necessary work, which [`plan-completeness`](../plan-completeness/README.md) checks. Limits the budget does not mention are treated as unconstrained.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo budget-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe budget-fit` to inspect the input and result schemas.
