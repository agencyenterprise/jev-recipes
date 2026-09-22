# Check the dependency between two tasks

<!-- BEGIN GENERATED: usage -->

Identify whether either of two tasks requires the other to finish before it can start.

Use when: You need to decide whether two tasks can run in parallel or require a particular order.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { taskDependency } from 'jev-recipes/task-dependency';

const result = await taskDependency({
  firstTask: 'Build the release archive from the source code.',
  secondTask: 'Upload the completed release archive to the artifact store.',
  context:
    'The source code is available. No release archive exists yet, and uploading requires the completed archive.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo task-dependency`.

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
  "verdict": "first_before_second",
  "confidence": 0.96,
  "probabilities": {
    "first_before_second": 0.96,
    "second_before_first": 0.01,
    "independent": 0.01,
    "cyclic": 0.01,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`task-duplicate`](../task-duplicate/README.md): Use task-duplicate to detect repeated outcomes before scheduling tasks.
- [`step-complete`](../step-complete/README.md): Use step-complete to check whether evidence establishes a known prerequisite is already satisfied.

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

| Verdict               | Meaning                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| `first_before_second` | The second task needs the first task to finish, and the first does not need the second to finish. |
| `second_before_first` | The first task needs the second task to finish, and the second does not need the first to finish. |
| `independent`         | Neither task needs the other to finish before it can start under the supplied conditions.         |
| `cyclic`              | Each task requires the other to finish before it can start.                                       |
| `unclear`             | The supplied descriptions do not establish the prerequisite relationship.                         |

The result has `status: 'ready'` when confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it has `status: 'review'`. An `unclear` verdict always requires review, even at high confidence or with a zero threshold. `ready` describes confidence in the assessment, not approval to act.

## Decision boundaries

These cases document the intended decision policy. They are not live model evaluation results.

| Supplied situation                                                               | Intended verdict      |
| -------------------------------------------------------------------------------- | --------------------- |
| Build an archive, then upload that archive when it does not yet exist.           | `first_before_second` |
| Upload a missing archive, paired with the task that builds it.                   | `second_before_first` |
| Proofread two separate supplied documents, with both documents available.        | `independent`         |
| Each task explicitly requires the other task's completed output before starting. | `cyclic`              |
| Two tasks are mentioned without enough information about their prerequisites.    | `unclear`             |

## Reuse

This checks a necessary execution order between two tasks. It does not check completion, pick a tool, or select the next task.

Uses the shared choice helper and makes one logical Jev request. It does not call another recipe or perform application actions.

## Limits

- Assesses only the supplied pair and prerequisites; does not build or validate a complete dependency graph.
- Independence of prerequisites does not establish that parallel execution is safe: shared resources, locks, permissions, and scheduling remain the caller's responsibility.
