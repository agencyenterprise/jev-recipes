# Label the facets an insurance claim narrative states

<!-- BEGIN GENERATED: usage -->

Which of these does claim state: when the incident happened, where it happened, what caused it, what was damaged or lost, and whether there are witnesses or evidence?

Use when: A claims intake assistant receives a free-form loss description and needs to know which standard first-notice details are already present so it can pre-fill the claim and ask only for what is missing.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { claimFacets } from 'jev-recipes/claim-facets';

const result = await claimFacets({
  claim:
    'On the night of Sunday 8 March, sometime after we went to bed around 11 pm, a pipe in the upstairs bathroom at our home at 27 Alder Court burst. By the time we woke at 6 am, water had come through the ceiling of the living room directly below. The living room ceiling plaster has collapsed in two places, the hardwood floor is warped across roughly half the room, and the sofa and a wool rug are soaked. We shut off the main and called a plumber, who replaced the split section of pipe that morning.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo claim-facets`.

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
  "detected": ["statesWhen", "statesWhere", "statesCause", "statesDamages"],
  "labels": {
    "statesWhen": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.96,
      "confidence": 0.96
    },
    "statesWhere": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "statesCause": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.94,
      "confidence": 0.94
    },
    "statesDamages": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.96,
      "confidence": 0.96
    },
    "statesEvidence": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.08,
      "confidence": 0.92
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`symptom-facets`](../symptom-facets/README.md): Use symptom-facets for the parallel intake check on a patient's symptom description rather than an insurance loss narrative.
- [`clarify`](../clarify/README.md): Use clarify to decide whether to ask the claimant a follow-up question about the facets this recipe finds missing.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `claim`         | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per label: `statesWhen`, `statesWhere`, `statesCause`, `statesDamages`, `statesEvidence`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Each facet reports only that the claimant's wording states it; "a few weeks ago" counts as stating when even though it is not a usable date, so parse concrete dates, addresses, and amounts in application code. The recipe makes no coverage, liability, valuation, or fraud judgment, and it does not assess whether the stated cause is plausible or whether the described damage matches it. Statements of evidence are taken at face value; the recipe does not know whether a mentioned photograph or report exists. To decide whether to ask the claimant about a missing facet, use clarify.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo claim-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe claim-facets` to inspect the input and result schemas.
