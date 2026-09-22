# Compare evidence for conflicts

<!-- BEGIN GENERATED: usage -->

Do firstPassage and secondPassage give incompatible evidence relevant to question under the same conditions?

Use when: You have two passages and need to check for conflicting evidence about a question.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { evidenceConflict } from 'jev-recipes/evidence-conflict';

const result = await evidenceConflict({
  question: 'Can guests export reports?',
  firstPassage: 'Guests can export reports.',
  secondPassage: 'Guests cannot export reports.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo evidence-conflict`.

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
    "compatible": 0,
    "conflicting": 1,
    "different_scope": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`answer-consistency`](../answer-consistency/README.md): Use answer-consistency to compare two statements directly.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `firstPassage`  | Yes      | string                       |
| `secondPassage` | Yes      | string                       |
| `question`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                            |
| ----------------- | ---------------------------------------------------------------------------------- |
| `compatible`      | The passages address the same scope and can both be true.                          |
| `conflicting`     | The passages address the same scope and make incompatible claims.                  |
| `different_scope` | The apparent comparison concerns different subjects, circumstances, or conditions. |
| `unclear`         | The scope or meaning cannot be resolved from the supplied evidence.                |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Does not decide which source is authoritative. Exact numbers, timestamps, and version ordering should be compared in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo evidence-conflict` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe evidence-conflict` shows the input and result schemas.
