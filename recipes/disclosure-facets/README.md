# Label what a property disclosure addresses

<!-- BEGIN GENERATED: usage -->

Which of these does disclosure address: known defects, prior repairs, environmental hazards, boundary or easement issues, association rules?

Use when: You need several independent checks on a seller's or landlord's disclosure text in one call, to see which topics it covers and which it is silent on before a buyer, tenant, or reviewer relies on it.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { disclosureFacets } from 'jev-recipes/disclosure-facets';

const result = await disclosureFacets({
  disclosure:
    "Seller's Property Disclosure - 27 Birchwood Lane\n\nRoof: Seller is aware of a leak at the chimney flashing that appears during heavy rain; a stain is visible on the upstairs hallway ceiling. Not yet repaired.\nPlumbing: Water heater replaced in March 2024 (receipt available). Kitchen drain line snaked in 2023.\nBasement: Occasional dampness on the north wall after spring thaw; no standing water observed.\nEnvironmental: Radon test in 2022 measured 3.1 pCi/L; no mitigation system installed. House built in 1968; seller has no knowledge of lead-based paint testing.\nHeating: Furnace original to 1998 addition, serviced annually.",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo disclosure-facets`.

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
  "detected": ["statesKnownDefects", "statesPriorRepairs", "statesEnvironmentalHazards"],
  "labels": {
    "statesKnownDefects": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.97,
      "confidence": 0.97
    },
    "statesPriorRepairs": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "statesEnvironmentalHazards": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.94,
      "confidence": 0.94
    },
    "statesBoundaryIssues": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.05,
      "confidence": 0.95
    },
    "statesAssociationRules": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.04,
      "confidence": 0.96
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`privacy-notice-facets`](../privacy-notice-facets/README.md): Use privacy-notice-facets for the same coverage-check pattern over a privacy notice instead of a property disclosure.
- [`clarify`](../clarify/README.md): Use clarify to decide whether a buyer's question about the disclosure is too ambiguous to answer, rather than what the disclosure itself addresses.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `disclosure`    | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per label: `statesKnownDefects`, `statesPriorRepairs`, `statesEnvironmentalHazards`, `statesBoundaryIssues`, `statesAssociationRules`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Every label is a coverage check on the supplied text. A disclosure that denies knowledge of any defect, hazard, or easement is reported as addressing that topic even if the denial is false, so the labels say nothing about honesty or completeness. Which topics a seller must disclose, and in what form, varies by jurisdiction and belongs to counsel and to rules in application code. The recipe does not verify test results, dates, or the existence of an association.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo disclosure-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe disclosure-facets` to inspect the input and result schemas.
