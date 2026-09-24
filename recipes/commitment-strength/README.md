# Grade commitment strength

<!-- BEGIN GENERATED: usage -->

How firmly does statement commit its speaker to an action or outcome, on a five-level rubric?

Use when: You need to grade how strongly a message commits someone to act before tracking it as a promise or follow-up.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { commitmentStrength } from 'jev-recipes/commitment-strength';

const result = await commitmentStrength({
  statement:
    'I will have the revised contract in your inbox by 5pm Thursday, and I will call you as soon as it is sent.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo commitment-strength`.

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
  "score": 3.85,
  "level": 4,
  "confidence": 0.87,
  "probabilities": {
    "0": 0,
    "1": 0,
    "2": 0.02,
    "3": 0.11,
    "4": 0.87
  },
  "commitment": "binding"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`promise-check`](../promise-check/README.md): Use promise-check to detect whether a message contains a promise at all.
- [`certainty-match`](../certainty-match/README.md): Use certainty-match to compare expressed certainty with the evidence rather than commitment to act.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `statement`     | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

`commitment` is one of `none`, `vague`, `conditional`, `firm`, or `binding`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it to rank follow-ups or to decide which statements to track as obligations.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the commitment question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade reads the wording of a statement. It does not know whether the speaker is sincere, has the authority to commit, or will follow through, and a `binding` grade is not a legal finding. Statements about other people's obligations grade on how firmly the speaker commits, not on what the third party will do. Use [`promise-check`](../promise-check/README.md) when you only need to know whether a promise is present. Application code decides which levels to track and remind on.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo commitment-strength` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe commitment-strength` to inspect the input and result schemas.
