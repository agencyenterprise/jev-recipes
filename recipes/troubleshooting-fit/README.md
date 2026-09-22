# Check troubleshooting applicability

<!-- BEGIN GENERATED: usage -->

Does procedure address symptoms under the described circumstances?

Use when: You need to choose whether a procedure fits the reported symptoms and circumstances.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { troubleshootingFit } from 'jev-recipes/troubleshooting-fit';

const result = await troubleshootingFit({
  symptoms: 'The customer forgot their password and cannot sign in.',
  procedure: 'For forgotten passwords, use Forgot password on the sign-in page.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo troubleshooting-fit`.

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
  "verdict": "applicable",
  "confidence": 0.96,
  "probabilities": {
    "applicable": 1,
    "unsuitable": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`attempted-step`](../attempted-step/README.md): Use attempted-step to check whether that procedure has already been tried.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `symptoms`      | Yes      | string                       |
| `procedure`     | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict      | Meaning                                                                           |
| ------------ | --------------------------------------------------------------------------------- |
| `applicable` | The procedure covers the described symptoms and its stated prerequisites are met. |
| `unsuitable` | The procedure concerns different symptoms or incompatible prerequisites.          |
| `unclear`    | The symptoms or prerequisites are insufficiently specified.                       |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses a supplied procedure; it does not diagnose a root cause, generate steps, or execute them.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo troubleshooting-fit` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe troubleshooting-fit` shows the input and result schemas.
