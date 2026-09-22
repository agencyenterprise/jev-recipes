# Check answer consistency

<!-- BEGIN GENERATED: usage -->

Do firstStatement and secondStatement make compatible claims about the same subject and circumstances?

Use when: You need to check whether two statements agree under the same conditions.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { answerConsistency } from 'jev-recipes/answer-consistency';

const result = await answerConsistency({
  firstStatement: 'Guests can export reports.',
  secondStatement: 'Guests cannot export reports.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo answer-consistency`.

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
  "verdict": "conflicting",
  "confidence": 0.96,
  "probabilities": {
    "consistent": 0,
    "conflicting": 1,
    "unrelated": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`verify`](../verify/README.md): Use verify to assess a claim against evidence rather than another statement.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field             | Required | Shape                        |
| ----------------- | -------- | ---------------------------- |
| `firstStatement`  | Yes      | string                       |
| `secondStatement` | Yes      | string                       |
| `context`         | No       | string                       |
| `minConfidence`   | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict       | Meaning                                                                                 |
| ------------- | --------------------------------------------------------------------------------------- |
| `consistent`  | Both statements concern the same subject and can hold under the supplied circumstances. |
| `conflicting` | The statements concern the same circumstances and make mutually incompatible claims.    |
| `unrelated`   | The statements concern different subjects or scopes that should not be compared.        |
| `unclear`     | The supplied circumstances do not resolve whether the statements conflict.              |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Checks semantic consistency between two statements. Exact numeric and date comparisons belong in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo answer-consistency` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe answer-consistency` shows the input and result schemas.
