# Detect an explicit urgency request

Does message explicitly request urgent attention? Look for stated urgency, not inferred importance, customer tone, or an unstated interpretation of a date.

```ts
import { urgencySignal } from 'jev-recipes/urgency-signal';

const result = await urgencySignal({
  message: 'Please treat this as urgent; we need someone to look at it immediately.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `message`       | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict         | Meaning                                                                    |
| --------------- | -------------------------------------------------------------------------- |
| `expressed`     | The message explicitly asks for immediate, urgent, or expedited attention. |
| `not_expressed` | The message does not explicitly ask for urgent attention.                  |
| `unclear`       | The urgency language is too ambiguous to interpret.                        |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Detects an expressed urgency request. Compute deadline proximity and apply incident or service priority rules in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo urgency-signal` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe urgency-signal` shows the input and result schemas.
