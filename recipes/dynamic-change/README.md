# Steer the loudness

<!-- BEGIN GENERATED: usage -->

Should the upcoming phrase be softer, equally loud, or louder, judged from audience remarks about volume in context and the dynamics written in recentMaterial?

Use when: Your player must pick a volume level for the next phrase from requests for quiet or power.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { dynamicChange } from 'jev-recipes/dynamic-change';

const result = await dynamicChange({
  context:
    "Two chat messages: 'I'm studying, could you keep it quieter?' and 'seconded, the big chords are a lot'. No requests for more volume in the last five minutes. Stream goal: follow chat when requests agree.",
  recentMaterial:
    'Forte chords in both hands, octaves in the bass, accented downbeats, marked fortissimo for the last eight bars, sustain pedal held through each bar.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo dynamic-change`.

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
  "verdict": "softer",
  "confidence": 0.9,
  "probabilities": {
    "softer": 0.9,
    "same": 0.04,
    "louder": 0.01,
    "unclear": 0.05
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`intent-change`](../intent-change/README.md): Use intent-change to detect that a listener has changed what they want, rather than to choose a dynamics direction from the whole context.
- [`tone-check`](../tone-check/README.md): Use tone-check to check a draft against caller-defined writing criteria; this recipe steers loudness, not prose.

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

`verdict` is one of `softer`, `same`, `louder`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The result is a direction, not a level. Choosing the dynamic marking, key velocity, or output gain to move to, and how fast to get there, belongs in application code. Requests are weighed as `context` states them; if some listeners should count more than others, or a moderator has overridden chat, say so in `context` rather than expecting the recipe to know. The recipe reads the description in `recentMaterial` and cannot check it against audio, so an inaccurate description of the dynamics produces a poorly grounded direction.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo dynamic-change` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe dynamic-change` to inspect the input and result schemas.
