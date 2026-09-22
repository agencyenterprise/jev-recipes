# Assess a candidate memory

How useful is fact for future work under purpose? Distinguish lasting relevance from a current-task detail. Use the supplied purpose rather than assuming every personal fact is worth retaining.

```ts
import { memoryValue } from 'jev-recipes/memory-value';

const result = await memoryValue({
  fact: 'The user prefers short, direct support replies.',
  purpose: 'Help the user draft customer support replies across sessions.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `fact`          | Non-empty text                               |
| `purpose`       | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict         | Meaning                                                                       |
| --------------- | ----------------------------------------------------------------------------- |
| `ongoing_value` | The fact has a clear recurring use for the supplied purpose beyond this task. |
| `task_only`     | The fact helps the current task but has no established recurring use.         |
| `incidental`    | The fact has no clear use for the supplied purpose.                           |
| `unclear`       | Its future usefulness cannot be established.                                  |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses usefulness only. Storage consent, sensitive-data policy, retention, and deletion must be enforced separately.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo memory-value` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe memory-value` shows the input and result schemas.
