# Check writing criteria

<!-- BEGIN GENERATED: usage -->

Check a draft against each supplied writing criterion.

Use when: You want to check a draft against a supplied set of writing criteria.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { toneCheck } from 'jev-recipes/tone-check';

const result = await toneCheck({
  draft: 'You caused this problem. Read the manual.',
  criteria: [{ id: 'blame', text: 'Avoid blaming the customer.' }],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo tone-check`.

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
  "allPassed": false,
  "checks": [
    {
      "id": "blame",
      "status": "ready",
      "verdict": "fail",
      "confidence": 0.96,
      "probabilities": {
        "pass": 0,
        "fail": 1,
        "unclear": 0
      }
    }
  ]
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`draft-compare`](../draft-compare/README.md): Use draft-compare to choose between two drafts under a rubric.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `draft`         | Yes      | string                                             |
| `criteria`      | Yes      | { id, text }[]; at least 1 items; at most 50 items |
| `minConfidence` | No       | number; minimum 0; maximum 1                       |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

`checks` contains the original ID, verdict, status, confidence, and probabilities for each item. `allPassed` is true only when every check is ready and has verdict `pass`. Any uncertain check makes overall status `review`.

| Verdict   | Meaning                                              |
| --------- | ---------------------------------------------------- |
| `pass`    | The wording satisfies this criterion.                |
| `fail`    | The wording violates this criterion.                 |
| `unclear` | The criterion or wording is too ambiguous to assess. |

`unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared item-check helper. This folder owns its question, verdict criteria, and aggregate decision. A live invocation makes one logical Jev request; SDK retries can add transport attempts. All item questions are sent in that request.

## Limits

Checks supplied writing criteria. It does not rewrite text, determine factual accuracy, or check exact character counts.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo tone-check` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe tone-check` shows the input and result schemas.
