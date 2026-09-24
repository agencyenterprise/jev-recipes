# Grade the severity an incident report describes

<!-- BEGIN GENERATED: usage -->

What severity does the wording of report describe, on a five-level rubric from no user impact to total outage or data loss?

Use when: You need a first severity estimate from a free-text incident report, alert summary, or status update before a human incident commander confirms it, or you want to check that a declared severity matches how the report describes the impact.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { incidentSeverityWording } from 'jev-recipes/incident-severity-wording';

const result = await incidentSeverityWording({
  report:
    'Since 14:05 UTC, about 30% of requests to the search endpoint on the EU shard return 503. Search results fail to load for mobile users in the EU; web checkout, account pages, and all other regions are unaffected. No data loss observed.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo incident-severity-wording`.

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
  "score": 2.12,
  "level": 2,
  "confidence": 0.8,
  "probabilities": {
    "0": 0,
    "1": 0.05,
    "2": 0.8,
    "3": 0.13,
    "4": 0.02
  },
  "severity": "partial"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`issue-impact`](../issue-impact/README.md): Use issue-impact for bug reports and feature requests where the question is how many users a problem affects rather than how large an outage is.
- [`policy-severity`](../policy-severity/README.md): Use policy-severity to grade how serious a policy violation is, rather than how serious an operational incident is.

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

`severity` is one of `none`, `minor`, `partial`, `major`, `critical`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it for ranking or thresholds where a single label loses information.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade describes the report's wording, not measured impact. A report that omits affected users or regions will be graded lower than the real incident deserves, and a dramatic report will not be graded higher unless it states the impact. The recipe does not know your SEV scale, SLAs, or paging rules, so application code maps levels to them. It does not verify any figure in the report.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo incident-severity-wording` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe incident-severity-wording` to inspect the input and result schemas.
