# Grade the risk of missing a deadline

<!-- BEGIN GENERATED: usage -->

How at risk is the work of missing deadline given progress, from on track to already missed or impossible?

Use when: A supervisor or planner has a stated deadline and a progress report and needs a graded read on whether to escalate, replan, or leave the work alone.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { deadlineRisk } from 'jev-recipes/deadline-risk';

const result = await deadlineRisk({
  deadline:
    'The migrated customer records must be live in the new CRM by end of day Friday, per the signed contract. It is now Thursday at 6pm.',
  progress:
    'The export from the old system finished Wednesday. The import script rejects about 30% of records with a schema mismatch that nobody has diagnosed yet. The engineer who wrote the field mapping is out until Monday. No fallback or partial go-live has been agreed with the customer.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo deadline-risk`.

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
  "score": 2.99,
  "level": 3,
  "confidence": 0.82,
  "probabilities": {
    "0": 0,
    "1": 0.01,
    "2": 0.08,
    "3": 0.82,
    "4": 0.09
  },
  "risk": "high"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`step-progress`](../step-progress/README.md): Use step-progress to judge whether a single new observation moved the task forward, rather than how the whole effort stands against a deadline.
- [`task-complexity`](../task-complexity/README.md): Use task-complexity to grade how hard a task is before it starts, rather than how it is tracking once underway.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `deadline`      | Yes      | string                       |
| `progress`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`risk` is one of `none`, `minor`, `moderate`, `high`, `missed`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it for ranking or thresholds where a single label loses information.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade reflects what the two texts say about remaining work, blockers, and time left; the recipe does not read calendars or compute durations, so state the time remaining explicitly rather than only giving dates. A progress report that omits blockers or overstates completion will earn a better grade than the work deserves, and the recipe cannot detect that. The grade does not choose a response. Whether to escalate, cut scope, or renegotiate the deadline is a decision for the caller.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo deadline-risk` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe deadline-risk` to inspect the input and result schemas.
