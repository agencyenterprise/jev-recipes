# Detect specific financial advice

<!-- BEGIN GENERATED: usage -->

Does text give a specific recommendation to buy, sell, hold, or allocate money, rather than general education?

Use when: You need a yes/no check on whether an assistant's or user's text crosses from explaining financial concepts into recommending a specific action with money, so the response can be disclaimed, softened, or routed for review.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { financialAdviceSignal } from 'jev-recipes/financial-advice-signal';

const result = await financialAdviceSignal({
  text: 'Honestly, at your age you should just put the whole $20k into VTI and forget about it. Bonds are a waste right now. Sell the individual tech stocks you mentioned and move that money over too.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo financial-advice-signal`.

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
  "probability": 0.91,
  "confidence": 0.91,
  "verdict": "advice"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`response-refusal`](../response-refusal/README.md): Use response-refusal to detect whether a reply declined a request, rather than whether it contains a specific financial recommendation.
- [`certainty-match`](../certainty-match/README.md): Use certainty-match to check whether a reply's stated confidence fits its evidence, rather than whether it recommends a financial action.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `text`          | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `advice` when Jev's yes probability is at least 0.5 and `informational` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `informational` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict is about wording, not law. It flags text that steers the reader toward a specific action with money, but whether that text constitutes regulated financial advice depends on jurisdiction, speaker, and context that the recipe does not see. A hedged recommendation such as "you might consider" still counts as advice when it names a specific action, while a neutral list of options does not. The recipe does not evaluate whether the recommended action is suitable or wise.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo financial-advice-signal` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe financial-advice-signal` to inspect the input and result schemas.
