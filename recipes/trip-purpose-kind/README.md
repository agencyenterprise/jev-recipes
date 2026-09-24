# Identify the purpose of a trip

<!-- BEGIN GENERATED: usage -->

What purpose does the traveler's message express for the trip: business, leisure, a family visit, medical care, relocation, or attending an event?

Use when: A travel assistant needs to route a traveler's message to the right search defaults, policy, or recommendations based on why they are traveling, using only what the message and any prior context say.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { tripPurposeKind } from 'jev-recipes/trip-purpose-kind';

const result = await tripPurposeKind({
  message:
    "We are moving to Lisbon for good at the end of October. My partner's job transfers her there permanently and the kids start school in January. I need one-way flights for the four of us and somewhere to stay for the first three weeks until our long-term lease begins on 20 November.",
  context: 'Traveler previously asked this assistant about shipping household goods overseas.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo trip-purpose-kind`.

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
  "verdict": "relocation",
  "confidence": 0.9,
  "probabilities": {
    "business": 0.02,
    "leisure": 0.01,
    "family_visit": 0.02,
    "medical": 0.01,
    "relocation": 0.9,
    "event": 0.01,
    "unclear": 0.03
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`turn-intent`](../turn-intent/README.md): Use turn-intent to classify what a message is doing conversationally, such as requesting or correcting, rather than why the person is traveling.
- [`buying-intent`](../buying-intent/README.md): Use buying-intent to judge how close the traveler is to booking; this recipe identifies only the reason for the trip.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `message`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

`verdict` is one of `business`, `leisure`, `family_visit`, `medical`, `relocation`, `event`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The verdict names the purpose the traveler's own words express; it does not verify that purpose or infer one from the destination, the season, or the price of the fare. Trips that mix purposes, such as a conference followed by a week of sightseeing, resolve to the dominant one or to unclear rather than to several labels, so segment such trips in your own logic if you need both. Any decision that depends on the purpose, such as applying a corporate travel policy, a tax treatment, or a medical-travel benefit, belongs in application code with its own eligibility rules.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo trip-purpose-kind` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe trip-purpose-kind` to inspect the input and result schemas.
