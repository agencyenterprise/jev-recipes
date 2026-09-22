# Check source applicability

Does the scope described in passage apply to scenario? Distinguish applicable information from information about another product, environment, role, or condition.

```ts
import { sourceApplicability } from 'jev-recipes/source-applicability';

const result = await sourceApplicability({
  passage: 'Workspace owners can delete the workspace. These instructions are for owners only.',
  scenario: 'A workspace guest wants to delete the workspace.',
});

console.log(result.status, result.verdict);
```

## Input

| Field           | Accepts                                      |
| --------------- | -------------------------------------------- |
| `passage`       | Non-empty text                               |
| `scenario`      | Non-empty text                               |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict          | Meaning                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| `applies`        | The passage explicitly covers or unambiguously applies to the scenario. |
| `does_not_apply` | The passage is scoped to incompatible circumstances.                    |
| `unclear`        | Required scope information is missing or ambiguous.                     |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses semantic scope. Enforce tenant, access, exact version, and region constraints in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo source-applicability` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npm run jev -- describe source-applicability` shows the input and result schemas.
