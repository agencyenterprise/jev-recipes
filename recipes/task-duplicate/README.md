# Compare tasks for duplicate work

<!-- BEGIN GENERATED: usage -->

Decide whether two tasks request the same outcome, overlapping work, or distinct work.

Use when: You need to detect duplicate tasks before adding more work to a queue or plan.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { taskDuplicate } from 'jev-recipes/task-duplicate';

const result = await taskDuplicate({
  firstTask: 'Write a summary of the supplied onboarding guide for new hires.',
  secondTask:
    'Summarize the same supplied onboarding guide for new hires and translate the summary into Spanish.',
  context:
    'Both tasks require the same English summary; only the second also requires a Spanish translation.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo task-duplicate`.

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
  "verdict": "overlapping",
  "confidence": 0.96,
  "probabilities": {
    "duplicate": 0.013333333333333334,
    "overlapping": 0.96,
    "distinct": 0.013333333333333334,
    "unclear": 0.013333333333333334
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`repeated-attempt`](../repeated-attempt/README.md): Use repeated-attempt to compare the methods of two attempts toward one objective.
- [`task-dependency`](../task-dependency/README.md): Use task-dependency to check whether one task must finish before another starts.
- [`ticket-match`](../ticket-match/README.md): Use ticket-match to compare reported issues rather than requested work.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `firstTask`     | Yes      | string                       |
| `secondTask`    | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Supply non-empty text for each required field. Optional `context` must also be non-empty when supplied. `minConfidence` defaults to `0.8` and accepts values from `0` to `1`.

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict       | Meaning                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `duplicate`   | Completing either task would fully satisfy the other under the same scope and constraints.       |
| `overlapping` | The tasks share requested work, but at least one includes material work the other does not.      |
| `distinct`    | The tasks have separate requested outcomes or incompatible scopes with no shared requested work. |
| `unclear`     | Their targets, scope, or intended outcomes cannot be compared from the supplied information.     |

The result has `status: 'ready'` when confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it has `status: 'review'`. An `unclear` verdict always requires review, even at high confidence or with a zero threshold. `ready` describes confidence in the assessment, not approval to act.

## Decision boundaries

These cases document the intended decision policy. They are not live model evaluation results.

| Supplied situation                                                                            | Intended verdict |
| --------------------------------------------------------------------------------------------- | ---------------- |
| Summarize the same document for the same audience, with different wording in the task titles. | `duplicate`      |
| Summarize a document, versus summarize it and translate that summary.                         | `overlapping`    |
| Summarize two different documents, each producing its own summary.                            | `distinct`       |
| Two tasks say "update the report" without identifying the report or requested changes.        | `unclear`        |

## Reuse

This compares requested outcomes. repeated-attempt compares approaches, so two different approaches can still be duplicate tasks if they produce the same deliverable.

Uses the shared choice helper and makes one logical Jev request. It does not call another recipe or perform application actions.

## Limits

- Assesses described work only; does not merge queue entries, cancel tasks, or prove that an external action is safe to repeat.
- Shared topics or similar titles are insufficient to establish duplicate work.
