# Compare two drafts

<!-- BEGIN GENERATED: usage -->

Which draft better satisfies request under rubric?

Use when: You have two drafts and want to choose the better fit for a request and rubric.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { draftCompare } from 'jev-recipes/draft-compare';

const result = await draftCompare({
  request: 'Explain how to reset a password.',
  firstDraft: 'Select Forgot password on the sign-in page.',
  secondDraft: 'Contact billing to download an invoice.',
  rubric: 'Prefer a direct answer to the requested task.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo draft-compare`.

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
  "confidence": 0.96,
  "probabilities": {
    "first": 1,
    "second": 0,
    "tie": 0,
    "neither": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`tone-check`](../tone-check/README.md): Use tone-check to evaluate each writing criterion for one draft.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `request`       | Yes      | string                       |
| `firstDraft`    | Yes      | string                       |
| `secondDraft`   | Yes      | string                       |
| `rubric`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict   | Meaning                                                                       |
| --------- | ----------------------------------------------------------------------------- |
| `first`   | Only the first draft is suitable, or it clearly better satisfies the rubric.  |
| `second`  | Only the second draft is suitable, or it clearly better satisfies the rubric. |
| `tie`     | Both drafts are suitable and neither is meaningfully better under the rubric. |
| `neither` | Neither draft satisfies the request and rubric.                               |
| `unclear` | There is insufficient information to make the comparison.                     |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared comparison helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Makes a relative judgment against your rubric. A preferred draft can still contain unsupported facts.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo draft-compare` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe draft-compare` shows the input and result schemas.
