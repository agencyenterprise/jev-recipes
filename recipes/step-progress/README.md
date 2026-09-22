# Check step progress

How does observation change progress toward objective relative to previousState? Base the decision on observed information or achieved conditions, not an unsupported claim of progress.

```ts
import { stepProgress } from 'jev-recipes/step-progress';

const result = await stepProgress({
  objective: 'Find the password reset documentation.',
  previousState: 'No relevant page has been identified.',
  observation: 'The search returned the official password reset guide.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `objective`     | Non-empty text                               |
| `previousState` | Non-empty text                               |
| `observation`   | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict       | Meaning                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------- |
| `progress`    | The observation establishes a useful new fact or achieved condition toward the objective.      |
| `no_progress` | The observation leaves the relevant state essentially unchanged.                               |
| `setback`     | The observation establishes loss of previously achieved progress or a worsened relevant state. |
| `unclear`     | The change in progress cannot be determined.                                                   |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Compares one observation with a supplied prior state. It does not measure elapsed time or schedule the next step.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo step-progress` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe step-progress` shows the input and result schemas.
