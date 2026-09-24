# Label the facets of a defect report

<!-- BEGIN GENERATED: usage -->

Which of these does report state: the part or lot identifier, a description of the defect, where it was detected, the quantity affected, a containment action?

Use when: You need to check an incoming nonconformance or defect report for the facts a quality process expects before it is accepted, or to tell the reporter which facts are missing.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { defectReportFacets } from 'jev-recipes/defect-report-facets';

const result = await defectReportFacets({
  report:
    'NCR-2041. Part 88-3312-B mounting bracket, supplier lot L26091 from Kestrel Metalworks. Flange thickness measured 2.68 to 2.74 mm on all 6 sampled pieces against the drawing callout of 3.0 mm +/- 0.1 mm. Found at incoming inspection, receiving dock 2, during the standard AQL sample on 2026-09-22. Lot quantity received: 1,200 pieces; the whole lot is suspect since every sample failed. Requesting disposition from engineering.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo defect-report-facets`.

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
  "detected": ["statesPartId", "statesDefect", "statesDetectionPoint", "statesQuantity"],
  "labels": {
    "statesPartId": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.96,
      "confidence": 0.96
    },
    "statesDefect": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "statesDetectionPoint": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.92,
      "confidence": 0.92
    },
    "statesQuantity": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.93,
      "confidence": 0.93
    },
    "statesContainment": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.07,
      "confidence": 0.9299999999999999
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`bug-report-completeness`](../bug-report-completeness/README.md): Use bug-report-completeness for software bug reports, where the expected parts are reproduction steps, expected and actual behavior, and environment.
- [`clarify`](../clarify/README.md): Use clarify to phrase the follow-up question once a report is known to be missing a facet.

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

`labels` holds one check per label: `statesPartId`, `statesDefect`, `statesDetectionPoint`, `statesQuantity`, `statesContainment`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Each label reports that a fact is stated, not that it is right: a part number can be mistyped, a measurement can be misread, and a stated lot size can differ from what was received. The labels are independent, so a report can name a part and a defect while giving no quantity or containment, and a single word like quarantined is enough to set the containment label. Checking identifiers against part masters and lot records, comparing quantities to receipts, and deciding whether a report with missing facets is rejected or returned to the reporter belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo defect-report-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe defect-report-facets` to inspect the input and result schemas.
