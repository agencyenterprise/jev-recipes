# Assess a candidate memory

<!-- BEGIN GENERATED: usage -->

How useful is fact for future work under purpose?

Use when: You need to assess whether a candidate fact is useful to remember for a stated purpose.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { memoryValue } from 'jev-recipes/memory-value';

const result = await memoryValue({
  fact: 'The user prefers short, direct support replies.',
  purpose: 'Help the user draft customer support replies across sessions.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo memory-value`.

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
  "verdict": "ongoing_value",
  "confidence": 0.96,
  "probabilities": {
    "ongoing_value": 1,
    "task_only": 0,
    "incidental": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`memory-scope`](../memory-scope/README.md): Use memory-scope to determine where a fact applies.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `fact`          | Yes      | string                       |
| `purpose`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict         | Meaning                                                                       |
| --------------- | ----------------------------------------------------------------------------- |
| `ongoing_value` | The fact has a clear recurring use for the supplied purpose beyond this task. |
| `task_only`     | The fact helps the current task but has no established recurring use.         |
| `incidental`    | The fact has no clear use for the supplied purpose.                           |
| `unclear`       | Its future usefulness cannot be established.                                  |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses usefulness only. Storage consent, sensitive-data policy, retention, and deletion must be enforced separately.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo memory-value` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe memory-value` shows the input and result schemas.
