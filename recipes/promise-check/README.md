# Check reply commitments

Does reply promise actions or outcomes beyond allowedCommitments? A conditional possibility is not a guarantee. Judge the whole reply; one unsupported promise is enough.

```ts
import { promiseCheck } from 'jev-recipes/promise-check';

const result = await promiseCheck({
  reply: 'Your refund is guaranteed.',
  allowedCommitments: 'We may promise to review a refund request. We cannot promise approval.',
});

console.log(result.status, result.verdict);
```

## Input

| Field                | Accepts                                      |
| -------------------- | -------------------------------------------- |
| `reply`              | Non-empty text                               |
| `allowedCommitments` | Non-empty text                               |
| `minConfidence`      | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict              | Meaning                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `within_commitments` | Every promise is permitted by the supplied commitments, or the reply contains no promise. |
| `unsupported`        | At least one promise exceeds or contradicts the supplied commitments.                     |
| `unclear`            | The wording or allowed commitments leave a promise ambiguous.                             |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Reviews expressed promises. It does not approve refunds, establish contractual obligations, or execute actions.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo promise-check` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe promise-check` shows the input and result schemas.
