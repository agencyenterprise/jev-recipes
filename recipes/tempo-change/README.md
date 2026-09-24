# Steer the tempo

<!-- BEGIN GENERATED: usage -->

Should the beat slow down, hold, or speed up next, given what listeners said about pace in context and how fast recentMaterial moved?

Use when: A live loop has read chat about speed and must choose one pacing direction for the coming bars.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { tempoChange } from 'jev-recipes/tempo-change';

const result = await tempoChange({
  context:
    "Three chat messages in the last minute: 'pick it up a little', 'faster!!', and 'this is dragging'. No one asked for it to stay slow. Stream goal: follow chat when requests agree.",
  recentMaterial:
    'Slow ballad in E-flat major at about 60 bpm, half notes and quarter notes in the left hand, sparse melody, moderate dynamics, held for the last two minutes.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo tempo-change`.

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
  "verdict": "faster",
  "confidence": 0.9,
  "probabilities": {
    "slower": 0.01,
    "same": 0.05,
    "faster": 0.9,
    "unclear": 0.04
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`intent-change`](../intent-change/README.md): Use intent-change to detect that a listener has changed what they want, rather than to choose a tempo direction from the whole context.
- [`step-progress`](../step-progress/README.md): Use step-progress to judge movement toward a caller-defined objective rather than a tempo adjustment.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field            | Required | Shape                        |
| ---------------- | -------- | ---------------------------- |
| `context`        | Yes      | string                       |
| `recentMaterial` | Yes      | string                       |
| `minConfidence`  | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is one of `slower`, `same`, `faster`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The result is a direction, not a number. Choosing how many beats per minute to shift, how quickly to ramp, and where the floor and ceiling sit belongs in application code. Requests are weighed as `context` states them; if some listeners should count more than others, or a moderator has overridden chat, say so in `context` rather than expecting the recipe to know. The recipe reads the description in `recentMaterial` and cannot check it against audio, so a stale or inaccurate description produces a poorly grounded direction.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo tempo-change` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe tempo-change` to inspect the input and result schemas.
