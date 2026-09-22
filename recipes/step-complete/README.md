# Check one completion condition

Does evidence establish that condition has been met? A plan, attempted action, or unsupported assertion of completion is not enough unless the condition specifically concerns that report.

```ts
import { stepComplete } from 'jev-recipes/step-complete';

const result = await stepComplete({
  condition: 'The customer has received a reset email.',
  evidence: 'A reset email was queued for delivery. Delivery has not been confirmed.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `condition`     | Non-empty text                               |
| `evidence`      | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict   | Meaning                                                             |
| --------- | ------------------------------------------------------------------- |
| `met`     | The evidence establishes the full condition is satisfied.           |
| `unmet`   | The evidence establishes the condition is not fully satisfied.      |
| `unclear` | The evidence does not establish whether the condition is satisfied. |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses supplied evidence for one condition. Use exact system state checks when the condition can be determined in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo step-complete` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe step-complete` shows the input and result schemas.
