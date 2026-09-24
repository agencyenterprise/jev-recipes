# Check whether an itinerary is feasible in sequence

<!-- BEGIN GENERATED: usage -->

Can the consecutive items in itinerary be carried out in the order described: enough transfer time between them, each location reachable from the previous one, and no overlapping commitments?

Use when: A travel or concierge assistant has drafted or received a day-by-day itinerary in plain language and needs a yes/no sanity check that the sequence hangs together before presenting or booking it.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { itineraryFeasibility } from 'jev-recipes/itinerary-feasibility';

const result = await itineraryFeasibility({
  itinerary:
    'Saturday: 09:10 depart Boston Logan on a flight landing at New York JFK at 10:35. 11:00 to 12:30 private tour at the Metropolitan Museum of Art on the Upper East Side. 12:00 lunch reservation for four at a restaurant in Brooklyn Heights. 14:00 to 17:00 guided walk through Central Park. 17:30 check in at the hotel in Midtown. 20:00 Broadway show, curtain at 20:00 sharp.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo itinerary-feasibility`.

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
  "probability": 0.06,
  "confidence": 0.94,
  "verdict": "infeasible"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`slot-fit`](../slot-fit/README.md): Use slot-fit to check one proposed time against stated availability constraints rather than a whole sequence of items against each other.
- [`clause-conflict`](../clause-conflict/README.md): Use clause-conflict when the question is whether two written requirements can both be satisfied, rather than whether a sequence of timed items can be carried out.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `itinerary`     | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `feasible` when Jev's yes probability is at least 0.5 and `infeasible` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `infeasible` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict rests on the times, places, and durations written in the itinerary; it does not consult maps, transit schedules, or traffic, so compute exact travel times and distances in application code before relying on a feasible result. It does not know opening hours, booking availability, or time zone differences unless the itinerary states them, and it does not judge whether the plan is enjoyable or well priced. Use the infeasible verdict to flag a sequence for revision, not to decide which item to move; that choice belongs to your planner or the traveler.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo itinerary-feasibility` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe itinerary-feasibility` to inspect the input and result schemas.
