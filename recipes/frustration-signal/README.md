# Detect expressed frustration

Does message express frustration or dissatisfaction in its wording? Assess expressed language only, not the writer's hidden emotional or mental state.

```ts
import { frustrationSignal } from 'jev-recipes/frustration-signal';

const result = await frustrationSignal({
  message: 'This is the third time I have asked. It is frustrating to keep repeating myself.',
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

| Verdict         | Meaning                                                                 |
| --------------- | ----------------------------------------------------------------------- |
| `expressed`     | The wording clearly expresses frustration or dissatisfaction.           |
| `not_expressed` | The wording does not express frustration or dissatisfaction.            |
| `unclear`       | Ambiguous or context-dependent wording prevents a clear interpretation. |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Classifies expressed language only. It does not diagnose emotions or determine customer importance or entitlement.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo frustration-signal` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe frustration-signal` shows the input and result schemas.
