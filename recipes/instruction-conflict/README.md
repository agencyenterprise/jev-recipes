# Check instructions for conflict

<!-- BEGIN GENERATED: usage -->

Decide whether two instructions can both be followed under the supplied circumstances.

Use when: You need to detect conflicting instructions before carrying out a task.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { instructionConflict } from 'jev-recipes/instruction-conflict';

const result = await instructionConflict({
  firstInstruction: 'Send the report as a PDF attachment.',
  secondInstruction:
    'Send the report only as plain text in the email body; do not attach any files.',
  context: 'Both instructions apply to the same outgoing report email.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo instruction-conflict`.

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
  "verdict": "conflicting",
  "confidence": 0.96,
  "probabilities": {
    "compatible": 0.013333333333333334,
    "conflicting": 0.96,
    "different_scope": 0.013333333333333334,
    "unclear": 0.013333333333333334
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`instruction-fit`](../instruction-fit/README.md): Use instruction-fit to decide whether one instruction applies to a task.
- [`answer-consistency`](../answer-consistency/README.md): Use answer-consistency to compare factual claims rather than required behavior.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field               | Required | Shape                        |
| ------------------- | -------- | ---------------------------- |
| `firstInstruction`  | Yes      | string                       |
| `secondInstruction` | Yes      | string                       |
| `context`           | No       | string                       |
| `minConfidence`     | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Supply non-empty text for each required field. Optional `context` must also be non-empty when supplied. `minConfidence` defaults to `0.8` and accepts values from `0` to `1`.

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| `compatible`      | The instructions share an applicable scope and their requirements can both be followed.                   |
| `conflicting`     | Both instructions apply under the same supplied circumstances and require mutually incompatible behavior. |
| `different_scope` | The instructions explicitly apply to separate circumstances, so their requirements do not compete.        |
| `unclear`         | Their meaning, scope, or conditions leave it unresolved whether both can be followed.                     |

The result has `status: 'ready'` when confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it has `status: 'review'`. An `unclear` verdict always requires review, even at high confidence or with a zero threshold. `ready` describes confidence in the assessment, not approval to act.

## Decision boundaries

These cases document the intended decision policy. They are not live model evaluation results.

| Supplied situation                                                    | Intended verdict  |
| --------------------------------------------------------------------- | ----------------- |
| Attach a PDF, and do not include any attachments, for the same email. | `conflicting`     |
| Use plain language, and include a short introduction.                 | `compatible`      |
| Use PDF for monthly reports, and plain text for weekly reports.       | `different_scope` |
| Use the approved format, but the approved format is not supplied.     | `unclear`         |

## Reuse

This compares what instructions require. It does not compare whether factual statements are true, and it does not decide which instruction has priority.

Uses the shared choice helper and makes one logical Jev request. It does not call another recipe or perform application actions.

## Limits

- Assesses compatibility of supplied instructions only; does not establish their authority or choose which one wins.
- Does not enforce permissions or execute instructions. The caller resolves conflicts before acting.
