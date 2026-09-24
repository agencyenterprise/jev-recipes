# Detect overlapping tasks

<!-- BEGIN GENERATED: usage -->

Do firstTask and secondTask cover overlapping work, such that two workers would duplicate or collide?

Use when: You are about to fan work out to several agents or people and need a yes/no check that two assignments will not step on each other.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { taskOverlap } from 'jev-recipes/task-overlap';

const result = await taskOverlap({
  firstTask:
    'Add input validation to the user registration form so that email and password fields show inline errors before submit.',
  secondTask:
    'Refactor the registration form to use the shared FormField component and wire up its built-in error display for every field.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo task-overlap`.

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
  "probability": 0.93,
  "confidence": 0.93,
  "verdict": "overlapping"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`task-duplicate`](../task-duplicate/README.md): Use task-duplicate when the question is whether two items are the same request, rather than whether distinct requests share work.
- [`task-dependency`](../task-dependency/README.md): Use task-dependency to check whether one task must finish before the other can start, which overlap does not imply.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `firstTask`     | Yes      | string                       |
| `secondTask`    | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `overlapping` when Jev's yes probability is at least 0.5 and `disjoint` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `disjoint` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default, such as running the two tasks sequentially or assigning them to the same worker.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe compares the two descriptions as written. Tasks that would touch the same files or records without saying so look disjoint, so pair it with a code-level check when collisions are costly. It reports that overlap exists, not which task should absorb the shared work. Whether two items are the same request is [`task-duplicate`](../task-duplicate/README.md); whether one must finish before the other starts is [`task-dependency`](../task-dependency/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo task-overlap` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe task-overlap` to inspect the input and result schemas.
