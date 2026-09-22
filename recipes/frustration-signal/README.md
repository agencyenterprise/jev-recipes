# Detect expressed frustration

<!-- BEGIN GENERATED: usage -->

Does message express frustration or dissatisfaction in its wording?

Use when: You need to detect frustration or dissatisfaction expressed in a message.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { frustrationSignal } from 'jev-recipes/frustration-signal';

const result = await frustrationSignal({
  message: 'This is the third time I have asked. It is frustrating to keep repeating myself.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo frustration-signal`.

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

- [`urgency-signal`](../urgency-signal/README.md): Use urgency-signal to detect an explicit request for urgent attention.

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

| Verdict         | Meaning                                                                 |
| --------------- | ----------------------------------------------------------------------- |
| `expressed`     | The wording clearly expresses frustration or dissatisfaction.           |
| `not_expressed` | The wording does not express frustration or dissatisfaction.            |
| `unclear`       | Ambiguous or context-dependent wording prevents a clear interpretation. |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Classifies expressed language only. It does not diagnose emotions or determine customer importance or entitlement.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo frustration-signal` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe frustration-signal` shows the input and result schemas.
