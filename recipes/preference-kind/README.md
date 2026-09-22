# Identify a stated preference

Does statement express an ongoing preference, a factual assertion, or a temporary request? Do not treat a task-specific instruction as a lasting preference without evidence of scope.

```ts
import { preferenceKind } from 'jev-recipes/preference-kind';

const result = await preferenceKind({
  statement: 'For this reply, please use bullet points.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `statement`     | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict             | Meaning                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| `preference`        | The statement expresses an ongoing choice or preferred way of working.                               |
| `fact`              | The statement asserts information without expressing a preference or requesting an action.           |
| `temporary_request` | The statement asks for something in the current situation without establishing a lasting preference. |
| `unclear`           | The intended kind cannot be established.                                                             |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Classifies a statement. It does not infer unexpressed preferences or grant permission to store personal information.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo preference-kind` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe preference-kind` shows the input and result schemas.
