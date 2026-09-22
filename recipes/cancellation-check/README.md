# Check cancellation intent

Does message ask to cancel, pause, or continue task? Resolve which task the instruction concerns. Pausing means stop temporarily; cancellation abandons the task.

```ts
import { cancellationCheck } from 'jev-recipes/cancellation-check';

const result = await cancellationCheck({
  task: 'Draft a response to the customer.',
  message: 'Hold off until I send you the updated policy.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `task`          | Non-empty text                               |
| `message`       | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict    | Meaning                                                                         |
| ---------- | ------------------------------------------------------------------------------- |
| `cancel`   | The message clearly asks to abandon this task.                                  |
| `pause`    | The message clearly asks to suspend this task temporarily.                      |
| `continue` | The message clearly asks to proceed with this task.                             |
| `unclear`  | The message does not clearly establish one of these instructions for this task. |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Does not stop running work or infer permission to continue from silence. The caller applies the decision.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo cancellation-check` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe cancellation-check` shows the input and result schemas.
