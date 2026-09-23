# Identify memory scope

<!-- BEGIN GENERATED: usage -->

What is the narrowest explicitly supported scope of fact in context?

Use when: You need to identify the narrowest supported scope of a fact or preference.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { memoryScope } from 'jev-recipes/memory-scope';

const result = await memoryScope({
  fact: 'Use two-space indentation in this repository.',
  context: 'The user is describing the conventions for the billing service repository.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo memory-scope`.

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
  "verdict": "project",
  "confidence": 0.96,
  "probabilities": {
    "user": 0,
    "project": 1,
    "task": 0,
    "session": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`memory-subject`](../memory-subject/README.md): Use memory-subject to identify whom a candidate memory describes before assessing its scope.
- [`preference-kind`](../preference-kind/README.md): Use preference-kind to distinguish ongoing preferences from temporary instructions.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `fact`          | Yes      | string                       |
| `context`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict   | Meaning                                                                   |
| --------- | ------------------------------------------------------------------------- |
| `user`    | The fact explicitly applies to the user across projects or tasks.         |
| `project` | The fact applies to the identified project across its tasks.              |
| `task`    | The fact applies to the current task only.                                |
| `session` | The fact applies to this conversation session across its immediate tasks. |
| `unclear` | The intended scope is not established.                                    |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Identifies semantic scope. It does not identify a storage tenant, establish consent, or persist a memory.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo memory-scope` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe memory-scope` shows the input and result schemas.
