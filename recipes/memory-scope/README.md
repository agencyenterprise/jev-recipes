# Identify memory scope

What is the narrowest explicitly supported scope of fact in context? Do not generalize a one-off instruction into a lasting user preference.

```ts
import { memoryScope } from 'jev-recipes/memory-scope';

const result = await memoryScope({
  fact: 'Use two-space indentation in this repository.',
  context: 'The user is describing the conventions for the billing service repository.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `fact`          | Non-empty text                               |
| `context`       | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

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
