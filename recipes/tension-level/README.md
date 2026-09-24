# Grade harmonic tension

<!-- BEGIN GENERATED: usage -->

How much harmonic tension does the current point in progression carry, from fully resolved to a peak demanding resolution, given any key supplied?

Use when: A generation loop or accompaniment engine wants to know whether the harmony is at rest, building, or begging for resolution, so it can decide whether to release, hold, or push further.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { tensionLevel } from 'jev-recipes/tension-level';

const result = await tensionLevel({
  progression:
    'Am - F - Dm7 - G7 - G7(b9) with the melody suspended on C over the bass, held for two full bars and swelling (current chord)',
  key: 'C major',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo tension-level`.

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
  "score": 3.76,
  "level": 4,
  "confidence": 0.83,
  "probabilities": {
    "0": 0.01,
    "1": 0.01,
    "2": 0.02,
    "3": 0.13,
    "4": 0.83
  },
  "tension": "peak"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`urgency-signal`](../urgency-signal/README.md): Use urgency-signal to detect an explicit request for urgent attention in a message, not the pull of an unresolved chord.
- [`step-progress`](../step-progress/README.md): Use step-progress to judge whether a new observation advances a task objective, rather than how far a harmony is from its home chord.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `progression`   | Yes      | string                       |
| `key`           | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `key` is optional and is omitted from the request when absent.

## Result

`tension` is one of `resolved`, `low`, `moderate`, `high`, `peak`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it for ranking or thresholds where a single label loses information.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade is a judgment of harmonic pull from chord symbols and annotations, not a theory analysis: identifying the key, computing scale degrees, and reading tension out of a specific voicing are exact questions for application code, which should state the results in `progression` when they matter. Tension is heard relative to a style, so a dominant seventh that is `high` in a chorale can be `low` as the home chord of a blues; describe the style in the text when it would change the reading. The grade says how much the harmony pulls, not what to play next; whether to release, hold, or push further is the caller's decision.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo tension-level` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe tension-level` to inspect the input and result schemas.
