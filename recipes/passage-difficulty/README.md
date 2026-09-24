# Grade the difficulty of a musical passage

<!-- BEGIN GENERATED: usage -->

How hard is the passage described in passage for a player of instrument, from beginner to virtuoso?

Use when: You are building a practice app, lesson planner, or repertoire search and need to grade described passages or pieces so they can be matched to a player's level.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { passageDifficulty } from 'jev-recipes/passage-difficulty';

const result = await passageDifficulty({
  passage:
    'Continuous sixteenth-note arpeggios across all four strings at quarter note = 144, in E-flat major, moving from first position up to seventh position and back every two bars, with string crossings on every beat and a two-octave leap into the final bar.',
  instrument: 'violin',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo passage-difficulty`.

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
  "confidence": 0.84,
  "probabilities": {
    "0": 0,
    "1": 0.01,
    "2": 0.09,
    "3": 0.84,
    "4": 0.06
  },
  "difficulty": "advanced"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`task-complexity`](../task-complexity/README.md): Use task-complexity to grade how involved a general task is, rather than how hard a musical passage is to play.
- [`audience-fit`](../audience-fit/README.md): Use audience-fit to check whether content suits a described audience, rather than to place a passage on a difficulty scale.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `passage`       | Yes      | string                       |
| `instrument`    | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `instrument` is optional and is omitted from the request when absent.

## Result

`difficulty` is one of `beginner`, `easy`, `intermediate`, `advanced`, `virtuoso`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it for ranking or thresholds where a single label loses information.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade comes from the description alone, so a passage described without tempo, key, or range is graded on what is stated, and a vague description tends toward the middle of the scale rather than a confident extreme. Difficulty is judged relative to typical players of the named instrument, not to a particular student, and the same passage can grade differently on different instruments. Assigning the grade to a level system, choosing repertoire for a specific student, and deciding when a player is ready to move up belong in application code or a teacher.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo passage-difficulty` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe passage-difficulty` to inspect the input and result schemas.
