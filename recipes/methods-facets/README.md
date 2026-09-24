# Label what a methods section states

<!-- BEGIN GENERATED: usage -->

Which of these does methods state: sample size, data source, analysis method, limitations, and preregistration or a protocol?

Use when: You screen manuscripts, preprints, or study summaries for reporting completeness before deciding which ones need a request for missing methodological detail.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { methodsFacets } from 'jev-recipes/methods-facets';

const result = await methodsFacets({
  methods:
    'We recruited 312 undergraduates (mean age 19.4, 58% women) from the university psychology participant pool between March and May 2023. Each participant completed the task in a single 40-minute lab session. Responses were analyzed with mixed-effects logistic regression in R using lme4, with participant as a random intercept and condition as a fixed effect. The hypotheses, design, and analysis plan were preregistered on OSF before data collection began.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo methods-facets`.

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
  "detected": [
    "statesSampleSize",
    "statesDataSource",
    "statesAnalysisMethod",
    "statesPreregistration"
  ],
  "labels": {
    "statesSampleSize": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.97,
      "confidence": 0.97
    },
    "statesDataSource": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.92,
      "confidence": 0.92
    },
    "statesAnalysisMethod": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.96,
      "confidence": 0.96
    },
    "statesLimitations": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.05,
      "confidence": 0.95
    },
    "statesPreregistration": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`answer-disclosures`](../answer-disclosures/README.md): Use answer-disclosures to label the caveats and disclosures in an answer, rather than the reporting elements of a methods section.
- [`content-facets`](../content-facets/README.md): Use content-facets to label the structural elements of an article, rather than the methodological details of a study.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `methods`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per label: `statesSampleSize`, `statesDataSource`, `statesAnalysisMethod`, `statesLimitations`, `statesPreregistration`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Each label reports whether the element is stated, not whether it is adequate: a stated sample can be too small, a named source can be biased, and a named model can be the wrong one. Only the supplied text is read, so elements reported in other sections, supplements, or a linked registration will be labeled absent unless you paste them in. Mapping the labels onto a reporting checklist such as CONSORT or PRISMA, and deciding which absences warrant a request to the authors, belongs in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo methods-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe methods-facets` to inspect the input and result schemas.
