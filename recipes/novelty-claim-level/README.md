# Grade how strongly a statement claims novelty

<!-- BEGIN GENERATED: usage -->

How strongly does the wording of statement claim novelty for a contribution, from no novelty claim to first-ever or unprecedented?

Use when: You are reviewing abstracts, introductions, grant text, or press copy and want to flag how hard the wording sells the contribution as new, so overclaiming can be checked against the actual related work.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { noveltyClaimLevel } from 'jev-recipes/novelty-claim-level';

const result = await noveltyClaimLevel({
  statement:
    'To the best of our knowledge, this is the first study to demonstrate that the effect transfers across species, a result no existing theoretical framework predicted.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo novelty-claim-level`.

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
  "score": 3.86,
  "level": 4,
  "confidence": 0.9,
  "probabilities": {
    "0": 0,
    "1": 0.01,
    "2": 0.02,
    "3": 0.07,
    "4": 0.9
  },
  "novelty": "unprecedented"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`certainty-match`](../certainty-match/README.md): Use certainty-match to check whether stated confidence matches the evidence, rather than how much novelty the wording claims.
- [`outcome-framing`](../outcome-framing/README.md): Use outcome-framing to label how a result is framed as gain or loss, rather than how new it is said to be.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `statement`     | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`novelty` is one of `none`, `incremental`, `notable`, `substantial`, `unprecedented`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it for ranking or thresholds where a single label loses information.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade measures how strongly the words claim novelty, not whether the work is new; a modest sentence can describe a genuine first and a bold one can describe a rediscovery. Checking the claim against the actual related work remains the reviewer's task, and the recipe does not search the literature. Each statement is graded alone, so scoring a whole abstract or paper means splitting it and combining the grades in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo novelty-claim-level` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe novelty-claim-level` to inspect the input and result schemas.
