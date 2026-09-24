# Grade feedback actionability

<!-- BEGIN GENERATED: usage -->

How actionable is feedback for its recipient, on a five-level rubric from no direction to a specific change with reason and example?

Use when: You review teacher comments, code review notes, or peer feedback before delivery and want to flag items the recipient could not act on.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { feedbackActionability } from 'jev-recipes/feedback-actionability';

const result = await feedbackActionability({
  feedback:
    "Your introduction buries the thesis in the fourth sentence, so a reader does not know what you are arguing until the paragraph is almost over. Move the thesis to the first or second sentence. For example, open with 'Remote work raised productivity for knowledge workers but widened the gap for new hires,' then use the rest of the paragraph to preview your three sections.",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo feedback-actionability`.

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
  "score": 3.84,
  "level": 4,
  "confidence": 0.88,
  "probabilities": {
    "0": 0,
    "1": 0.01,
    "2": 0.02,
    "3": 0.09,
    "4": 0.88
  },
  "actionability": "complete"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`requirement-testability`](../requirement-testability/README.md): Use requirement-testability to check whether a stated requirement can be verified.
- [`tone-check`](../tone-check/README.md): Use tone-check to judge the wording of the same feedback against writing criteria.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `feedback`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`actionability` is one of `none`, `vague`, `directional`, `specific`, or `complete`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the levels and can fall between them; use it for ranking a batch of comments or setting a delivery threshold.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the actionability question, the five-level wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The rubric measures how much direction the feedback gives, not whether that direction is right. Confident, specific, wrong advice grades `complete`. The recipe sees only the feedback text, not the work it comments on, so it cannot tell whether the suggested change is needed. Tone and politeness are ignored; use [`tone-check`](../tone-check/README.md) for those. Pure praise grades `none` because it gives the recipient nothing to do, even though praise can be valuable for other reasons.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo feedback-actionability` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe feedback-actionability` to inspect the input and result schemas.
