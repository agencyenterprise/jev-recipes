# Check question alignment to a learning objective

<!-- BEGIN GENERATED: usage -->

Does question assess the skill or knowledge stated in objective, rather than something adjacent?

Use when: You generate or review quiz and exam items and want to catch questions that test recall or a neighboring topic instead of the stated objective.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { objectiveFit } from 'jev-recipes/objective-fit';

const result = await objectiveFit({
  objective:
    "Students will be able to apply Newton's second law to compute the net force on an object given its mass and acceleration.",
  question: "State Newton's second law of motion in words and give the name of the unit of force.",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo objective-fit`.

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
  "probability": 0.08,
  "confidence": 0.92,
  "verdict": "misses"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`instruction-fit`](../instruction-fit/README.md): Use instruction-fit to check whether a written instruction covers a given task and context.
- [`query-specificity`](../query-specificity/README.md): Use query-specificity to check whether a question identifies a focused information need.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `objective`     | Yes      | string                       |
| `question`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `assesses` when Jev's yes probability is at least 0.5 and `misses` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.08 yes probability yields `misses` with 0.92 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and hold the item for an instructor to check rather than adding it to the assessment.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe checks whether answering the question requires the skill or knowledge the objective names, at the level it names. A recall question against an "apply" objective is `misses`, as is a question on a neighboring topic the objective does not cover. It does not judge difficulty, clarity, or whether the answer key is correct, and an `assesses` verdict says nothing about how well the item discriminates between students. The check is only as sharp as the objective: an objective that names a broad topic without a verb or level will accept many questions.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo objective-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe objective-fit` to inspect the input and result schemas.
