# Check answer coverage

<!-- BEGIN GENERATED: usage -->

Check whether a draft answers each supplied question.

Use when: You have a draft and need to check whether it answers each supplied question.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { answerCoverage } from 'jev-recipes/answer-coverage';

const result = await answerCoverage({
  draft: 'Select Forgot password on the sign-in page.',
  questions: [
    { id: 'reset', text: 'How do I reset my password?' },
    { id: 'expiry', text: 'When does the link expire?' },
  ],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo answer-coverage`.

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
  "allAnswered": false,
  "checks": [
    {
      "id": "reset",
      "status": "ready",
      "verdict": "answered",
      "confidence": 0.96,
      "probabilities": {
        "answered": 1,
        "partial": 0,
        "missing": 0,
        "unclear": 0
      }
    },
    {
      "id": "expiry",
      "status": "ready",
      "verdict": "missing",
      "confidence": 0.96,
      "probabilities": {
        "answered": 0,
        "partial": 0,
        "missing": 1,
        "unclear": 0
      }
    }
  ]
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`answer-relevance`](../answer-relevance/README.md): Use answer-relevance to assess how directly the draft addresses the overall request.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `draft`         | Yes      | string                                             |
| `questions`     | Yes      | { id, text }[]; at least 1 items; at most 50 items |
| `minConfidence` | No       | number; minimum 0; maximum 1                       |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

`checks` contains the original ID, verdict, status, confidence, and probabilities for each item. `allAnswered` is true only when every check is ready and has verdict `answered`. Any uncertain check makes overall status `review`.

| Verdict    | Meaning                                                  |
| ---------- | -------------------------------------------------------- |
| `answered` | Every material part of this question is answered.        |
| `partial`  | Some material parts are answered but others are missing. |
| `missing`  | No substantive answer to this question appears.          |
| `unclear`  | The wording prevents a reliable coverage decision.       |

`unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared item-check helper. This folder owns its question, verdict criteria, and aggregate decision. A live invocation makes one logical Jev request; SDK retries can add transport attempts. All item questions are sent in that request.

## Limits

Checks supplied question IDs only. It does not extract questions or verify the draft against sources.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo answer-coverage` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe answer-coverage` shows the input and result schemas.
