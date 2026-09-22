# Check question specificity

Does question, interpreted with context, identify a focused information need? A broad but clear request differs from an ambiguous reference or missing subject.

```ts
import { querySpecificity } from 'jev-recipes/query-specificity';

const result = await querySpecificity({
  question: 'Tell me everything about software.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `question`      | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict     | Meaning                                                                                 |
| ----------- | --------------------------------------------------------------------------------------- |
| `specific`  | The subject and requested information are sufficiently clear and focused.               |
| `too_broad` | The intended subject is clear but the request spans an open-ended range of information. |
| `ambiguous` | The subject, reference, or intended information has multiple unresolved meanings.       |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `ambiguous` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses focus only. Use clarify when the application has explicit required fields to check.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo query-specificity` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe query-specificity` shows the input and result schemas.
