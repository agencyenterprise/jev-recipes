# Label what an applicant statement addresses

<!-- BEGIN GENERATED: usage -->

Which of these does statement address: residency, income, household size, identity documents, prior benefits received?

Use when: You need several independent checks on an applicant's free-text statement in one call, to see which eligibility topics it already covers and which a caseworker still needs to ask about.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { eligibilityFacets } from 'jev-recipes/eligibility-facets';

const result = await eligibilityFacets({
  statement:
    "I have lived at 214 Elm Street, Apt 2, Dayton, Ohio for about six years. I work part time as a cashier at Riverside Market and bring home around $1,400 a month; my hours were cut in July. There are four of us in the household: me, my wife Rosa, and our two kids, ages 7 and 10. I have attached copies of my driver's license and my Social Security card. Please let me know if you need anything else.",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo eligibility-facets`.

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
  "detected": ["statesResidency", "statesIncome", "statesHouseholdSize", "statesIdentityDocuments"],
  "labels": {
    "statesResidency": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.97,
      "confidence": 0.97
    },
    "statesIncome": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.96,
      "confidence": 0.96
    },
    "statesHouseholdSize": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.96,
      "confidence": 0.96
    },
    "statesIdentityDocuments": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.94,
      "confidence": 0.94
    },
    "statesPriorBenefits": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.05,
      "confidence": 0.95
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`job-post-facets`](../job-post-facets/README.md): Use job-post-facets for the same coverage-check pattern over a job posting instead of a benefits application statement.
- [`clarify`](../clarify/README.md): Use clarify to decide whether an applicant's question is too ambiguous to answer, rather than which eligibility topics their statement addresses.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `statement`     | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per label: `statesResidency`, `statesIncome`, `statesHouseholdSize`, `statesIdentityDocuments`, `statesPriorBenefits`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Every label is a coverage check on the supplied text. A stated address, income, or household count is reported as present whether or not it is accurate, verifiable, or within program limits, so eligibility rules and document verification run in code and with a caseworker. Saying that something does not apply, such as having no income, counts as addressing the topic; silence does not. The recipe does not decide eligibility, compute income thresholds, or check documents.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo eligibility-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe eligibility-facets` to inspect the input and result schemas.
