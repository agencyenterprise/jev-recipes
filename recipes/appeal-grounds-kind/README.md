# Classify the ground an appeal asserts

<!-- BEGIN GENERATED: usage -->

What ground does appeal primarily assert: a factual error, a procedural error, new evidence, hardship, a misapplied rule, or something else?

Use when: You need to sort incoming appeals of a benefits, permit, enforcement, or academic decision by the kind of argument they make, so each reaches the right reviewer or template before anyone reads the file.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { appealGroundsKind } from 'jev-recipes/appeal-grounds-kind';

const result = await appealGroundsKind({
  appeal:
    "I am appealing the denial dated September 3. The letter says my household income is $4,200 per month, which is over the limit. That number includes my adult son's wages, but he moved out in March and no longer lives with me; I told the office this at my interview. My actual household income is my own $2,600 per month. Please correct the income figure and reconsider my application.",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo appeal-grounds-kind`.

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
  "verdict": "factual_error",
  "confidence": 0.86,
  "probabilities": {
    "factual_error": 0.86,
    "procedural_error": 0.01,
    "new_evidence": 0.06,
    "hardship": 0.02,
    "misapplied_rule": 0.03,
    "other": 0.01,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`correction-target`](../correction-target/README.md): Use correction-target to identify what part of a prior output a correction points at, rather than what kind of ground an appeal asserts.
- [`feedback-kind`](../feedback-kind/README.md): Use feedback-kind to classify general feedback on a product or service, rather than a formal appeal of a decision.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `appeal`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is one of `factual_error`, `procedural_error`, `new_evidence`, `hardship`, `misapplied_rule`, `other`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The label describes the argument the appellant makes as worded, not whether it is true or whether the appeal should be granted. An appeal that mixes grounds, such as a factual error backed by a new document, is classified by the ground it presses hardest, so split it in code when each ground needs its own review. Timeliness, standing, and whether the process allows the asserted ground are checked in application code; `other` covers real appeals outside the named grounds, while text that does not contest a decision lands on `unclear`.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo appeal-grounds-kind` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe appeal-grounds-kind` to inspect the input and result schemas.
