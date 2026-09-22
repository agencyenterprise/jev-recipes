# Check a previously attempted step

Does conversation establish whether the customer already performed step? Being told to try it, planning to try it, and actually trying it are different. Do not infer not-tried merely from silence.

```ts
import { attemptedStep } from 'jev-recipes/attempted-step';

const result = await attemptedStep({
  step: 'Clear the browser cache and try again.',
  conversation: 'I already cleared my browser cache and tried again. The error is still there.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `step`          | Non-empty text                               |
| `conversation`  | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict     | Meaning                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------- |
| `tried`     | The conversation explicitly states or unambiguously reports that this step was performed. |
| `not_tried` | The conversation explicitly establishes the step has not been performed.                  |
| `unclear`   | There is no reliable statement of whether the step was performed.                         |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Interprets reports of an attempt. It does not verify that the step was completed correctly or repeat the action.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo attempted-step` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe attempted-step` shows the input and result schemas.
