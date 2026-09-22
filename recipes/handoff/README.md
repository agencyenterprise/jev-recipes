# Check handoff rules

Check whether a request matches your rules for involving a human. Your application handles the transfer.

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

console.log(result.decision);
```

## Input

| Field           | Accepts                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------- |
| `request`       | Non-empty text containing the request                                                    |
| `context`       | Optional non-empty conversation context or application facts                             |
| `rules`         | 1 to 50 `{ id, description }` rules with unique non-empty IDs and non-empty descriptions |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8                                             |

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
