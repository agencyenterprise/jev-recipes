# Check proposed action scope

Is proposedAction within the work requested in request and constraints? Do not treat a potentially helpful extra task as requested work. An explicit constraint overrides an implied convenience.

```ts
import { actionScope } from 'jev-recipes/action-scope';

const result = await actionScope({
  request: 'Explain why this deployment failed.',
  proposedAction: 'Deploy a replacement release to production.',
});

console.log(result.status, result.verdict);
```

## Input

| Field            | Accepts                                      |
| ---------------- | -------------------------------------------- |
| `request`        | Non-empty text                               |
| `proposedAction` | Non-empty text                               |
| `constraints`    | Optional non-empty text                      |
| `minConfidence`  | Optional number from 0 to 1; defaults to 0.8 |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| `within_scope`    | The action is explicitly requested or directly necessary under the stated constraints.                        |
| `additional_work` | The action introduces unrequested work, changes the requested outcome, or violates a stated scope constraint. |
| `unclear`         | The scope relationship cannot be established from the request.                                                |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses semantic scope only. User authorization and access controls must be enforced by the application.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo action-scope` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe action-scope` shows the input and result schemas.
