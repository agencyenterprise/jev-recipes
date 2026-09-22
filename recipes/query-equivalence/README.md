# Compare question meaning

Do firstQuestion and secondQuestion request the same information under the same stated conditions? Shared vocabulary or topic alone is not equivalence.

```ts
import { queryEquivalence } from 'jev-recipes/query-equivalence';

const result = await queryEquivalence({
  firstQuestion: 'How can I reset my password?',
  secondQuestion: 'What should I do if I forgot my password?',
});

console.log(result.status, result.verdict);
```

## Input

| Field            | Accepts                                      |
| ---------------- | -------------------------------------------- |
| `firstQuestion`  | Non-empty text                               |
| `secondQuestion` | Non-empty text                               |
| `context`        | Optional non-empty text                      |
| `minConfidence`  | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict      | Meaning                                                                    |
| ------------ | -------------------------------------------------------------------------- |
| `equivalent` | Both questions request the same information with compatible conditions.    |
| `related`    | They share a topic but differ in a material information need or condition. |
| `different`  | They request different subjects or unrelated information.                  |
| `unclear`    | The intended meanings cannot be resolved.                                  |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Compares supplied questions. It does not rewrite them or establish that an existing answer is still valid.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo query-equivalence` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe query-equivalence` shows the input and result schemas.
