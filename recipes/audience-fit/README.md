# Check audience fit

<!-- BEGIN GENERATED: usage -->

Does the level of explanation in document fit the knowledge and needs explicitly described in audience?

Use when: You need to check whether a document suits the stated audience knowledge and needs.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { audienceFit } from 'jev-recipes/audience-fit';

const result = await audienceFit({
  document: 'Rotate the OAuth refresh token and invalidate the active session grant.',
  audience:
    'A customer unfamiliar with authentication terminology who wants to sign out of all devices.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo audience-fit`.

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
  "verdict": "too_technical",
  "confidence": 0.96,
  "probabilities": {
    "appropriate": 0,
    "too_technical": 1,
    "too_basic": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`tone-check`](../tone-check/README.md): Use tone-check to evaluate specific writing criteria.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `document`      | Yes      | string                       |
| `audience`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict         | Meaning                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------ |
| `appropriate`   | The terminology and explanation suit the described knowledge and needs.                          |
| `too_technical` | The document assumes knowledge the supplied audience description says is absent.                 |
| `too_basic`     | The document spends its explanation below the stated needs without supplying the required depth. |
| `unclear`       | The audience or explanation is not specified enough to judge.                                    |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Uses only the supplied audience description. It does not infer ability from identity or rewrite the document.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo audience-fit` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe audience-fit` shows the input and result schemas.
