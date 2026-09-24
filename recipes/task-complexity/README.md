# Grade task complexity

<!-- BEGIN GENERATED: usage -->

How complex is task, from a single lookup to open-ended work, on a five-level rubric?

Use when: You need to size a task before choosing a model, a plan depth, a time budget, or whether to ask for help.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { taskComplexity } from 'jev-recipes/task-complexity';

const result = await taskComplexity({
  task: 'Migrate the billing service from the legacy payments API to the new provider, keeping existing subscriptions active and reconciling any invoices that fail during the cutover.',
  context: 'The service has 40,000 active subscriptions and no staging replica of production data.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo task-complexity`.

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
  "score": 3.04,
  "level": 3,
  "confidence": 0.84,
  "probabilities": {
    "0": 0,
    "1": 0.01,
    "2": 0.09,
    "3": 0.84,
    "4": 0.06
  },
  "complexity": "complex"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`route`](../route/README.md): Use route to pick a named handler once the task is sized.
- [`clarify`](../clarify/README.md): Use clarify to find missing requirements in a task that grades complex or open-ended.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `task`          | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

`complexity` is one of `trivial`, `simple`, `moderate`, `complex`, or `open-ended`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it to order tasks or pick a budget tier.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the complexity question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade describes the work as written. It does not know your tools, data access, or team, so the same task can be easier or harder in practice. Application code maps levels to concrete budgets, model choices, or escalation rules. The recipe does not decide whether the task should be done.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo task-complexity` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe task-complexity` to inspect the input and result schemas.
