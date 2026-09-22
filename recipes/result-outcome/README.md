# Interpret a reported tool outcome

What outcome does result report for task? Judge only what the response claims. A success status for transport alone does not establish completion of the requested task.

```ts
import { resultOutcome } from 'jev-recipes/result-outcome';

const result = await resultOutcome({
  task: 'Export the customer report.',
  result: 'The export could not be created because the account lacks export access.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `task`          | Non-empty text                               |
| `result`        | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                              |
| ----------------- | ------------------------------------------------------------------------------------ |
| `success`         | The response explicitly reports the full requested task completed.                   |
| `partial_success` | The response reports some requested work completed and some unfinished.              |
| `failure`         | The response explicitly reports the requested work failed or could not be performed. |
| `unclear`         | The response does not establish a task outcome.                                      |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Interprets a report; it does not independently confirm an external action occurred. Prefer structured result fields when available.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo result-outcome` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe result-outcome` shows the input and result schemas.
