# Check answerability

<!-- BEGIN GENERATED: usage -->

Decide whether supplied evidence can answer an entire question.

Use when: You need to know if you have enough evidence and can answer a question.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { answerability } from 'jev-recipes/answerability';

const result = await answerability({
  question: 'How do I reset my password, and when does the link expire?',
  evidence: [
    {
      id: 'reset',
      text: 'Select Forgot password on the sign-in page. Reset links expire after 30 minutes.',
    },
  ],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo answerability`.

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
  "verdict": "sufficient",
  "canAnswer": true,
  "confidence": 0.96,
  "probabilities": {
    "sufficient": 0.97,
    "partial": 0.01,
    "insufficient": 0.01,
    "conflicting": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`answer-coverage`](../answer-coverage/README.md): Use answer-coverage after drafting to check whether each question was addressed.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `question`      | Yes      | string                                             |
| `evidence`      | Yes      | { id, text }[]; at least 1 items; at most 50 items |
| `minConfidence` | No       | number; minimum 0; maximum 1                       |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

| Verdict        | Meaning                                                   |
| -------------- | --------------------------------------------------------- |
| `sufficient`   | The evidence answers every material part of the question. |
| `partial`      | Some material parts can be answered, but others cannot.   |
| `insufficient` | No material part can be answered.                         |
| `conflicting`  | Incompatible evidence prevents a consistent answer.       |

`canAnswer` is true only when the verdict is `sufficient` and confidence reaches `minConfidence`. `status` is `ready` at or above that threshold, otherwise `review`. A ready assessment can still describe partial, insufficient, or conflicting evidence. The result includes confidence and all choice probabilities.

The result includes model and token usage. Inspect the outcome as well as its review status.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

Measured on 50 golden cases against `jev-1.13.0`: **96% accurate** overall (contested cases 75%, adversarial cases 100%).

Recorded 2026-10-04 with package 0.9.11, on the **development** split. Recipe fingerprint: `f31c23b38f2f307f91db63617db6b2bb2f6a2119e156cb4abcff329b1ccdfbef`.

Scoring revision: 2.

48/50 cases correct; 44 ready, 6 review, 0 failed. Accuracy among ready cases: 100%.

Latency: p50 100.05 ms, p95 136.29 ms. Usage: 25688 input tokens and 2894 output tokens across 50 logical requests.

Labels: unspecified (50 cases): Not recorded by the dataset author.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 87% to 99%.

| `minConfidence` | Deferred to review | Accuracy of ready results |
| --------------- | ------------------ | ------------------------- |
| 0.5             | 10%                | 100%                      |
| 0.6             | 10%                | 100%                      |
| 0.7             | 10%                | 100%                      |
| 0.8             | 12%                | 100%                      |
| 0.9             | 22%                | 100%                      |
| 0.95            | 28%                | 100%                      |

The lowest threshold reaching 95% accuracy on ready results is 0.5.

Run `npm run eval -- answerability` to save new results and update this guide. The full report, including misses, is in [evals/results/answerability.json](../../evals/results/answerability.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->

## Reuse and calls

Uses the shared choice helper. This folder owns the evidence-sufficiency criteria and the can-answer decision. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Handle empty retrieval in application code before calling. This recipe does not establish source truth, draft an answer, or guarantee a later draft uses the evidence correctly. Use verify on drafted claims and answer-coverage on supplied question parts.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo answerability` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe answerability` to inspect the input and result schemas.
