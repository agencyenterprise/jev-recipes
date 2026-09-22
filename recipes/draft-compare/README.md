# Compare two drafts

Which draft better satisfies request under rubric? Evaluate only the supplied criteria. Treat presentation order as irrelevant and allow a tie or neither.

```ts
import { draftCompare } from 'jev-recipes/draft-compare';

const result = await draftCompare({
  request: 'Explain how to reset a password.',
  firstDraft: 'Select Forgot password on the sign-in page.',
  secondDraft: 'Contact billing to download an invoice.',
  rubric: 'Prefer a direct answer to the requested task.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `request`       | Non-empty text                               |
| `firstDraft`    | Non-empty text                               |
| `secondDraft`   | Non-empty text                               |
| `rubric`        | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict   | Meaning                                                                       |
| --------- | ----------------------------------------------------------------------------- |
| `first`   | Only the first draft is suitable, or it clearly better satisfies the rubric.  |
| `second`  | Only the second draft is suitable, or it clearly better satisfies the rubric. |
| `tie`     | Both drafts are suitable and neither is meaningfully better under the rubric. |
| `neither` | Neither draft satisfies the request and rubric.                               |
| `unclear` | There is insufficient information to make the comparison.                     |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Makes a relative judgment against your rubric. A preferred draft can still contain unsupported facts.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo draft-compare` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe draft-compare` shows the input and result schemas.
