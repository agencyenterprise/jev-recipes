# Classify a safety event

<!-- BEGIN GENERATED: usage -->

What kind of safety event does report describe: a near miss, a first-aid injury, a medical-treatment injury, property damage, an environmental release, or an unsafe condition?

Use when: You need to sort free-text safety reports from workers, supervisors, or contractors into a fixed set of event kinds so each can be routed to the right investigation, form, or notification path.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { safetyIncidentKind } from 'jev-recipes/safety-incident-kind';

const result = await safetyIncidentKind({
  report:
    'Warehouse B, 14:20. A forklift reversing out of aisle 7 came within about a metre of a contractor walking through the marked pedestrian crossing. The driver stopped when the spotter shouted. No contact, no injuries, nothing damaged. The contractor was not wearing a high-visibility vest and the mirror at the aisle end is missing.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo safety-incident-kind`.

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
  "verdict": "near_miss",
  "confidence": 0.87,
  "probabilities": {
    "near_miss": 0.87,
    "first_aid": 0.01,
    "medical_treatment": 0.01,
    "property_damage": 0.01,
    "environmental_release": 0.01,
    "unsafe_condition": 0.07,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`incident-severity-wording`](../incident-severity-wording/README.md): Use incident-severity-wording to grade how severe an operational outage is, rather than what kind of workplace safety event occurred.
- [`failure-kind`](../failure-kind/README.md): Use failure-kind when the categories are caller-supplied rather than this fixed set of safety event kinds.

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

`verdict` is one of `near_miss`, `first_aid`, `medical_treatment`, `property_damage`, `environmental_release`, `unsafe_condition`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The kind reflects the consequences the report describes, not what actually happened: a report that omits the clinic visit classifies as first aid, and a report that omits the spill classifies by what it does mention. The recipe does not decide whether an event is recordable, reportable to a regulator, or a lost-time case, and it does not weigh contributing hazards named alongside an event, so the demo's missing vest and mirror do not change a near miss into an unsafe condition. Mapping kinds to regulatory categories, notification deadlines, and investigation depth belongs in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo safety-incident-kind` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe safety-incident-kind` to inspect the input and result schemas.
