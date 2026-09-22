# Compare a new fact with memory

How does newFact relate to existingMemory? Choose updates only when a change or replacement is explicitly established, not merely because newFact was supplied later.

```ts
import { memoryRelation } from 'jev-recipes/memory-relation';

const result = await memoryRelation({
  existingMemory: 'The project uses npm.',
  newFact: 'We have switched this project from npm to pnpm.',
});

console.log(result.status, result.verdict);
```

## Input

| Field            | Accepts                                      |
| ---------------- | -------------------------------------------- |
| `existingMemory` | Non-empty text                               |
| `newFact`        | Non-empty text                               |
| `context`        | Optional non-empty text                      |
| `minConfidence`  | Optional number from 0 to 1; defaults to 0.8 |

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
