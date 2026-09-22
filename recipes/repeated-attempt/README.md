# Compare attempted approaches

Does proposedAttempt use essentially the same approach as previousAttempt for objective? Rewording the same query without a material strategy change counts as the same approach.

```ts
import { repeatedAttempt } from 'jev-recipes/repeated-attempt';

const result = await repeatedAttempt({
  objective: 'Find reset documentation.',
  previousAttempt: 'Search the help center for password reset.',
  proposedAttempt: 'Search the same help center for reset password.',
});

console.log(result.status, result.verdict);
```

## Input

| Field             | Accepts                                      |
| ----------------- | -------------------------------------------- |
| `objective`       | Non-empty text                               |
| `previousAttempt` | Non-empty text                               |
| `proposedAttempt` | Non-empty text                               |
| `minConfidence`   | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict              | Meaning                                                                    |
| -------------------- | -------------------------------------------------------------------------- |
| `same_approach`      | The proposed attempt repeats the material method and relevant assumptions. |
| `different_approach` | The proposed attempt changes a material method, source, or assumption.     |
| `unclear`            | The attempts are not described precisely enough to compare.                |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Compares two attempts only. Counting repeats, deciding whether a retry is justified, and stopping loops belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo repeated-attempt` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe repeated-attempt` shows the input and result schemas.
