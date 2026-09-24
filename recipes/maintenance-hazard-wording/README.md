# Flag a maintenance request that describes a safety hazard

<!-- BEGIN GENERATED: usage -->

Does request describe a safety hazard such as a gas smell, active water intrusion, exposed wiring, structural damage, no heat in cold weather, or a blocked exit?

Use when: You need to pull tenant maintenance requests that describe a hazard out of the routine queue for immediate dispatch, based on what the request says before anyone inspects.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { maintenanceHazardWording } from 'jev-recipes/maintenance-hazard-wording';

const result = await maintenanceHazardWording({
  request:
    "Unit 4B. Since this morning there's a strong gas smell in the kitchen, strongest near the stove even with all the burners off. I opened the windows. Can someone come take a look when they get a chance? Thanks.",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo maintenance-hazard-wording`.

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
  "probability": 0.96,
  "confidence": 0.96,
  "verdict": "hazard"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`urgency-signal`](../urgency-signal/README.md): Use urgency-signal to detect whether the tenant explicitly asks for urgent attention, rather than whether the described problem is a hazard regardless of how it is asked.
- [`issue-impact`](../issue-impact/README.md): Use issue-impact to grade how badly a reported problem affects the reporter, rather than whether it is a safety hazard.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `request`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `hazard` when Jev's yes probability is at least 0.5 and `routine` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `routine` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict describes the wording of the request, not the state of the unit; only an inspection confirms a hazard, and a vague or understated request can hide one. The hazard types are a fixed list drawn from common habitability standards, so local code definitions, lease duties, and dispatch timing belong in application code. The recipe does not rank one hazard above another or decide whether to call emergency services.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo maintenance-hazard-wording` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe maintenance-hazard-wording` to inspect the input and result schemas.
