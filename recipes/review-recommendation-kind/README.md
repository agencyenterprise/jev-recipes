# Classify a peer review's recommendation

<!-- BEGIN GENERATED: usage -->

What recommendation does the wording of review express: accept, minor revision, major revision, or reject?

Use when: An editor or review-management tool needs to read the recommendation implied by a free-text review, for example when the reviewer skipped the form field or when the text and the ticked box disagree.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { reviewRecommendationKind } from 'jev-recipes/review-recommendation-kind';

const result = await reviewRecommendationKind({
  review:
    'The paper addresses an important question and the experimental setup is generally careful. However, the central claim in Section 5 rests on the independence assumption introduced in Section 3, which the authors never test, and the baseline comparison omits the two strongest recent methods. I would need to see the assumption validated and the comparison extended before I could support publication. The writing issues I noted in the margins are secondary and easy to fix.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo review-recommendation-kind`.

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
  "verdict": "major_revision",
  "confidence": 0.86,
  "probabilities": {
    "accept": 0.01,
    "minor_revision": 0.04,
    "major_revision": 0.86,
    "reject": 0.07,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`draft-compare`](../draft-compare/README.md): Use draft-compare to judge which of two revisions is better, rather than what a reviewer recommended.
- [`feedback-kind`](../feedback-kind/README.md): Use feedback-kind to classify general user feedback, rather than the recommendation in a formal peer review.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `review`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is one of `accept`, `minor_revision`, `major_revision`, `reject`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The label reflects the disposition the reviewer's wording commits to, not whether the reviewer is right or the paper deserves that outcome. Reviews that mix strong praise with serious objections are classified by the stated conditions for publication, and a review that never commits to a disposition lands on `unclear` for an editor to read. Journals with other decision categories, such as reject and resubmit or accept with mandatory changes, need a mapping from these four in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo review-recommendation-kind` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe review-recommendation-kind` to inspect the input and result schemas.
