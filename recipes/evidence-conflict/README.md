# Compare evidence for conflicts

Do firstPassage and secondPassage give incompatible evidence relevant to question under the same conditions? Different scopes are not automatically contradictions.

```ts
import { evidenceConflict } from 'jev-recipes/evidence-conflict';

const result = await evidenceConflict({
  question: 'Can guests export reports?',
  firstPassage: 'Guests can export reports.',
  secondPassage: 'Guests cannot export reports.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `firstPassage`  | Non-empty text                               |
| `secondPassage` | Non-empty text                               |
| `question`      | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                            |
| ----------------- | ---------------------------------------------------------------------------------- |
| `compatible`      | The passages address the same scope and can both be true.                          |
| `conflicting`     | The passages address the same scope and make incompatible claims.                  |
| `different_scope` | The apparent comparison concerns different subjects, circumstances, or conditions. |
| `unclear`         | The scope or meaning cannot be resolved from the supplied evidence.                |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Does not decide which source is authoritative. Exact numbers, timestamps, and version ordering should be compared in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo evidence-conflict` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe evidence-conflict` shows the input and result schemas.
