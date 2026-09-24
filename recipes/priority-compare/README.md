# Compare two tasks for priority

<!-- BEGIN GENERATED: usage -->

Which of firstTask and secondTask should be done first under criteria?

Use when: A planner or agent must order two competing tasks and the team has written down how priority should be decided.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { priorityCompare } from 'jev-recipes/priority-compare';

const result = await priorityCompare({
  criteria:
    'Customer-facing outages come first. Then anything blocking another team. Internal refactors are scheduled last and only when nothing else is waiting.',
  firstTask: 'Rename the internal config helpers for consistency across the billing service.',
  secondTask: 'Fix the checkout page returning a 500 for customers paying with a saved card.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo priority-compare`.

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
  "verdict": "second",
  "confidence": 0.93,
  "probabilities": {
    "first": 0.02,
    "second": 0.93,
    "tie": 0.02,
    "neither": 0.01,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`action-compare`](../action-compare/README.md): Use action-compare to choose which of two next steps better advances a goal rather than which of two tasks to schedule first.
- [`task-dependency`](../task-dependency/README.md): Use task-dependency to establish whether one task must finish before the other can start, which is a hard ordering rather than a priority call.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `criteria`      | Yes      | string                       |
| `firstTask`     | Yes      | string                       |
| `secondTask`    | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `first`, `second`, `tie`, `neither`, or `unclear`. `first` and `second` name the task that should be done first. `tie` means the criteria do not distinguish the two, so either order is fine. `neither` means the criteria rule both tasks out, which usually signals that neither belongs on the current plan.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. `probabilities` covers all five outcomes.

## Reuse and calls

Uses the shared comparison helper, which fixes the five outcomes and tells Jev that presentation order is irrelevant. This folder owns the question wording and the four outcome descriptions. A live invocation makes one logical Jev request.

## Limits

The recipe orders two tasks under the criteria as written. It does not judge whether the criteria are wise or complete, and it knows nothing about tasks outside the pair, so building a full ranking means running many pairs or a dedicated ranking step. `neither` reports that the criteria exclude both tasks, not that they are impossible or harmful. For whether one task must finish before the other can start, use [`task-dependency`](../task-dependency/README.md); for which of two next steps better advances a goal, use [`action-compare`](../action-compare/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo priority-compare` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe priority-compare` to inspect the input and result schemas.
