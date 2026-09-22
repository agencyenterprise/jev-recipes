# Check handoff rules

<!-- BEGIN GENERATED: usage -->

Decide whether a request matches your human escalation rules.

Use when: You need to decide whether your escalation rules call for a human.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { handoff } from 'jev-recipes/handoff';

const result = await handoff({
  request: 'Please connect me with a person.',
  rules: [
    {
      id: 'requested-human',
      description: 'The customer explicitly asks to speak with a human support representative.',
    },
  ],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo handoff`.

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
  "decision": "human",
  "matchedRules": ["requested-human"],
  "uncertainRules": [],
  "checks": [
    {
      "id": "requested-human",
      "status": "ready",
      "verdict": "matches",
      "confidence": 0.96,
      "probabilities": {
        "matches": 0.97,
        "does_not_match": 0.015,
        "unclear": 0.015
      }
    }
  ]
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`route`](../route/README.md): Use route to choose a handler when escalation is not the decision.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                                     |
| --------------- | -------- | --------------------------------------------------------- |
| `request`       | Yes      | string                                                    |
| `context`       | No       | string                                                    |
| `rules`         | Yes      | { id, description }[]; at least 1 items; at most 50 items |
| `minConfidence` | No       | number; minimum 0; maximum 1                              |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

| Decision   | Condition                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------- |
| `human`    | At least one rule confidently matches.                                                        |
| `review`   | No confident match exists and at least one rule is unclear or below the confidence threshold. |
| `continue` | Every rule confidently does not match.                                                        |

`checks` preserves each rule ID with its verdict (`matches`, `does_not_match`, or `unclear`), status, confidence, and probabilities. Check status reflects the confidence threshold. A high-confidence `unclear` verdict still describes uncertainty about whether the rule applies.

`matchedRules` contains confident matches. `uncertainRules` contains unclear and low-confidence checks. One confident match is enough for `decision: "human"` and `status: "ready"`, even when other rules are uncertain. A review decision always has review status.

The result includes model and token usage. Inspect the outcome as well as its review status.

## Reuse and calls

Uses the shared item-check helper. This folder owns the rule criteria and human, continue, or review decision. All rule questions are sent in one request. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Write observable rules and supply the facts needed to evaluate them. Compute exact amounts, deadlines, and permissions in code. This recipe does not contact anyone, execute actions, or enforce access controls.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo handoff` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe handoff` to inspect the input and result schemas.
