# Compare support tickets

Do firstTicket and secondTicket describe the same underlying reported issue? Similar symptoms alone establish relatedness, not identity. Use only supplied links between the reports.

```ts
import { ticketMatch } from 'jev-recipes/ticket-match';

const result = await ticketMatch({
  firstTicket: 'My workspace export fails with error EXPORT_TIMEOUT.',
  secondTicket: 'Exports also time out with EXPORT_TIMEOUT in another workspace.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `firstTicket`   | Non-empty text                               |
| `secondTicket`  | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict      | Meaning                                                                            |
| ------------ | ---------------------------------------------------------------------------------- |
| `same_issue` | The reports contain enough shared identifying context to establish the same issue. |
| `related`    | The reports share symptoms or a subject but do not establish the same issue.       |
| `different`  | The reports describe materially different issues.                                  |
| `unclear`    | The descriptions are insufficient to establish even their relationship.            |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Does not merge tickets or establish a shared root cause from similar symptoms alone. Compare exact identifiers in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo ticket-match` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe ticket-match` shows the input and result schemas.
