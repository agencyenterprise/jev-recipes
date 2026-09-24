# Check a patch against a requested sound

<!-- BEGIN GENERATED: usage -->

Does the patch or preset described in patch deliver the sound character asked for in request?

Use when: You are building a preset browser, sound search, or patch recommender and need to check whether a candidate patch description actually delivers what the user asked for before showing or loading it.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { soundMatch } from 'jev-recipes/sound-match';

const result = await soundMatch({
  request:
    'A warm analog-style pad with a slow attack and some gentle movement, for the intro of a downtempo track.',
  patch:
    'Preset: Dusk Pad. Two sawtooth oscillators detuned 9 cents, one octave down sub sine at -12 dB. 24 dB low-pass filter, cutoff at 35 percent with a slow envelope adding 20 percent over 2 seconds. Amp envelope: attack 1.6 s, decay 0.5 s, sustain 100 percent, release 3.2 s. Slow triangle LFO at 0.15 Hz on filter cutoff, depth 8 percent. Stereo chorus and a long hall reverb at 30 percent mix.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo sound-match`.

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
  "probability": 0.92,
  "confidence": 0.92,
  "verdict": "matches"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`product-match`](../product-match/README.md): Use product-match to check a product listing against a shopping request, rather than a synth patch against a described sound.
- [`audience-fit`](../audience-fit/README.md): Use audience-fit to judge whether content suits a described audience, rather than whether a patch produces a described sound.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `request`       | Yes      | string                       |
| `patch`         | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `matches` when Jev's yes probability is at least 0.5 and `mismatched` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `mismatched` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict compares words to words: it judges the patch as described, so an inaccurate or sparse description can pass or fail regardless of how the patch actually sounds, and parameter values are read for what they imply rather than auditioned. Only the qualities named in the request are checked, and a mismatched verdict does not say which quality failed or how to fix it. Whether the user owns the synth or plugin the patch needs, and whether to load, rank, or hide a mismatched patch, belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo sound-match` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe sound-match` to inspect the input and result schemas.
