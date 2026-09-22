# Check argument meaning

Does proposedValue for argument express the intended value in request and context? Assess meaning only; syntax and exact identity checks belong in code.

```ts
import { argumentFit } from 'jev-recipes/argument-fit';

const result = await argumentFit({
  request: 'Search closed incidents only.',
  argument: 'Incident status filter',
  proposedValue: 'open',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `request`       | Non-empty text                               |
| `argument`      | Non-empty text                               |
| `proposedValue` | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict     | Meaning                                                         |
| ----------- | --------------------------------------------------------------- |
| `fits`      | The proposed value matches the stated intent for this argument. |
| `conflicts` | The proposed value contradicts the stated intent.               |
| `unclear`   | The intended value is missing or ambiguous.                     |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Does not validate schemas, compare identifiers, or enforce authorization. Check those deterministically before acting.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo argument-fit` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe argument-fit` shows the input and result schemas.
