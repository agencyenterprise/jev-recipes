# Check tool result usefulness

Does result provide information useful for task? A response can be technically successful but contain no substantive information or information about a different task.

```ts
import { resultUsefulness } from 'jev-recipes/result-usefulness';

const result = await resultUsefulness({
  task: 'Find password reset instructions.',
  result: 'Search completed successfully. No matching documents were found.',
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

| Verdict                 | Meaning                                                                           |
| ----------------------- | --------------------------------------------------------------------------------- |
| `useful`                | The response contains substantive information useful for the task.                |
| `no_useful_information` | The response reports no results, an inability to help, or only empty boilerplate. |
| `irrelevant`            | The response contains substantive information about a different task or subject.  |
| `unclear`               | The response cannot be interpreted well enough to assess usefulness.              |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses response content, not transport success or source truth. Handle empty bodies and status codes in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo result-usefulness` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe result-usefulness` shows the input and result schemas.
