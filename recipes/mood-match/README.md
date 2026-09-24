# Check a passage against a requested mood

<!-- BEGIN GENERATED: usage -->

Does the described passage deliver requestedMood?

Use when: A listener asked for a mood and a passage has been generated or described, and you want to check the passage delivers that mood before playing or committing to it.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { moodMatch } from 'jev-recipes/mood-match';

const result = await moodMatch({
  requestedMood: 'calm, something to relax to',
  passage:
    'Fast tempo around 160 bpm, driving repeated sixteenth notes in the left hand, diminished and augmented chords with frequent chromatic shifts, sudden accents on off-beats, fortissimo throughout, melody leaping in the high register.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo mood-match`.

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
  "verdict": "mismatched"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`audience-fit`](../audience-fit/README.md): Use audience-fit to check material against a described audience rather than a described musical passage against a requested mood.
- [`instruction-fit`](../instruction-fit/README.md): Use instruction-fit to check whether an instruction's scope covers a task, rather than whether music delivers a feeling.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `requestedMood` | Yes      | string                       |
| `passage`       | Yes      | string                       |
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

The verdict compares a description to a requested mood using conventional musical affect; it cannot hear audio, so an inaccurate `passage` gives a verdict about the words rather than the sound. Listeners differ, and a `matches` verdict does not promise that the person who asked will feel the mood, only that the described features conventionally carry it. A `mismatched` verdict is a flag to regenerate or adjust; choosing what to change belongs to application code or a separate steering decision.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo mood-match` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe mood-match` to inspect the input and result schemas.
