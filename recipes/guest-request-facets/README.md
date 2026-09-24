# Label the booking facets a guest request states

<!-- BEGIN GENERATED: usage -->

Which of these does request state: travel dates, party size, accessibility needs, a budget, or a special occasion?

Use when: A reservations or concierge assistant receives a free-form guest inquiry and needs to know which standard booking details are already present so it can pre-fill the request and ask only for what is missing.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { guestRequestFacets } from 'jev-recipes/guest-request-facets';

const result = await guestRequestFacets({
  request:
    "Hello, we are hoping to book two rooms from Friday 14 November to Sunday 16 November for my parents' 40th wedding anniversary. There will be six of us: my parents, my husband and me, and our two teenagers. My father uses a walker, so one of the rooms needs to be step-free with a roll-in shower and close to the elevator. Could you also let us know whether the restaurant can do a small celebration dinner on the Saturday?",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo guest-request-facets`.

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
  "detected": ["statesDates", "statesPartySize", "statesAccessibilityNeeds", "statesOccasion"],
  "labels": {
    "statesDates": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.96,
      "confidence": 0.96
    },
    "statesPartySize": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "statesAccessibilityNeeds": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.93,
      "confidence": 0.93
    },
    "statesBudget": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.07,
      "confidence": 0.9299999999999999
    },
    "statesOccasion": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.94,
      "confidence": 0.94
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`message-facets`](../message-facets/README.md): Use message-facets for the general communicative facets of a message, such as questions, deadlines, and requests, rather than booking-specific details.
- [`clarify`](../clarify/README.md): Use clarify to decide whether to ask the guest a follow-up question about the facets this recipe finds missing.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `request`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per label: `statesDates`, `statesPartySize`, `statesAccessibilityNeeds`, `statesBudget`, `statesOccasion`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Each facet reports only that the guest's wording states it; a request that says "mid-November for a few nights" counts as stating dates even though no booking system can act on it, so parse concrete dates, head counts, and amounts in application code. The recipe does not check availability, pricing, or whether the requested accommodations exist at the property, and it does not detect facets the guest implied but did not write. To decide whether to ask the guest about a missing facet, use clarify; to capture general communicative facets such as deadlines or questions, use message-facets.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo guest-request-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe guest-request-facets` to inspect the input and result schemas.
