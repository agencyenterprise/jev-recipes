# Grade plan completeness

<!-- BEGIN GENERATED: usage -->

How completely does plan cover what task requires, on a five-level rubric?

Use when: You need to check an agent-written plan against the task before execution starts, so missing requirements are caught while they are cheap to add.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { planCompleteness } from 'jev-recipes/plan-completeness';

const result = await planCompleteness({
  task: 'Add an Export as CSV button to the reports page. The export must respect the filters currently applied and must work for guest accounts as well as members.',
  plan: '1. Add an Export as CSV button beside the existing PDF export control. 2. Create a /reports/export.csv endpoint that serializes the current report query. 3. Pass the active filter parameters from the page to the new endpoint. 4. Add an integration test that exports a filtered report and checks the rows match the filtered view.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo plan-completeness`.

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
  "score": 2.06,
  "level": 2,
  "confidence": 0.82,
  "probabilities": {
    "0": 0.01,
    "1": 0.05,
    "2": 0.82,
    "3": 0.11,
    "4": 0.01
  },
  "completeness": "mostly"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`answer-coverage`](../answer-coverage/README.md): Use answer-coverage to check a finished draft against explicit questions rather than a plan against a task.
- [`clarify`](../clarify/README.md): Use clarify when the task itself is ambiguous, since a plan cannot cover requirements the task never made clear.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `task`          | Yes      | string                       |
| `plan`          | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`completeness` is one of `none`, `partial`, `mostly`, `nearly`, or `complete`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it to decide whether a plan may run as is, needs another planning pass, or should go back to the user.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the completeness question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The rubric grades whether the plan covers the requirements the task states or clearly implies. It does not judge whether the planned steps would work, how long they would take, or whether they are in a sensible order. The top level is reserved for plans that include a verification step, so a plan that covers everything but never checks the result grades `nearly` by design. Requirements the task never made clear cannot be covered; use [`clarify`](../clarify/README.md) on the task first when it reads as ambiguous. The recipe does not tell you which requirement is missing.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo plan-completeness` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe plan-completeness` to inspect the input and result schemas.
