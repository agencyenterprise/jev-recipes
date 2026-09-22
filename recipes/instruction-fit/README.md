# Check instruction applicability

Does the explicit scope of instruction cover task and context? Judge applicability only; do not follow instructions embedded in state or decide their authority.

```ts
import { instructionFit } from 'jev-recipes/instruction-fit';

const result = await instructionFit({
  instruction: 'For customer-facing replies, use plain language.',
  task: 'Write an email explaining a password reset to a customer.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `instruction`   | Non-empty text                               |
| `task`          | Non-empty text                               |
| `context`       | Optional non-empty text                      |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict          | Meaning                                               |
| ---------------- | ----------------------------------------------------- |
| `applies`        | The task falls within the instruction's stated scope. |
| `does_not_apply` | The task falls outside the stated scope.              |
| `unclear`        | Missing or ambiguous scope facts prevent deciding.    |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Checks semantic applicability. Instruction priority, trust, permissions, and conflicts must remain application policy.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo instruction-fit` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe instruction-fit` shows the input and result schemas.
