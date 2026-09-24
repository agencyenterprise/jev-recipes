# Grade bug report completeness

<!-- BEGIN GENERATED: usage -->

How complete is report for someone to reproduce and triage it, on a five-level rubric?

Use when: You need to decide whether an incoming bug report can go straight to triage or needs a follow-up request for details first.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { bugReportCompleteness } from 'jev-recipes/bug-report-completeness';

const result = await bugReportCompleteness({
  report:
    "Steps: 1. Open the Reports tab. 2. Choose a date range ending today. 3. Click Export CSV. Expected: a CSV downloads with rows for the whole range. Actual: the download contains only rows up to yesterday and today's rows are missing.",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo bug-report-completeness`.

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
  "score": 2.92,
  "level": 3,
  "confidence": 0.85,
  "probabilities": {
    "0": 0,
    "1": 0.01,
    "2": 0.1,
    "3": 0.85,
    "4": 0.04
  },
  "completeness": "nearly"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`clarify`](../clarify/README.md): Use clarify to name the specific missing or ambiguous details once a report grades incomplete.
- [`requirement-testability`](../requirement-testability/README.md): Use requirement-testability to check whether a described expected behavior can be verified.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `report`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`completeness` is one of `bare`, `symptom`, `partial`, `nearly`, or `complete`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it to order an intake queue or pick a follow-up template.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the completeness question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The rubric checks whether the four reproduction elements are present, not whether they are correct or sufficient to find the cause. A report that names an environment but gives vague steps still grades on what it contains. Severity, priority, and who should be asked for missing details are application decisions; pair the grade with [`clarify`](../clarify/README.md) to name the gaps.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo bug-report-completeness` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe bug-report-completeness` to inspect the input and result schemas.
