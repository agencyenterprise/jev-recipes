# Assess a text revision

Does the revision from before to after change material meaning, conditions, or obligations? Rephrasing that preserves the same meaning is editorial only.

```ts
import { changeMeaning } from 'jev-recipes/change-meaning';

const result = await changeMeaning({
  before: 'Guests may export reports.',
  after: 'Only workspace owners may export reports.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `before`        | Non-empty text                               |
| `after`         | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                                               |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| `meaning_changed` | The revision changes a material fact, condition, instruction, or implication.                         |
| `editorial_only`  | The revision preserves material meaning and changes only wording or presentation, or makes no change. |
| `unclear`         | The material effect cannot be determined from the supplied text.                                      |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Compares supplied passages. It does not parse a repository diff or perform exact numeric and date comparisons.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo change-meaning` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe change-meaning` shows the input and result schemas.
