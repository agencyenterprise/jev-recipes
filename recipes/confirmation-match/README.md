# Interpret a confirmation

Does response clearly agree to or reject this exact proposal? Do not treat politeness, acknowledgment, a question, or agreement to only part of the proposal as full agreement.

```ts
import { confirmationMatch } from 'jev-recipes/confirmation-match';

const result = await confirmationMatch({
  proposal: 'Cancel the storage subscription now.',
  response: 'How much would I save?',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `proposal`      | Non-empty text                               |
| `response`      | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict   | Meaning                                                                                |
| --------- | -------------------------------------------------------------------------------------- |
| `agrees`  | The response clearly agrees to this complete proposal.                                 |
| `rejects` | The response clearly rejects this proposal.                                            |
| `unclear` | The response is conditional, partial, ambiguous, unrelated, or only an acknowledgment. |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Interprets language only. Approval identity, authority, scope, expiration, and action permissions remain application checks.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo confirmation-match` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe confirmation-match` shows the input and result schemas.
