# Check whether a requirement is testable

<!-- BEGIN GENERATED: usage -->

Decide whether a requirement defines an observable way to distinguish meeting it from failing it.

Use when: You need to check whether a requirement has clear, observable acceptance criteria before building it.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { requirementTestability } from 'jev-recipes/requirement-testability';

const result = await requirementTestability({
  requirement: 'The dashboard should load quickly.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo requirement-testability`.

<details>
<summary>Illustrative result from the offline fixture</summary>

```json
{
  "model": "demo-fixture",
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0
  },
  "status": "ready",
  "verdict": "not_testable",
  "confidence": 0.96,
  "probabilities": {
    "testable": 0.02,
    "not_testable": 0.96,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`step-complete`](../step-complete/README.md): Use step-complete to check evidence against a condition that has already been defined.
- [`clarify`](../clarify/README.md): Use clarify to find missing information across a supplied list of requirements.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `requirement`   | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Supply non-empty text for each required field. Optional `context` must also be non-empty when supplied. `minConfidence` defaults to `0.8` and accepts values from `0` to `1`.

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict        | Meaning                                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| `testable`     | The supplied requirement and definitions establish observable conditions for distinguishing pass from fail.           |
| `not_testable` | The intended requirement is understandable, but the supplied criteria do not define an observable pass/fail boundary. |
| `unclear`      | The requirement or its references are too ambiguous to determine what would need to be observed.                      |

The result has `status: 'ready'` when confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it has `status: 'review'`. An `unclear` verdict always requires review, even at high confidence or with a zero threshold. `ready` describes confidence in the assessment, not approval to act.

## Decision boundaries

These cases document the intended decision policy. They are not live model evaluation results.

| Supplied situation                                                                                     | Intended verdict |
| ------------------------------------------------------------------------------------------------------ | ---------------- |
| "For a rejected password, display the text Password not accepted beneath the password field."          | `testable`       |
| "The page loads in at most two seconds" with the measurement start, end, and test conditions supplied. | `testable`       |
| "The dashboard should load quickly" with no further definition.                                        | `not_testable`   |
| "Follow the standard" without identifying or supplying that standard.                                  | `unclear`        |

## Reuse

This checks whether completion could be observed using the stated criteria. step-complete checks whether supplied evidence shows that a known condition has been met.

Uses the shared choice helper and makes one logical Jev request. It does not call another recipe or perform application actions.

## Limits

- Assesses the wording and supplied definitions; does not generate tests, prove feasibility, or inspect an implementation.
- Exact measurements and pass/fail calculations belong in application code.
