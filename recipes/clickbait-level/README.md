# Grade clickbait level

<!-- BEGIN GENERATED: usage -->

How much does headline rely on curiosity gaps, exaggeration, or emotional bait instead of stating what the content is?

Use when: You want to rank, flag, or reject headlines that manipulate readers into clicking rather than telling them what they will get.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { clickbaitLevel } from 'jev-recipes/clickbait-level';

const result = await clickbaitLevel({
  headline: 'This One Kitchen Habit Is Secretly Destroying Your Health - Doctors Are Stunned',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo clickbait-level`.

<details>
<summary>Illustrative result from the offline fixture</summary>

```json
{
  "model": "demo-fixture",
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0
  },
  "status": "review",
  "score": 2.92,
  "level": 3,
  "confidence": 0.62,
  "probabilities": {
    "0": 0.01,
    "1": 0.04,
    "2": 0.15,
    "3": 0.62,
    "4": 0.18
  },
  "bait": "heavy"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`outcome-framing`](../outcome-framing/README.md): Use outcome-framing to judge whether a message frames a result as a gain or a loss.
- [`question-leading`](../question-leading/README.md): Use question-leading to detect questions that push the reader toward a particular answer.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `headline`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`bait` is one of `none`, `mild`, `moderate`, `heavy`, `extreme`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it for ranking or thresholds where a single label loses information.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade reflects how the headline is worded, not whether the article behind it delivers or whether the claim is true. It does not predict click-through, engagement, or reader trust. Deciding what level to block, rewrite, or flag for an editor belongs in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo clickbait-level` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe clickbait-level` to inspect the input and result schemas.
