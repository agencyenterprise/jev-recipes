# Identify a passage's mood

<!-- BEGIN GENERATED: usage -->

What mood does the described musical passage express?

Use when: A musical passage is described in text, such as mode, tempo, register, and dynamics, and you need one of a fixed set of moods to compare against a request or to log what was played.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { passageMood } from 'jev-recipes/passage-mood';

const result = await passageMood({
  passage:
    'D minor, slow tempo around 52 bpm, melody in the low-middle register moving mostly by step and descending at the end of each phrase, sustained chords in the left hand, dynamics piano throughout, frequent suspensions that resolve downward.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo passage-mood`.

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
  "verdict": "sad",
  "confidence": 0.88,
  "probabilities": {
    "happy": 0,
    "sad": 0.88,
    "calm": 0.07,
    "energetic": 0,
    "tense": 0.02,
    "romantic": 0.02,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`emotion-kind`](../emotion-kind/README.md): Use emotion-kind to label the emotion a writer expresses in a message, rather than the mood a described piece of music conveys.
- [`outcome-framing`](../outcome-framing/README.md): Use outcome-framing to label gain and loss wording about an outcome, not the affect of a musical description.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `passage`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is one of `happy`, `sad`, `calm`, `energetic`, `tense`, `romantic`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The label is the conventional affect of the musical features the text describes, which is not a claim about how any real listener felt or what the performer meant. Because the recipe reads a description rather than audio, a vague or inaccurate description gives a mood about the words, and sparse descriptions land on `unclear`. Mixed passages resolve to one dominant mood, so application code that needs a blend should describe the passage in sections and call the recipe on each.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo passage-mood` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe passage-mood` to inspect the input and result schemas.
