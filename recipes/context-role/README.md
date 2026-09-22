# Identify a passage role

<!-- BEGIN GENERATED: usage -->

What role does passage play in answering question?

Use when: You want to identify the role a passage plays in answering a question.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { contextRole } from 'jev-recipes/context-role';

const result = await contextRole({
  question: 'How do I reset my password?',
  passage: 'Passwords help protect access to accounts.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo context-role`.

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
  "verdict": "background",
  "confidence": 0.96,
  "probabilities": {
    "direct_evidence": 0,
    "background": 1,
    "unrelated": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`rerank`](../rerank/README.md): Use rerank to select and order passages by relevance.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `question`      | Yes      | string                       |
| `passage`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                          |
| ----------------- | -------------------------------------------------------------------------------- |
| `direct_evidence` | The passage directly supplies information needed to answer the question.         |
| `background`      | The passage helps interpret the topic but does not directly answer the question. |
| `unrelated`       | The passage contributes neither an answer nor useful background.                 |
| `unclear`         | Its relationship to the question cannot be established.                          |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Classifies a passage contribution. It does not rank sources or prove the answer is supported.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo context-role` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe context-role` shows the input and result schemas.
