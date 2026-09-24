# Grade how repetitive recent material is

<!-- BEGIN GENERATED: usage -->

How repetitive is recentMaterial, from varied to stuck on one idea?

Use when: A generation loop such as an infinite piano player should notice when it has fallen into a loop or frozen on one figure, so it can inject variation or change direction.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { repetitionLevel } from 'jev-recipes/repetition-level';

const result = await repetitionLevel({
  recentMaterial:
    'C4 E4 G4 E4 | C4 E4 G4 E4 | C4 E4 G4 E4 | C4 E4 G4 E4 | C4 E4 G4 E4 | C4 E4 G4 E4 (all quarter notes, same dynamic, no rests)',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo repetition-level`.

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
  "score": 2.94,
  "level": 3,
  "confidence": 0.85,
  "probabilities": {
    "0": 0.01,
    "1": 0.01,
    "2": 0.07,
    "3": 0.85,
    "4": 0.06
  },
  "repetition": "looping"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`repeated-attempt`](../repeated-attempt/README.md): Use repeated-attempt to check whether one proposed attempt repeats a previous approach to a task, rather than grading the repetition across a stretch of music.
- [`progress-stall`](../progress-stall/README.md): Use progress-stall to detect an agent circling on a task objective, not a melody circling on one figure.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field            | Required | Shape                        |
| ---------------- | -------- | ---------------------------- |
| `recentMaterial` | Yes      | string                       |
| `minConfidence`  | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`repetition` is one of `varied`, `some`, `repetitive`, `looping`, `stuck`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it for ranking or thresholds where a single label loses information.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade is a judgment of repetition as written, not an exact pattern match: detecting a transposed, inverted, or augmented repeat, counting how many bars a figure has recurred, and checking whether a variation stays in the key are exact questions for application code, which should annotate `recentMaterial` when they matter. Repetition is a description, not a fault; an ostinato or a minimalist texture can be `looping` by design, so the threshold at which a generation loop should intervene belongs in application code. Only the material supplied is graded, so a caller that passes a short window will see less repetition than the full performance contains.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo repetition-level` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe repetition-level` to inspect the input and result schemas.
