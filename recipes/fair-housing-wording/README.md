# Flag applicant-preference wording in a listing

<!-- BEGIN GENERATED: usage -->

Does listing express a preference for, or limitation on, applicants based on personal characteristics rather than describing the property?

Use when: You need to screen rental or sale listings before publication for wording that steers, prefers, or excludes people by family status, religion, national origin, disability, or similar characteristics, so a human reviewer can look at the flagged ones.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { fairHousingWording } from 'jev-recipes/fair-housing-wording';

const result = await fairHousingWording({
  listing:
    'Bright 1BR garden apartment on a quiet tree-lined street. Hardwood floors, updated kitchen, shared laundry in the basement, off-street parking for one car. $1,450/month, heat included. Perfect for a single professional or a quiet couple; not suitable for families with children. No smoking. Available October 1.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo fair-housing-wording`.

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
  "probability": 0.94,
  "confidence": 0.94,
  "verdict": "flagged"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`question-relevance`](../question-relevance/README.md): Use question-relevance to check whether a screening question asked of an applicant is pertinent, rather than whether listing copy itself expresses a preference.
- [`policy-severity`](../policy-severity/README.md): Use policy-severity to grade how serious a confirmed violation is against a supplied policy, rather than to detect the wording in the first place.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `listing`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `flagged` when Jev's yes probability is at least 0.5 and `clean` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `clean` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict describes the wording of the listing, not its legal status. Which characteristics are protected, which exemptions apply, and what follows from a flag depend on jurisdiction and belong to counsel and to rules in application code. Neutral property descriptions, occupancy limits stated as rules for everyone, and mentions of nearby institutions are not flagged on their own, so a listing can be clean here and still raise questions a reviewer should weigh. The recipe sees only the listing text, not the landlord's replies or screening practices.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo fair-housing-wording` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe fair-housing-wording` to inspect the input and result schemas.
