# Identify a stated preference

<!-- BEGIN GENERATED: usage -->

Does statement express an ongoing preference, a factual assertion, or a temporary request?

Use when: You need to distinguish an ongoing preference from a fact or temporary request.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { preferenceKind } from 'jev-recipes/preference-kind';

const result = await preferenceKind({
  statement: 'For this reply, please use bullet points.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo preference-kind`.

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
  "verdict": "temporary_request",
  "confidence": 0.96,
  "probabilities": {
    "preference": 0,
    "fact": 0,
    "temporary_request": 1,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`motivation-source`](../motivation-source/README.md): Use motivation-source to classify a stated reason for an activity rather than the kind of statement.
- [`memory-scope`](../memory-scope/README.md): Use memory-scope to identify the supported scope of that preference.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `statement`     | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict             | Meaning                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| `preference`        | The statement expresses an ongoing choice or preferred way of working.                               |
| `fact`              | The statement asserts information without expressing a preference or requesting an action.           |
| `temporary_request` | The statement asks for something in the current situation without establishing a lasting preference. |
| `unclear`           | The intended kind cannot be established.                                                             |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Classifies a statement. It does not infer unexpressed preferences or grant permission to store personal information.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo preference-kind` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe preference-kind` shows the input and result schemas.
