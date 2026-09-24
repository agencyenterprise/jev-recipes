# Check lyrics against the mood of the music

<!-- BEGIN GENERATED: usage -->

Do lyrics fit the mood and pacing of the music described in music?

Use when: You generate, suggest, or review lyrics for a described track and want to catch lines whose mood or pacing clashes with the music before showing them to a writer.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { lyricMoodFit } from 'jev-recipes/lyric-mood-fit';

const result = await lyricMoodFit({
  lyrics:
    "Hands up, we don't stop till the sun comes up\nBass in the trunk and the whole crew showed up\nNo sleep tonight, turn the lights down low\nOne more round and then we go, go, go",
  music:
    'Slow, sparse piano ballad in D minor at 62 bpm with long sustained chords and a single cello line, written to underscore a grieving scene in a short film.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo lyric-mood-fit`.

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
  "probability": 0.04,
  "confidence": 0.96,
  "verdict": "clashes"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`audience-fit`](../audience-fit/README.md): Use audience-fit to judge whether content suits a described audience, rather than whether lyrics suit a described piece of music.
- [`certainty-match`](../certainty-match/README.md): Use certainty-match for the analogous check that the confidence of a statement matches its evidence.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `lyrics`        | Yes      | string                       |
| `music`         | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `fits` when Jev's yes probability is at least 0.5 and `clashes` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `clashes` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict concerns mood and pacing only: it does not check rhyme scheme, syllable counts, meter, or whether the words sit on a melody, and it cannot hear the track, so it trusts the description of the music as written. Intentional contrast between words and music passes only when the description says the contrast is wanted; otherwise an upbeat lyric on a sombre track is a clash. Judging lyric quality, originality, explicitness, or suitability for an audience is outside this decision and belongs in other checks or with the writer.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo lyric-mood-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe lyric-mood-fit` to inspect the input and result schemas.
