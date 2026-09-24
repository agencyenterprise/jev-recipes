# Compare two passages for a question

<!-- BEGIN GENERATED: usage -->

Which of firstPassage and secondPassage better helps answer question?

Use when: You need a head-to-head preference between two retrieved passages, for tie-breaking, evaluation data, or reranker calibration.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { passageCompare } from 'jev-recipes/passage-compare';

const result = await passageCompare({
  question: 'How long do refunds take to appear on a card?',
  firstPassage:
    'Refunds are issued to the original payment method and typically appear within 5 to 10 business days, depending on the card issuer.',
  secondPassage:
    'You can request a refund from the Orders page by selecting the item and choosing Return.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo passage-compare`.

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
  "confidence": 0.9,
  "probabilities": {
    "first": 0.9,
    "second": 0.03,
    "tie": 0.03,
    "neither": 0.02,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`rerank`](../rerank/README.md): Use rerank to score many passages independently against one query.
- [`context-role`](../context-role/README.md): Use context-role to label what one passage contributes to a question.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `question`      | Yes      | string                       |
| `firstPassage`  | Yes      | string                       |
| `secondPassage` | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `first`, `second`, `tie`, `neither`, or `unclear`. `first` and `second` name the passage that helps more. `tie` means both help about equally. `neither` means no passage contains useful information, which is a confident answer rather than a failure.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. `probabilities` covers all five outcomes.

## Reuse and calls

Uses the shared comparison helper, which fixes the five outcomes and tells Jev that presentation order is irrelevant. This folder owns the question wording and the four outcome descriptions. A live invocation makes one logical Jev request.

## Limits

The recipe compares exactly two passages. For many candidates, use [`rerank`](../rerank/README.md) or run pairwise comparisons in application code. It judges how much each passage helps with the question, not whether the passage is true. When building evaluation data, run each pair in both orders and keep only agreeing results.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo passage-compare` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe passage-compare` to inspect the input and result schemas.
