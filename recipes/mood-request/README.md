# Identify a requested mood

<!-- BEGIN GENERATED: usage -->

What mood does the listener's message ask to hear?

Use when: A listener's message asks for a feeling from a musical performance and you need one of a fixed set of moods to steer the next passage.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { moodRequest } from 'jev-recipes/mood-request';

const result = await moodRequest({
  message: 'long day, can we get something soft and dreamy? trying to wind down before bed',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo mood-request`.

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
  "verdict": "calm",
  "confidence": 0.9,
  "probabilities": {
    "happy": 0.01,
    "sad": 0.02,
    "calm": 0.9,
    "energetic": 0.01,
    "tense": 0.01,
    "romantic": 0.03,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`emotion-kind`](../emotion-kind/README.md): Use emotion-kind to label the emotion the writer expresses, rather than the mood they ask the music to take on.
- [`turn-intent`](../turn-intent/README.md): Use turn-intent to find out what a message is doing conversationally before asking which mood it requests.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `message`       | Yes      | string                       |
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

The label is the mood the listener asks the music to take on, which is not the same as how the listener feels, so it should not be used as a read on the listener's emotional state. Requests phrased as a tempo, style, or named piece carry no explicit feeling and land on `unclear`; use a separate classifier for those controls. One label is returned, so a message that asks for two moods at once is resolved to the one pressed hardest and application code should decide how to blend or sequence them.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo mood-request` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe mood-request` to inspect the input and result schemas.
