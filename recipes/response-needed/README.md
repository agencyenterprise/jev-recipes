# Check whether a reply is needed

Does message require a substantive reply in context? A question, request, correction needing follow-through, or unresolved issue requires a reply. A simple closing acknowledgment does not.

```ts
import { responseNeeded } from 'jev-recipes/response-needed';

const result = await responseNeeded({
  message: 'Thanks, that solved it!',
  context: 'The assistant provided password reset instructions.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `message`       | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                        |
| ----------------- | ------------------------------------------------------------------------------ |
| `reply_needed`    | The message requests or requires substantive follow-through.                   |
| `no_reply_needed` | The message closes or acknowledges the exchange without an unresolved request. |
| `unclear`         | The supplied context does not establish whether a response is expected.        |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses conversational need. Channel-specific response obligations and customer service policies remain application rules.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo response-needed` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe response-needed` shows the input and result schemas.
