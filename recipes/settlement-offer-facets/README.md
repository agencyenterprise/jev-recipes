# Label the facets a settlement offer letter states

<!-- BEGIN GENERATED: usage -->

Which of these does offer state: the settlement amount, the basis for that amount, a deadline to respond, release terms, and how to dispute or appeal?

Use when: A claims quality or consumer-advocacy tool reviews settlement offer letters and needs to know which standard elements each letter contains before checking it against a policy or template.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { settlementOfferFacets } from 'jev-recipes/settlement-offer-facets';

const result = await settlementOfferFacets({
  offer:
    "Re: Claim 44-01927, water damage at 27 Alder Court. Dear Ms. Okafor, we have completed our review and are pleased to offer $18,640.00 in full settlement of this claim. This figure reflects the contractor's repair estimate of $21,140.00, less your $2,500.00 policy deductible. Please sign and return the enclosed acceptance form within 30 days of the date of this letter. By accepting this payment you agree that it constitutes full and final settlement of all claims arising from the 8 March incident and release Northbridge Mutual from any further liability in connection with it. Payment will be issued within 10 business days of receiving your signed form.",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo settlement-offer-facets`.

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
  "detected": ["statesAmount", "statesBasis", "statesDeadline", "statesReleaseTerms"],
  "labels": {
    "statesAmount": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.97,
      "confidence": 0.97
    },
    "statesBasis": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.94,
      "confidence": 0.94
    },
    "statesDeadline": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "statesReleaseTerms": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.93,
      "confidence": 0.93
    },
    "statesDisputePath": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.06,
      "confidence": 0.94
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`invoice-facets`](../invoice-facets/README.md): Use invoice-facets for the parallel completeness check on an invoice rather than a settlement offer letter.
- [`clarify`](../clarify/README.md): Use clarify to decide whether to ask the sender for the elements this recipe finds missing.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `offer`         | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per label: `statesAmount`, `statesBasis`, `statesDeadline`, `statesReleaseTerms`, `statesDisputePath`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Each element reports only that the letter's wording states it; a letter that says "we will pay a fair amount" does not state an amount, while one that writes a figure does, regardless of whether the figure is reasonable. The recipe makes no judgment about fairness, accuracy, or enforceability, and a letter that states every element can still be unlawful or misleading; route legal and regulatory questions to a qualified reviewer. Parse actual amounts, dates, and response windows in application code, and use clarify to decide whether to ask the sender about an element the letter omits.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo settlement-offer-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe settlement-offer-facets` to inspect the input and result schemas.
