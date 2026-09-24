# Identify a musical style

<!-- BEGIN GENERATED: usage -->

What style does the described passage or request evoke?

Use when: A passage or a listener's request is described in text and you need one of a fixed set of broad styles to steer what comes next or to label what was played.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { styleKind } from 'jev-recipes/style-kind';

const result = await styleKind({
  description:
    'Walking bass in the left hand under extended seventh and ninth chords, swung eighth notes, a ii-V-I turnaround every four bars, right hand improvising around the changes with chromatic approach tones.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo style-kind`.

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
  "verdict": "jazz",
  "confidence": 0.92,
  "probabilities": {
    "classical": 0.02,
    "jazz": 0.92,
    "blues": 0.03,
    "pop": 0.01,
    "electronic": 0,
    "folk": 0,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`document-role`](../document-role/README.md): Use document-role to identify the purpose of a document rather than the musical style a description evokes.
- [`audience-fit`](../audience-fit/README.md): Use audience-fit to check whether material suits a described audience rather than which style it belongs to.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `description`   | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is one of `classical`, `jazz`, `blues`, `pop`, `electronic`, `folk`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The label is the broad style a description evokes, not a verdict on the genre of any real recording, and sub-genres such as bebop, bossa nova, or house are folded into their nearest broad style. Descriptions that only list notes, chords, or a tempo without idiomatic markers cannot be placed and land on `unclear`; the recipe does not guess from sparse text. Because the recipe reads text rather than audio, a description that misnames a technique or borrows terms loosely produces a label about the description, not the sound.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo style-kind` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe style-kind` to inspect the input and result schemas.
