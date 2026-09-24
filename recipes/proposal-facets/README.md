# Label the facets of a grant proposal

<!-- BEGIN GENERATED: usage -->

Which of these does proposal include: a statement of need, measurable objectives, planned activities, a budget, an evaluation plan?

Use when: You screen draft or submitted grant proposals for the sections a funder or an internal reviewer expects, or you want to tell a writer which parts are missing before a deadline.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { proposalFacets } from 'jev-recipes/proposal-facets';

const result = await proposalFacets({
  proposal:
    "Riverbend Youth Literacy Program. In Riverbend County, 38% of third graders read below grade level, and both public library branches ended their after-school programs in 2024, leaving no free reading support outside school hours. We request $48,000 to run a twice-weekly after-school reading program at three elementary schools during the 2026-27 school year. Objectives: enroll 90 students in grades 2 and 3, and raise participants' reading level by at least one grade band by May 2027. Activities: recruit and train 12 volunteer tutors in September; run 60-minute small-group sessions on Tuesdays and Thursdays from October through May; hold a family reading night at each school every quarter. Budget: program coordinator (0.5 FTE) $30,000; books and materials $9,000; tutor training and background checks $4,000; snacks and family nights $5,000.",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo proposal-facets`.

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
  "detected": ["statesNeed", "statesObjectives", "statesActivities", "statesBudget"],
  "labels": {
    "statesNeed": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "statesObjectives": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.91,
      "confidence": 0.91
    },
    "statesActivities": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.94,
      "confidence": 0.94
    },
    "statesBudget": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.93,
      "confidence": 0.93
    },
    "statesEvaluation": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.09,
      "confidence": 0.91
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`plan-completeness`](../plan-completeness/README.md): Use plan-completeness to grade how completely a plan covers a specific task, rather than which standard sections a proposal contains.
- [`content-facets`](../content-facets/README.md): Use content-facets for the structural elements of an article, such as a thesis and evidence, rather than the parts of a funding request.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `proposal`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per label: `statesNeed`, `statesObjectives`, `statesActivities`, `statesBudget`, `statesEvaluation`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Each label reports that a facet is present, not that it is strong: a need can be stated without evidence, an objective can be measurable yet unrealistic, and a budget can be a single unsupported total. The labels are independent, so a proposal can state measurable objectives while giving no way to measure them, which is exactly what the demo shows. Checking a proposal against a specific funder's required sections, word limits, and attachments, and deciding whether a proposal with missing facets is returned to the writer, belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo proposal-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe proposal-facets` to inspect the input and result schemas.
