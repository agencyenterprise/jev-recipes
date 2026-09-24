# Label the facets of a progress report

<!-- BEGIN GENERATED: usage -->

Which of these does report include: an outcome statement, supporting evidence, blockers, a next step, open questions?

Use when: You need to check an agent progress report for the parts a supervisor expects before accepting it, routing it, or asking the agent to fill in what is missing.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { reportFacets } from 'jev-recipes/report-facets';

const result = await reportFacets({
  report:
    'Migrated 4 of the 6 legacy endpoints to the new router; all 38 tests in tests/api pass (run log attached). The remaining two endpoints depend on the auth middleware rewrite, which is still blocked on the token format decision from the platform team. Next I will stub the middleware so the last two endpoints can be migrated behind a feature flag.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo report-facets`.

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
  "detected": ["statesOutcome", "providesEvidence", "statesBlockers", "statesNextStep"],
  "labels": {
    "statesOutcome": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "providesEvidence": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.88,
      "confidence": 0.88
    },
    "statesBlockers": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.91,
      "confidence": 0.91
    },
    "statesNextStep": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.93,
      "confidence": 0.93
    },
    "raisesQuestions": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.12,
      "confidence": 0.88
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`result-outcome`](../result-outcome/README.md): Use result-outcome to classify what a reported result actually was, once the report is known to state one.
- [`step-progress`](../step-progress/README.md): Use step-progress to grade how far the reported work moved the objective, rather than what the report contains.

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

`labels` holds one check per facet: `statesOutcome`, `providesEvidence`, `statesBlockers`, `statesNextStep`, and `raisesQuestions`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present facets in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per facet in a single Jev request. This folder owns the five questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Each facet is judged independently, so combinations are expected and a report may have none. The labels detect that a facet is present, not that it is accurate: cited evidence can be wrong and a stated outcome can be optimistic. To classify what the reported result actually was use [`result-outcome`](../result-outcome/README.md); to grade how far the work moved the objective use [`step-progress`](../step-progress/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo report-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe report-facets` to inspect the input and result schemas.
