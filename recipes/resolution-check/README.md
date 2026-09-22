# Check reported resolution

Does message establish that the customer reports issue as resolved? Courtesy or thanks without a resolution statement is not enough. Assess the reported state, not the actual system state.

```ts
import { resolutionCheck } from 'jev-recipes/resolution-check';

const result = await resolutionCheck({
  issue: 'The customer cannot sign in.',
  message: 'The reset worked. I can sign in now.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `issue`         | Non-empty text                               |
| `message`       | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict      | Meaning                                                                             |
| ------------ | ----------------------------------------------------------------------------------- |
| `resolved`   | The customer clearly reports this issue is solved or the desired outcome now works. |
| `unresolved` | The customer clearly reports this issue persists or the attempted fix failed.       |
| `unclear`    | The message does not establish whether this issue is resolved.                      |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Interprets the customer report. It does not verify the system state, close a ticket, or treat courtesy alone as resolution.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo resolution-check` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe resolution-check` shows the input and result schemas.
