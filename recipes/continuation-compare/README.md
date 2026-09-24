# Compare two musical continuations

<!-- BEGIN GENERATED: usage -->

Which of firstContinuation and secondContinuation better follows the musical context in motif, contour, harmony, and any style supplied?

Use when: A generation loop has produced two candidate continuations for a passage and wants a head-to-head preference before committing to one.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { continuationCompare } from 'jev-recipes/continuation-compare';

const result = await continuationCompare({
  context:
    'G major, 4/4. Opening motif: G4 A4 B4 D5 | B4 A4 G4 (half). A rising line to the fifth answered by a stepwise descent home.',
  firstContinuation:
    'D5 E5 F#5 A5 | F#5 E5 D5 (half). The motif transposed up a fifth, same rhythm, same rise-and-fall contour.',
  secondContinuation:
    'C#4 (eighth) G#5 (eighth) Bb3 (quarter) rest | Eb5 (dotted half). Wide chromatic leaps in a new, jagged rhythm.',
  style: 'Celtic air, lyrical and unhurried',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo continuation-compare`.

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
  "verdict": "first",
  "confidence": 0.91,
  "probabilities": {
    "first": 0.91,
    "second": 0.02,
    "tie": 0.02,
    "neither": 0.03,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`draft-compare`](../draft-compare/README.md): Use draft-compare to choose between two text drafts under a rubric, not between two musical continuations of a passage.
- [`action-compare`](../action-compare/README.md): Use action-compare to compare two next steps against a goal and constraints, rather than two continuations against a musical context.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field                | Required | Shape                        |
| -------------------- | -------- | ---------------------------- |
| `context`            | Yes      | string                       |
| `firstContinuation`  | Yes      | string                       |
| `secondContinuation` | Yes      | string                       |
| `style`              | No       | string                       |
| `minConfidence`      | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `style` is optional and is omitted from the request when absent.

## Result

`verdict` is `first`, `second`, `tie`, `neither`, or `unclear`. `first` and `second` name the preferred candidate. `tie` means both fit about equally. `neither` means no candidate fits, which is a confident answer rather than a failure.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. `probabilities` covers all five outcomes.

## Reuse and calls

Uses the shared comparison helper, which fixes the five outcomes and tells Jev that presentation order is irrelevant. This folder owns the question wording and the four outcome descriptions. A live invocation makes one logical Jev request.

## Limits

The comparison is a judgment of musical sense from the written notes and descriptions, not a theory check: whether a continuation stays in the key, how far its leaps reach, and whether it fills the bar are exact questions for application code, which should annotate the text when they matter. A preference between two continuations says nothing about their absolute quality, so `first` can win against a poor `second` and still be a weak continuation; `neither` covers the case where both break with `context`. Style preference is a matter of taste, so continuations that fit similarly well can come out `tie` or swap order on different runs.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo continuation-compare` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe continuation-compare` to inspect the input and result schemas.
