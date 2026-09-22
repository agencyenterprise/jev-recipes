# Check a cached answer

<!-- BEGIN GENERATED: usage -->

Does cachedAnswer address question with the same relevant meaning and conditions as originalQuestion?

Use when: You want to know whether a saved answer applies to a new question.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { cacheMatch } from 'jev-recipes/cache-match';

const result = await cacheMatch({
  question: 'Where can I get my invoices?',
  originalQuestion: 'How do I download invoices?',
  cachedAnswer: 'Open Billing and select Download invoice.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo cache-match`.

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
  "verdict": "reusable",
  "confidence": 0.96,
  "probabilities": {
    "reusable": 1,
    "unsuitable": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`query-equivalence`](../query-equivalence/README.md): Use query-equivalence to compare questions without assessing a saved answer.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field              | Required | Shape                        |
| ------------------ | -------- | ---------------------------- |
| `question`         | Yes      | string                       |
| `originalQuestion` | Yes      | string                       |
| `cachedAnswer`     | Yes      | string                       |
| `context`          | No       | string                       |
| `minConfidence`    | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict      | Meaning                                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| `reusable`   | The cached answer addresses the new question without a material mismatch in meaning or stated conditions. |
| `unsuitable` | The cached answer leaves a material part unanswered or applies to a different stated condition.           |
| `unclear`    | Missing or ambiguous conditions prevent establishing a match.                                             |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Enforce tenant, permissions, version, and freshness checks in code before calling. A semantic match does not verify the cached answer.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo cache-match` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe cache-match` shows the input and result schemas.
