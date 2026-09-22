# Check an answer after a source change

Does updatedEvidence still support the entire claim that was based on previousEvidence? Removing necessary support can invalidate the claim even without an explicit contradiction. Do not assume the claim was supported before.

```ts
import { answerInvalidation } from 'jev-recipes/answer-invalidation';

const result = await answerInvalidation({
  claim: 'Guests can export reports.',
  previousEvidence: 'Guests can export reports.',
  updatedEvidence: 'Exporting reports is restricted to workspace owners. Guests cannot export.',
});

console.log(result.status, result.verdict);
```

## Input

| Field              | Accepts                                      |
| ------------------ | -------------------------------------------- |
| `claim`            | Non-empty text                               |
| `previousEvidence` | Non-empty text                               |
| `updatedEvidence`  | Non-empty text                               |
| `minConfidence`    | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `still_supported` | The updated evidence supports the entire claim.                                                                 |
| `invalidated`     | The previous evidence supported the claim, but the updated evidence contradicts it or removes required support. |
| `unclear`         | Previous support or the effect of the new evidence cannot be established.                                       |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses one supplied claim and source revision. It does not monitor changes, compare release dates, or invalidate a cache automatically.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo answer-invalidation` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe answer-invalidation` shows the input and result schemas.
