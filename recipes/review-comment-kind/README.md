# Classify review comment kind

<!-- BEGIN GENERATED: usage -->

What is the primary kind of comment?

Use when: You need to sort code review comments so blocking defects surface first and optional polish can be batched or deferred.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { reviewCommentKind } from 'jev-recipes/review-comment-kind';

const result = await reviewCommentKind({
  comment:
    'This returns undefined when the list is empty because items[0] is read before the length check. Guard on items.length first.',
  context: 'Comment left on a helper function in a pull request that adds a formatting utility.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo review-comment-kind`.

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
  "verdict": "bug",
  "confidence": 0.91,
  "probabilities": {
    "bug": 0.91,
    "design": 0.04,
    "style": 0.01,
    "question": 0.01,
    "nit": 0.02,
    "praise": 0,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`feedback-kind`](../feedback-kind/README.md): Use feedback-kind to classify general product or service feedback outside code review.
- [`turn-intent`](../turn-intent/README.md): Use turn-intent to classify the communicative purpose of a conversational message.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `comment`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. `context` is optional and is omitted from the request when absent.

## Result

| Verdict    | Meaning                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| `bug`      | The comment points at incorrect behavior, a defect, or a case the code handles wrongly.              |
| `design`   | The comment concerns structure, architecture, or the overall approach rather than a specific defect. |
| `style`    | The comment concerns naming, formatting, or idiom without changing behavior.                         |
| `question` | The comment asks for clarification or explanation without asserting a problem.                       |
| `nit`      | The comment suggests trivial optional polish that the author may ignore.                             |
| `praise`   | The comment expresses approval or appreciation without requesting a change.                          |
| `unclear`  | The primary kind of the comment is not established by the supplied text.                             |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Classifies what the comment says, not whether it is correct or whether the author must act on it. A comment that mixes kinds, such as a bug report with a naming aside, is graded by its primary purpose. Blocking, merge, and notification rules belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo review-comment-kind` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe review-comment-kind` shows the input and result schemas.
