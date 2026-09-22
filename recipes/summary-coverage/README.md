# Check summary coverage

<!-- BEGIN GENERATED: usage -->

Check whether a summary preserves each supplied point.

Use when: You need to check whether a summary preserves each important source point.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { summaryCoverage } from 'jev-recipes/summary-coverage';

const result = await summaryCoverage({
  summary: 'We agreed to keep the API unchanged.',
  points: [
    { id: 'api', text: 'Keep the public API unchanged.' },
    { id: 'docs', text: 'Update the installation instructions.' },
  ],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo summary-coverage`.

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
  "allPreserved": false,
  "checks": [
    {
      "id": "api",
      "status": "ready",
      "verdict": "preserved",
      "confidence": 0.96,
      "probabilities": {
        "preserved": 1,
        "partial": 0,
        "missing": 0,
        "unclear": 0
      }
    },
    {
      "id": "docs",
      "status": "ready",
      "verdict": "missing",
      "confidence": 0.96,
      "probabilities": {
        "preserved": 0,
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

- [`answer-coverage`](../answer-coverage/README.md): Use answer-coverage when the checklist contains questions to answer.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `summary`       | Yes      | string                                             |
| `points`        | Yes      | { id, text }[]; at least 1 items; at most 50 items |
| `minConfidence` | No       | number; minimum 0; maximum 1                       |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

`checks` contains the original ID, verdict, status, confidence, and probabilities for each item. `allPreserved` is true only when every check is ready and has verdict `preserved`. Any uncertain check makes overall status `review`.

| Verdict     | Meaning                                                                  |
| ----------- | ------------------------------------------------------------------------ |
| `preserved` | The full material meaning of this point is retained.                     |
| `partial`   | Some meaning is retained but a material detail or constraint is missing. |
| `missing`   | This point is absent or its meaning is reversed.                         |
| `unclear`   | The summary is too ambiguous to establish coverage.                      |

`unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared item-check helper. This folder owns its question, verdict criteria, and aggregate decision. A live invocation makes one logical Jev request; SDK retries can add transport attempts. All item questions are sent in that request.

## Limits

Checks the points you supply. It does not select important points from a transcript or detect unrelated invented statements.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo summary-coverage` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe summary-coverage` shows the input and result schemas.
