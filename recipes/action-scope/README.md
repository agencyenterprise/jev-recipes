# Check proposed action scope

<!-- BEGIN GENERATED: usage -->

Is proposedAction within the work requested in request and constraints?

Use when: You need to check whether a proposed action stays within the requested work and constraints.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { actionScope } from 'jev-recipes/action-scope';

const result = await actionScope({
  request: 'Explain why this deployment failed.',
  proposedAction: 'Deploy a replacement release to production.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo action-scope`.

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
  "verdict": "additional_work",
  "confidence": 0.96,
  "probabilities": {
    "within_scope": 0,
    "additional_work": 1,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`instruction-fit`](../instruction-fit/README.md): Use instruction-fit to decide whether a particular instruction applies.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field            | Required | Shape                        |
| ---------------- | -------- | ---------------------------- |
| `request`        | Yes      | string                       |
| `proposedAction` | Yes      | string                       |
| `constraints`    | No       | string                       |
| `minConfidence`  | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| `within_scope`    | The action is explicitly requested or directly necessary under the stated constraints.                        |
| `additional_work` | The action introduces unrequested work, changes the requested outcome, or violates a stated scope constraint. |
| `unclear`         | The scope relationship cannot be established from the request.                                                |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses semantic scope only. User authorization and access controls must be enforced by the application.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo action-scope` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe action-scope` shows the input and result schemas.
