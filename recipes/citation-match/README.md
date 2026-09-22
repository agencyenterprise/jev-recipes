# Match claims to citations

Find passages that support a supplied claim. Each passage is checked independently against the entire claim.

```ts
import { citationMatch } from 'jev-recipes/citation-match';

const result = await citationMatch({
  claim: 'Reset links expire after 30 minutes.',
  passages: [
    {
      id: 'reset',
      text: 'Password reset links expire after 30 minutes.',
    },
    {
      id: 'billing',
      text: 'Invoices are available on the Billing page.',
    },
  ],
});

console.log(result.status, result.passageIds);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `claim`         | Non-empty text                               |
| `passages`      | 1 to 50 `{ id, text }` items with unique IDs |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

`passageIds` contains every passage that independently supports the entire claim at or above the confidence threshold. `checks` preserves the verification result for each passage. If any passage qualifies, overall status is `ready`, even if other checks need review. With no qualifying passage, uncertainty produces `review`; otherwise a confident no-match returns `ready` with an empty list.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the public [`verify`](../verify/README.md) recipe once, with one claim/evidence pair per passage. It adds selection of confidently supported passage IDs. A live invocation makes one logical Jev request; SDK retries can add transport attempts. All item questions are sent in that request.

## Limits

Returns passages that independently support the entire claim. Joint support across several individually incomplete passages is not assessed.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo citation-match` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe citation-match` shows the input and result schemas.
