# Detect an explicit urgency request

<!-- BEGIN GENERATED: usage -->

Does message explicitly request urgent attention?

Use when: You need to detect whether a message explicitly asks for urgent attention.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { urgencySignal } from 'jev-recipes/urgency-signal';

const result = await urgencySignal({
  message: 'Please treat this as urgent; we need someone to look at it immediately.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo urgency-signal`.

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
  "verdict": "expressed",
  "confidence": 0.96,
  "probabilities": {
    "expressed": 1,
    "not_expressed": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`issue-impact`](../issue-impact/README.md): Use issue-impact to assess the reported practical consequences.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `message`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict         | Meaning                                                                    |
| --------------- | -------------------------------------------------------------------------- |
| `expressed`     | The message explicitly asks for immediate, urgent, or expedited attention. |
| `not_expressed` | The message does not explicitly ask for urgent attention.                  |
| `unclear`       | The urgency language is too ambiguous to interpret.                        |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Detects an expressed urgency request. Compute deadline proximity and apply incident or service priority rules in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo urgency-signal` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe urgency-signal` shows the input and result schemas.
