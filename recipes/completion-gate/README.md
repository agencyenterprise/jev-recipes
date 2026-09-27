# Gate an agent claiming it is done

<!-- BEGIN GENERATED: usage -->

Did an agent finish task, judging report against evidence, with unproven claims, quietly narrowed scope, open questions, and unresolved errors flagged in the same call?

Use when: A coding agent says it is finished and you must decide, before accepting or before letting it stop, whether the work is actually complete.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { completionGate } from 'jev-recipes/completion-gate';

const result = await completionGate({
  task: 'Add input validation to the signup endpoint, write unit tests for the new validation, and make sure the full test suite passes.',
  report:
    'I added validation for email and password fields in signup.ts and wrote three unit tests covering the new checks. All tests pass. Let me know if you want me to also validate the username field.',
  evidence:
    '$ npm test\n\nTest Files  12 passed (12)\n     Tests  87 passed (87)\n\n$ git diff --stat\n src/signup.ts          | 18 ++++++++++++\n tests/signup.test.ts   | 41 +++++++++++++++++++++++++',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo completion-gate`.

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
  "verdict": "complete",
  "confidence": 0.9,
  "probabilities": {
    "complete": 0.9,
    "incomplete": 0.05,
    "unverified": 0.03,
    "unclear": 0.02
  },
  "signals": {
    "claimsWithoutEvidence": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.06,
      "confidence": 0.94
    },
    "scopeNarrowed": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.08,
      "confidence": 0.92
    },
    "openQuestions": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.12,
      "confidence": 0.88
    },
    "unresolvedErrors": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.03,
      "confidence": 0.97
    }
  },
  "detected": []
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`step-complete`](../step-complete/README.md): Use step-complete to check one explicit completion condition against evidence.
- [`goal-drift`](../goal-drift/README.md): Use goal-drift while the agent is still working to catch a step that wanders from the goal.
- [`result-plausibility`](../result-plausibility/README.md): Use result-plausibility to check whether a single tool result is a real answer.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `task`          | Yes      | string                       |
| `report`        | Yes      | string                       |
| `evidence`      | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

`task` is the original assignment. `report` is the agent's final message. `evidence` is the record that can prove the report: test output, a diff summary, command results, or the tail of the transcript. Without `evidence`, the recipe judges the report alone and treats its bare assertions as unverified.

## Result

`verdict` is `complete`, `incomplete`, `unverified`, or `unclear`, with `confidence` and `probabilities`. Only `complete` should let the agent stop without a second look.

`signals` carries four independent checks made in the same request: `claimsWithoutEvidence`, `scopeNarrowed`, `openQuestions`, and `unresolvedErrors`, each with its own `verdict`, `probability`, `confidence`, and `status`. `detected` lists the signals judged present. Use them to decide what to send back to the agent: an `openQuestions` signal usually means the agent should make the decision itself, while `unresolvedErrors` means it should keep working.

A result is `ready` when the decision confidence meets `minConfidence` and the verdict is not `unclear`. Otherwise it is `review`.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

Measured on 44 golden cases against `jev-1.13.0`: **86% accurate** overall (contested cases 67%, adversarial cases 100%).

| `minConfidence` | Deferred to review | Accuracy of ready results |
| --------------- | ------------------ | ------------------------- |
| 0.5             | 7%                 | 88%                       |
| 0.6             | 11%                | 87%                       |
| 0.7             | 14%                | 90%                       |
| 0.8             | 23%                | 91%                       |
| 0.9             | 39%                | 89%                       |
| 0.95            | 50%                | 96%                       |

The lowest threshold reaching 95% accuracy on ready results is 0.95.

Run `npm run eval -- completion-gate` to save new results and update this guide. The full report, including misses, is in [evals/results/completion-gate.json](../../evals/results/completion-gate.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->

## Reuse and calls

Uses the shared choice-with-labels fan-out helper. One live invocation makes one Jev request carrying five questions. This folder owns the completion instruction, the verdict criteria, and the signal definitions.

## Limits

Supply real evidence. A report that says "all tests pass" with no test output is `unverified` by design. When the transcript is long, pass its final portion plus any command output that bears on the task.

The recipe does not judge code quality or correctness beyond what the evidence shows. Pair it with a review step for that.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo completion-gate` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe completion-gate` to inspect the input and result schemas.
