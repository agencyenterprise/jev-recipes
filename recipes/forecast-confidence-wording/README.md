# Grade the certainty of a financial projection

<!-- BEGIN GENERATED: usage -->

How certain is the wording of statement, a financial projection, from explicitly speculative to stated as fact?

Use when: You need to grade how confidently a projection about revenue, prices, returns, or growth is worded, so overconfident statements can be softened or disclaimed before they reach a reader.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { forecastConfidenceWording } from 'jev-recipes/forecast-confidence-wording';

const result = await forecastConfidenceWording({
  statement:
    'Revenue will hit $4.2M next quarter and the stock is going to double by year end. This is the bottom, so anyone waiting is leaving money on the table.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo forecast-confidence-wording`.

<details>
<summary>Illustrative result from the offline fixture</summary>

```json
{
  "model": "demo-fixture",
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0
  },
  "status": "review",
  "score": 3.38,
  "level": 4,
  "confidence": 0.6,
  "probabilities": {
    "0": 0.02,
    "1": 0.04,
    "2": 0.08,
    "3": 0.26,
    "4": 0.6
  },
  "certainty": "asserted"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`uncertainty-expression`](../uncertainty-expression/README.md): Use uncertainty-expression to grade hedging in any statement, rather than specifically the certainty with which a financial projection is asserted.
- [`certainty-match`](../certainty-match/README.md): Use certainty-match to check whether stated confidence fits the supporting evidence, rather than to grade the wording's certainty on its own.

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

`certainty` is one of `speculative`, `hedged`, `balanced`, `confident`, `asserted`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it for ranking or thresholds where a single label loses information.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade reflects how the projection is worded, not whether it is right. A speculative statement can be wrong and an asserted one can be correct; the recipe only tells you how much certainty the reader is being handed. Statements that stack several claims with different postures are graded by their overall stance, so split them in code when each claim needs its own grade. Whether an asserted projection needs a disclaimer or review is a policy decision for the caller.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo forecast-confidence-wording` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe forecast-confidence-wording` to inspect the input and result schemas.
