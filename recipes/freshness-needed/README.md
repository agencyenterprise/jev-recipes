# Check information freshness needs

Does question require a current or time-specific state that can change, or stable conceptual knowledge? Classify the information need without looking up the answer.

```ts
import { freshnessNeeded } from 'jev-recipes/freshness-needed';

const result = await freshnessNeeded({
  question: 'Is the API experiencing an outage right now?',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `question`      | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict   | Meaning                                                                       |
| --------- | ----------------------------------------------------------------------------- |
| `current` | The answer depends on current or explicitly time-specific facts.              |
| `stable`  | The question asks for general concepts that do not depend on a current state. |
| `unclear` | The intended time sensitivity cannot be determined.                           |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Does not check timestamps, determine whether a source is up to date, or retrieve current information.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo freshness-needed` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe freshness-needed` shows the input and result schemas.
