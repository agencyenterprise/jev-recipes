# Check evidence for a qualification

<!-- BEGIN GENERATED: usage -->

Does profile contain concrete evidence that the candidate meets requirement, not just matching keywords?

Use when: You screen resumes or candidate summaries against one requirement at a time and want to separate demonstrated experience from keyword matches.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { qualificationEvidence } from 'jev-recipes/qualification-evidence';

const result = await qualificationEvidence({
  requirement: 'At least three years of experience operating Kubernetes clusters in production.',
  profile:
    'Platform Engineer, Northwind Logistics, 2020 to present. Own the production Kubernetes platform (EKS, 12 clusters, 400 services). Led the migration from self-managed clusters to EKS in 2022 with zero customer-facing downtime. On-call rotation for cluster incidents; wrote the runbooks for node pool upgrades and etcd recovery. Skills: Kubernetes, Terraform, Go, Prometheus.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo qualification-evidence`.

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
  "probability": 0.94,
  "confidence": 0.94,
  "verdict": "evidenced"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`step-complete`](../step-complete/README.md): Use step-complete for the general form: does evidence establish that a condition is met.
- [`verify`](../verify/README.md): Use verify to check several candidate claims against paired evidence in one call.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `requirement`   | Yes      | string                       |
| `profile`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `evidenced` when Jev's yes probability is at least 0.5 and `unevidenced` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `unevidenced` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and route the profile to a human screener rather than auto-rejecting it.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe judges whether the profile describes concrete evidence, not whether the evidence is truthful or can be verified. A skills list that names the requirement without any described work is `unevidenced`; a role description with dates, scope, and outcomes that demonstrate the requirement is `evidenced`. It checks one requirement per call, so loop over a requirement list and aggregate in application code. An `evidenced` verdict on one requirement is not an overall fit judgment or a hiring recommendation.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo qualification-evidence` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe qualification-evidence` to inspect the input and result schemas.
