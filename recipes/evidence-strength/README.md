# Grade evidence strength

<!-- BEGIN GENERATED: usage -->

How strongly does evidence support the entire claim, on a five-level rubric?

Use when: You need a graded strength for weighting or ranking evidence, not just a supported or unsupported label.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { evidenceStrength } from 'jev-recipes/evidence-strength';

const result = await evidenceStrength({
  claim: 'Guests can export reports as CSV.',
  evidence:
    'Guest accounts may export any report they can view. Export formats include CSV and PDF.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo evidence-strength`.

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
  "score": 3.83,
  "level": 4,
  "confidence": 0.86,
  "probabilities": {
    "0": 0.01,
    "1": 0.01,
    "2": 0.03,
    "3": 0.09,
    "4": 0.86
  },
  "strength": "conclusive"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`verify`](../verify/README.md): Use verify for a categorical supported, contradicted, or unsupported verdict per claim.
- [`answerability`](../answerability/README.md): Use answerability to decide whether evidence can answer a whole question.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `claim`         | Yes      | string                       |
| `evidence`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`strength` is one of `none`, `weak`, `moderate`, `strong`, or `conclusive`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it for ranking or weighting where a single label loses information.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the strength question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The rubric grades support for the whole claim. Evidence that contradicts the claim scores at the lowest level alongside irrelevant evidence; use [`verify`](../verify/README.md) when contradiction must be distinguished. The recipe does not check whether the evidence itself is accurate or current.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo evidence-strength` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe evidence-strength` to inspect the input and result schemas.
