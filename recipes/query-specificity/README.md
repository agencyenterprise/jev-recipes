# Check question specificity

<!-- BEGIN GENERATED: usage -->

Does question, interpreted with context, identify a focused information need?

Use when: You need to know whether a question identifies a focused information need.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { querySpecificity } from 'jev-recipes/query-specificity';

const result = await querySpecificity({ question: 'Tell me everything about software.' });
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo query-specificity`.

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
  "verdict": "too_broad",
  "confidence": 0.96,
  "probabilities": {
    "specific": 0,
    "too_broad": 1,
    "ambiguous": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`clarify`](../clarify/README.md): Use clarify to check named requirements for missing or ambiguous information.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `question`      | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict     | Meaning                                                                                 |
| ----------- | --------------------------------------------------------------------------------------- |
| `specific`  | The subject and requested information are sufficiently clear and focused.               |
| `too_broad` | The intended subject is clear but the request spans an open-ended range of information. |
| `ambiguous` | The subject, reference, or intended information has multiple unresolved meanings.       |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `ambiguous` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses focus only. Use clarify when the application has explicit required fields to check.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo query-specificity` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe query-specificity` shows the input and result schemas.
