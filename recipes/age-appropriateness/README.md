# Grade audience age suitability

<!-- BEGIN GENERATED: usage -->

What is the youngest general audience for which content is appropriate, on a five-level rubric?

Use when: You need to route, filter, or label user-generated or model-generated content by audience age before publishing it.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { ageAppropriateness } from 'jev-recipes/age-appropriateness';

const result = await ageAppropriateness({
  content:
    'The two friends raced their bikes down the hill, laughing as the wind whipped past. At the bottom, Maya skidded and scraped her knee, but she grinned and said it was the best ride ever.',
  context: 'Short story submitted to a reading app for young readers.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo age-appropriateness`.

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
  "score": 0.21,
  "level": 0,
  "confidence": 0.82,
  "probabilities": {
    "0": 0.82,
    "1": 0.15,
    "2": 0.03,
    "3": 0,
    "4": 0
  },
  "rating": "everyone"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`audience-fit`](../audience-fit/README.md): Use audience-fit to check whether content suits a specific named audience rather than an age band.
- [`policy-severity`](../policy-severity/README.md): Use policy-severity to grade how seriously content breaches a stated policy.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `content`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

`rating` is one of `everyone`, `children`, `teens`, `mature`, or `adults`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it to order content for review or to pick a conservative cutoff.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the audience question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

This is not a legal or regulatory rating. The rubric approximates common content-rating conventions and does not replace an official classification board, a platform's published standards, or local law. It grades themes, language, and depictions as written and does not judge quality, accuracy, or whether the content breaches a specific policy; use [`policy-severity`](../policy-severity/README.md) for that. Application code maps levels to publishing rules and decides how to treat `review` results.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo age-appropriateness` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe age-appropriateness` to inspect the input and result schemas.
