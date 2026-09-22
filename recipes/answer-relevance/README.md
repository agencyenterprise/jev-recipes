# Check answer relevance

<!-- BEGIN GENERATED: usage -->

How directly does draft address request?

Use when: You need to check whether a draft stays relevant to the request.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { answerRelevance } from 'jev-recipes/answer-relevance';

const result = await answerRelevance({
  request: 'How do I reset my password?',
  draft: 'You can download invoices from the Billing page.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo answer-relevance`.

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
  "verdict": "off_topic",
  "confidence": 0.96,
  "probabilities": {
    "relevant": 0,
    "partly_relevant": 0,
    "off_topic": 1,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`answer-coverage`](../answer-coverage/README.md): Use answer-coverage to check separate question parts individually.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `request`       | Yes      | string                       |
| `draft`         | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| `relevant`        | The draft directly addresses the requested subject and task.                                           |
| `partly_relevant` | The draft mixes relevant content with a substantial unrelated tangent or addresses a neighboring task. |
| `off_topic`       | The draft does not address the requested subject or task.                                              |
| `unclear`         | The request or draft is too ambiguous to assess alignment.                                             |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Relevance does not establish correctness or complete coverage. Use answer-coverage and verify for those decisions.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo answer-relevance` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe answer-relevance` shows the input and result schemas.
