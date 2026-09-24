# Grade how easy patient instructions are to follow

<!-- BEGIN GENERATED: usage -->

How easy are instructions to follow for a general reader, from dense jargon to plain and stepwise?

Use when: You are generating or reviewing after-visit instructions, discharge notes, or medication directions and need to catch wording a patient cannot act on.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { instructionReadability } from 'jev-recipes/instruction-readability';

const result = await instructionReadability({
  instructions:
    'Administer 500 mg PO BID with food x 10 days. Do not discontinue prematurely. If a dose is missed, take it as soon as possible unless the next dose is imminent. Contact the clinic for any rash or swelling.',
  audience: 'Adult patient with no medical background, reading the after-visit summary at home.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo instruction-readability`.

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
  "score": 1.14,
  "level": 1,
  "confidence": 0.82,
  "probabilities": {
    "0": 0.04,
    "1": 0.82,
    "2": 0.11,
    "3": 0.02,
    "4": 0.01
  },
  "readability": "heavy"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`audience-fit`](../audience-fit/README.md): Use audience-fit to judge whether the whole text suits a named audience beyond how easy the steps are to follow.
- [`tone-check`](../tone-check/README.md): Use tone-check to judge the register and tone of the instructions rather than their readability.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `instructions`  | Yes      | string                       |
| `audience`      | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `audience` is optional and is omitted from the request when absent.

## Result

`readability` is one of `dense`, `heavy`, `mixed`, `plain`, `clear`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it for ranking or thresholds where a single label loses information.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade describes how easy the wording is to follow, not whether it is correct: dangerously wrong instructions can grade as clear, and correct ones as dense. It does not verify doses, check the instructions against a care plan, or produce a formal reading-level number; use a readability formula in code if you need a metric and clinical review for the content. When audience is supplied the grade is relative to that reader, so the same text can grade differently for a nurse than for a patient.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo instruction-readability` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe instruction-readability` to inspect the input and result schemas.
