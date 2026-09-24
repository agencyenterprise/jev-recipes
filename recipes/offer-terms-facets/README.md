# Label what a property offer states

<!-- BEGIN GENERATED: usage -->

Which of these does offer state: a price, financing, contingencies, a closing or move-in date, an earnest money or security deposit?

Use when: You need several independent presence checks on a purchase or lease offer in one call, to spot missing terms before it is countersigned, countered, or entered into a transaction system.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { offerTermsFacets } from 'jev-recipes/offer-terms-facets';

const result = await offerTermsFacets({
  offer:
    'Offer to purchase 118 Linden Court\n\nBuyers: Marcus and Dana Reyes\nPurchase price: $412,000\nFinancing: conventional 30-year loan, 20% down; pre-approval letter from Summit Federal attached.\nContingencies: home inspection within 10 days of acceptance; financing contingency through closing.\nClosing: on or before November 15, 2026, with possession at closing.\nInclusions: kitchen appliances and washer/dryer.\n\nThis offer expires at 6:00 PM on September 26, 2026.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo offer-terms-facets`.

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
  "detected": ["statesPrice", "statesFinancing", "statesContingencies", "statesClosingDate"],
  "labels": {
    "statesPrice": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.98,
      "confidence": 0.98
    },
    "statesFinancing": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "statesContingencies": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.94,
      "confidence": 0.94
    },
    "statesClosingDate": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.93,
      "confidence": 0.93
    },
    "statesDeposit": {
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

- [`clarify`](../clarify/README.md): Use clarify to decide whether a buyer's or tenant's request is too ambiguous to act on, rather than which terms a written offer states.
- [`invoice-facets`](../invoice-facets/README.md): Use invoice-facets for the same presence-check pattern over invoice text instead of offer terms.

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

`labels` holds one check per label: `statesPrice`, `statesFinancing`, `statesContingencies`, `statesClosingDate`, `statesDeposit`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Every label is a presence check on the supplied text. A stated price, closing date, or deposit is reported as present even if it is unrealistic, inconsistent with the listing, or internally contradictory, so parse and compare values in code. An offer that expressly waives contingencies counts as stating them, because the term has been addressed; an offer that is silent does not. The recipe does not judge whether the offer is complete under local forms, whether it is competitive, or whether it should be accepted.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo offer-terms-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe offer-terms-facets` to inspect the input and result schemas.
