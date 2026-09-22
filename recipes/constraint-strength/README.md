# Distinguish requirements from preferences

<!-- BEGIN GENERATED: usage -->

Classify a stated constraint as required, preferred, optional, or unclear.

Use when: You need to distinguish a hard requirement from a preference or an optional suggestion.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { constraintStrength } from 'jev-recipes/constraint-strength';

const result = await constraintStrength({
  statement: 'Prefer a CSV export, but JSON is fine if that is easier.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo constraint-strength`.

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
  "verdict": "preferred",
  "confidence": 0.96,
  "probabilities": {
    "required": 0.013333333333333334,
    "preferred": 0.96,
    "optional": 0.013333333333333334,
    "unclear": 0.013333333333333334
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`preference-kind`](../preference-kind/README.md): Use preference-kind to distinguish lasting preferences from facts and temporary requests.
- [`instruction-fit`](../instruction-fit/README.md): Use instruction-fit to decide whether the constraint applies in the current circumstances.
- [`instruction-conflict`](../instruction-conflict/README.md): Use instruction-conflict to compare the requirements of two instructions.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `statement`     | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Supply non-empty text for each required field. Optional `context` must also be non-empty when supplied. `minConfidence` defaults to `0.8` and accepts values from `0` to `1`.

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict     | Meaning                                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| `required`  | The statement presents an obligation or prohibition that must be met whenever its stated condition applies. |
| `preferred` | The statement favors an outcome but explicitly or unambiguously allows alternatives.                        |
| `optional`  | The statement explicitly leaves the choice open without favoring an outcome.                                |
| `unclear`   | The wording or context does not establish one constraint with a clear level of obligation.                  |

The result has `status: 'ready'` when confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it has `status: 'review'`. An `unclear` verdict always requires review, even at high confidence or with a zero threshold. `ready` describes confidence in the assessment, not approval to act.

## Decision boundaries

These cases document the intended decision policy. They are not live model evaluation results.

| Supplied situation                                                | Intended verdict |
| ----------------------------------------------------------------- | ---------------- |
| "Do not attach files."                                            | `required`       |
| "If the report is external, remove internal notes."               | `required`       |
| "Prefer CSV, but JSON is fine."                                   | `preferred`      |
| "Including a chart is entirely up to you; either choice is fine." | `optional`       |
| "The CSV is required but optional" with no clarification.         | `unclear`        |

## Reuse

This checks the force of one expressed constraint. It does not decide whether a preference is permanent, whether a rule applies, or whether an action is authorized.

Uses the shared choice helper and makes one logical Jev request. It does not call another recipe or perform application actions.

## Limits

- Reports how the supplied wording presents a constraint; it does not establish authority, consent, or permission.
- Evaluate one constraint at a time. Split mixed requirements in caller code before comparing their strength.
