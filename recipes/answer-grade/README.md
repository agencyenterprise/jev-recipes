# Grade an answer against a rubric

<!-- BEGIN GENERATED: usage -->

How well does answer meet rubric as a response to question, on a five-level rubric from no credit to full credit?

Use when: You grade free-text answers against a written rubric and want a graded level with a confidence you can route to a human grader when low.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { answerGrade } from 'jev-recipes/answer-grade';

const result = await answerGrade({
  question: 'Explain why the sky appears blue during the day.',
  answer:
    'Sunlight contains all colors. When it passes through the atmosphere, gas molecules scatter shorter wavelengths like blue much more than longer wavelengths like red, so blue light reaches our eyes from every direction in the sky.',
  rubric:
    'Full credit requires: (1) sunlight is made of many wavelengths; (2) atmospheric molecules scatter light; (3) shorter wavelengths scatter more strongly (Rayleigh scattering); (4) explains why violet is not the dominant perceived color.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo answer-grade`.

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
  "score": 2.95,
  "level": 3,
  "confidence": 0.81,
  "probabilities": {
    "0": 0,
    "1": 0.02,
    "2": 0.09,
    "3": 0.81,
    "4": 0.08
  },
  "grade": "mostly"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`draft-compare`](../draft-compare/README.md): Use draft-compare to rank two answers against the same rubric instead of grading one.
- [`grounding-level`](../grounding-level/README.md): Use grounding-level when the criterion is fidelity to a source passage rather than a rubric.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `question`      | Yes      | string                       |
| `answer`        | Yes      | string                       |
| `rubric`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`grade` is one of `none`, `minimal`, `partial`, `mostly`, or `full`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the levels and can fall between them; use it when you need a finer-grained number than five bands, such as converting to points.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the grading question, the five-level wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade is only as sharp as the supplied `rubric`. A rubric that lists concrete criteria produces a defensible grade; a rubric that says "good explanation" does not. The recipe does not fact-check beyond what the rubric asks for, so an answer that is fluent but wrong can still score well against a rubric that never names correctness. Length, style, and effort are ignored unless the rubric mentions them. To rank two answers under one rubric use [`draft-compare`](../draft-compare/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo answer-grade` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe answer-grade` to inspect the input and result schemas.
