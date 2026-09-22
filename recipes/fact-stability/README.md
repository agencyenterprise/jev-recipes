# Assess fact stability

Is fact about an enduring or historical attribute, or a state that is expected to change? Classify the kind of information, not whether this particular fact is currently true.

```ts
import { factStability } from 'jev-recipes/fact-stability';

const result = await factStability({
  fact: 'The API is currently experiencing an outage.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `fact`          | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict      | Meaning                                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| `stable`     | The fact describes a historical event, definition, or enduring attribute unlikely to change in the relevant context. |
| `changeable` | The fact describes a current state, preference, configuration, or other information that can change.                 |
| `unclear`    | The kind or relevant timescale is not established.                                                                   |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Does not establish truth, expiration times, or freshness. Refresh policies and timestamp comparisons belong in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo fact-stability` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe fact-stability` shows the input and result schemas.
