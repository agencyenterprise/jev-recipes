# Grade draft grounding

<!-- BEGIN GENERATED: usage -->

How much of the substantive content in draft is backed by evidence, on a five-level rubric?

Use when: You need one graded measure of how well a generated answer sticks to its retrieved sources before sending or ranking it.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { groundingLevel } from 'jev-recipes/grounding-level';

const result = await groundingLevel({
  draft:
    'Your Starter plan includes 5 GB of storage and unlimited collaborators. Files larger than 2 GB must be uploaded through the desktop app, and deleted files can be restored for 30 days.',
  evidence:
    'Starter plan: 5 GB storage, up to 10 collaborators. Uploads larger than 2 GB require the desktop application. Deleted files can be restored for 30 days.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo grounding-level`.

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
  "score": 2.91,
  "level": 3,
  "confidence": 0.85,
  "probabilities": {
    "0": 0,
    "1": 0.02,
    "2": 0.09,
    "3": 0.85,
    "4": 0.04
  },
  "grounding": "mostly"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`verify`](../verify/README.md): Use verify for a supported, contradicted, or unsupported verdict on a single claim.
- [`answer-relevance`](../answer-relevance/README.md): Use answer-relevance to check that the draft addresses the question, not just the sources.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `draft`         | Yes      | string                       |
| `evidence`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`grounding` is one of `none`, `weak`, `partial`, `mostly`, or `full`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it to rank candidate drafts or set a send threshold.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the grounding question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade is a single measure for the whole draft. It does not identify which statements are unsupported; use [`verify`](../verify/README.md) per claim when you need to locate or fix them. Support is judged against the supplied `evidence` only, so a statement that is true in the world but absent from the evidence still counts as unsupported. The recipe does not check that the draft answers the question or that the evidence itself is accurate.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo grounding-level` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe grounding-level` to inspect the input and result schemas.
