# Check source applicability

<!-- BEGIN GENERATED: usage -->

Does the scope described in passage apply to scenario?

Use when: You need to check whether the conditions and scope of a source fit a scenario.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { sourceApplicability } from 'jev-recipes/source-applicability';

const result = await sourceApplicability({
  passage: 'Workspace owners can delete the workspace. These instructions are for owners only.',
  scenario: 'A workspace guest wants to delete the workspace.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo source-applicability`.

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
  "verdict": "does_not_apply",
  "confidence": 0.96,
  "probabilities": {
    "applies": 0,
    "does_not_apply": 1,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`evidence-conflict`](../evidence-conflict/README.md): Use evidence-conflict to compare two applicable sources for disagreement.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `passage`       | Yes      | string                       |
| `scenario`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict          | Meaning                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| `applies`        | The passage explicitly covers or unambiguously applies to the scenario. |
| `does_not_apply` | The passage is scoped to incompatible circumstances.                    |
| `unclear`        | Required scope information is missing or ambiguous.                     |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses semantic scope. Enforce tenant, access, exact version, and region constraints in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo source-applicability` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe source-applicability` shows the input and result schemas.
