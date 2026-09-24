# Grade shown reasoning

<!-- BEGIN GENERATED: usage -->

How much reasoning does answer show for its conclusion to question, on a five-level rubric from bare conclusion to rigorous chain?

Use when: You assess whether students or assistants showed their work, separately from whether the final answer is right.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { explanationLevel } from 'jev-recipes/explanation-level';

const result = await explanationLevel({
  question: 'A train leaves at 9:40 and travels 150 km at 60 km/h. When does it arrive?',
  answer:
    'Time is distance over speed: 150 / 60 = 2.5 hours, which is 2 hours 30 minutes. Adding that to 9:40 gives 12:10. Check: 60 km/h for 2 hours covers 120 km, and the remaining 30 km takes half an hour, so 2.5 hours is right. The train arrives at 12:10.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo explanation-level`.

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
  "score": 3.87,
  "level": 4,
  "confidence": 0.89,
  "probabilities": {
    "0": 0,
    "1": 0,
    "2": 0.02,
    "3": 0.09,
    "4": 0.89
  },
  "explanation": "rigorous"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`answer-relevance`](../answer-relevance/README.md): Use answer-relevance to check that the answer addresses the question at all.
- [`certainty-match`](../certainty-match/README.md): Use certainty-match to check whether the confidence expressed fits the reasoning given.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `question`      | Yes      | string                       |
| `answer`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`explanation` is one of `bare`, `asserted`, `partial`, `complete`, or `rigorous`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the levels and can fall between them; use it when a show-your-work component contributes points to a larger grade.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the reasoning question, the five-level wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The rubric grades how much of the reasoning is visible, not whether it is sound. A complete, well-structured argument from a false premise still grades `complete`. Because the recipe rewards shown steps, a correct one-word answer to a trivial question grades `bare`; decide in application code whether the question warranted reasoning at all. Length is ignored, so padding an answer with restatement does not raise the level. To check that the answer addresses the question in the first place use [`answer-relevance`](../answer-relevance/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo explanation-level` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe explanation-level` to inspect the input and result schemas.
