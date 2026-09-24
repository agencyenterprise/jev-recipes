# Grade the depth of a root cause analysis

<!-- BEGIN GENERATED: usage -->

How deep does analysis go in explaining a failure, on a five-level rubric from restating the symptom to naming a verified systemic cause?

Use when: You review corrective action requests, nonconformance dispositions, or incident write-ups and want to flag analyses that stop at the symptom or the immediate cause before a quality reviewer accepts them.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { rootCauseDepth } from 'jev-recipes/root-cause-depth';

const result = await rootCauseDepth({
  analysis:
    'Line 3 stopped twice this week because the conveyor drive motor tripped on overtemperature. The motor overheated because the cooling fan intake was packed with cardboard dust. The intake was clogged because the weekly intake cleaning task was not performed for about eleven weeks. That task was dropped when the preventive maintenance schedule was migrated to the new CMMS in June: the migration checklist had no step to reconcile task counts between the old and new systems, and no one was assigned to own the migration, so the missing task was never noticed.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo root-cause-depth`.

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
  "score": 2.88,
  "level": 3,
  "confidence": 0.82,
  "probabilities": {
    "0": 0.01,
    "1": 0.02,
    "2": 0.1,
    "3": 0.82,
    "4": 0.05
  },
  "depth": "systemic"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`causal-attribution`](../causal-attribution/README.md): Use causal-attribution to label whether an explanation blames the person or the situation, rather than how deep the causal chain goes.
- [`explanation-level`](../explanation-level/README.md): Use explanation-level to grade how much reasoning an answer shows for a conclusion, rather than how far a failure analysis traces its causes.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `analysis`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`depth` is one of `symptom`, `immediate`, `contributing`, `systemic`, `verified`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it for ranking or thresholds where a single label loses information.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade measures how far the stated chain of causes reaches, not whether it is right; an analysis can name a plausible systemic cause that later proves false and still grade systemic. It rewards what is written, so a team that found the real cause but recorded only the fix grades shallow, and a stated verification is taken at its word rather than checked. The recipe does not know your CAPA procedure or which depth a given defect class requires, so deciding which grades are accepted, returned, or escalated belongs in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo root-cause-depth` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe root-cause-depth` to inspect the input and result schemas.
