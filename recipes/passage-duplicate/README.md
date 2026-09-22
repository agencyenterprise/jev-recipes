# Compare passages for duplication

<!-- BEGIN GENERATED: usage -->

How much material information do firstPassage and secondPassage share?

Use when: You want to detect duplicate or overlapping information in two passages.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { passageDuplicate } from 'jev-recipes/passage-duplicate';

const result = await passageDuplicate({
  firstPassage: 'Select Forgot password to receive a reset email.',
  secondPassage: 'Use Forgot password and we will email a reset link.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo passage-duplicate`.

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
  "verdict": "duplicate",
  "confidence": 0.96,
  "probabilities": {
    "duplicate": 1,
    "overlapping": 0,
    "distinct": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`evidence-novelty`](../evidence-novelty/README.md): Use evidence-novelty to compare a passage with the evidence already collected.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `firstPassage`  | Yes      | string                       |
| `secondPassage` | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict       | Meaning                                                                   |
| ------------- | ------------------------------------------------------------------------- |
| `duplicate`   | Both passages convey substantially the same material information.         |
| `overlapping` | They share material information but at least one adds meaningful details. |
| `distinct`    | They convey materially different information.                             |
| `unclear`     | The meaning cannot be compared reliably.                                  |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Compares a supplied pair. It does not search a corpus, cluster documents, or remove content.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo passage-duplicate` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe passage-duplicate` shows the input and result schemas.
