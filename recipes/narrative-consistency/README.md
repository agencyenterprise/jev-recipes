# Check a narrative for internal contradictions

<!-- BEGIN GENERATED: usage -->

Are the statements within narrative consistent with each other in timeline, cause, and extent, with no statement contradicting another in the same account?

Use when: A claims, incident, or intake system receives a single free-form account and needs to flag accounts that contradict themselves before a person reviews them or a downstream step relies on them.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { narrativeConsistency } from 'jev-recipes/narrative-consistency';

const result = await narrativeConsistency({
  narrative:
    'I was at the office all afternoon on Thursday and got home around 7 pm to find the kitchen flooded. The dishwasher supply hose had split. I heard the hose burst at about 2 pm and shut off the water right away, so the water only ran for a few minutes. Even so, the water reached the hallway and the two bedrooms, and the flooring in all three rooms will need replacing. Nothing outside the kitchen was affected.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo narrative-consistency`.

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
  "probability": 0.07,
  "confidence": 0.9299999999999999,
  "verdict": "contradictory"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`evidence-conflict`](../evidence-conflict/README.md): Use evidence-conflict when you have two separate passages and need to know whether they conflict about a question; this recipe checks one account against itself.
- [`answer-consistency`](../answer-consistency/README.md): Use answer-consistency to compare two discrete statements rather than to scan a single narrative for internal contradictions.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `narrative`     | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `consistent` when Jev's yes probability is at least 0.5 and `contradictory` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `contradictory` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The gate tells you only whether the account agrees with itself; a consistent narrative can still be untrue, and a contradictory one may reflect an honest slip rather than deception, so it supports triage and follow-up questions rather than any determination of credibility or fraud. It compares statements as written and does not compute elapsed times, convert units, or check the account against policies, records, or other witnesses; do that in application code or with a two-passage recipe such as evidence-conflict. Vague or incomplete narratives are not contradictory; if you need to know what the account fails to state, use an intake facets recipe instead.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo narrative-consistency` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe narrative-consistency` to inspect the input and result schemas.
