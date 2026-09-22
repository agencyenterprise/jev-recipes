# Compare passages for duplication

How much material information do firstPassage and secondPassage share? Different wording can express the same information. Shared subject matter alone does not make a duplicate.

```ts
import { passageDuplicate } from 'jev-recipes/passage-duplicate';

const result = await passageDuplicate({
  firstPassage: 'Select Forgot password to receive a reset email.',
  secondPassage: 'Use Forgot password and we will email a reset link.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `firstPassage`  | Non-empty text                               |
| `secondPassage` | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict       | Meaning                                                                   |
| ------------- | ------------------------------------------------------------------------- |
| `duplicate`   | Both passages convey substantially the same material information.         |
| `overlapping` | They share material information but at least one adds meaningful details. |
| `distinct`    | They convey materially different information.                             |
| `unclear`     | The meaning cannot be compared reliably.                                  |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Compares a supplied pair. It does not search a corpus, cluster documents, or remove content.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo passage-duplicate` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe passage-duplicate` shows the input and result schemas.
