# Compare a new fact with memory

<!-- BEGIN GENERATED: usage -->

How does newFact relate to existingMemory?

Use when: You need to compare a new fact with an existing memory for agreement or change.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { memoryRelation } from 'jev-recipes/memory-relation';

const result = await memoryRelation({
  existingMemory: 'The project uses npm.',
  newFact: 'We have switched this project from npm to pnpm.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo memory-relation`.

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
  "verdict": "updates",
  "confidence": 0.96,
  "probabilities": {
    "repeats": 0,
    "supplements": 0,
    "updates": 1,
    "conflicts": 0,
    "unrelated": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`memory-value`](../memory-value/README.md): Use memory-value to assess usefulness before deciding how to store a fact.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field            | Required | Shape                        |
| ---------------- | -------- | ---------------------------- |
| `existingMemory` | Yes      | string                       |
| `newFact`        | Yes      | string                       |
| `context`        | No       | string                       |
| `minConfidence`  | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict       | Meaning                                                                              |
| ------------- | ------------------------------------------------------------------------------------ |
| `repeats`     | The new fact restates the existing meaning without a material addition.              |
| `supplements` | The new fact adds compatible information while the existing memory still applies.    |
| `updates`     | The new fact explicitly changes or replaces the existing fact within the same scope. |
| `conflicts`   | The facts are incompatible within the same scope without an established replacement. |
| `unrelated`   | The facts concern unrelated subjects or scopes.                                      |
| `unclear`     | Their relationship cannot be resolved.                                               |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Compares two supplied facts. It does not select a memory to overwrite or resolve conflicts by timestamp alone.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo memory-relation` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe memory-relation` shows the input and result schemas.
