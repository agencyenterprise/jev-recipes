# Handoff

Check a request against your rules for involving a human. The function returns a decision; your application handles the transfer.

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

console.log(result.decision, result.matchedRules);
```

Provide 1 to 50 rules with unique, non-empty IDs. Optional `context` supplies conversation history or application facts. `minConfidence` defaults to `0.8` and applies independently to each check.

| Decision   | Condition                                                               |
| ---------- | ----------------------------------------------------------------------- |
| `human`    | At least one rule confidently `matches`.                                |
| `review`   | No confident match, and at least one `unclear` or low-confidence check. |
| `continue` | Every rule confidently `does_not_match`.                                |

`matchedRules` contains confident matches. `uncertainRules` contains unclear and low-confidence checks. A confident match is enough to return `human` with `status: "ready"`, even if other rules are uncertain. A `review` decision always has `status: "review"`.

The result includes every rule's verdict, confidence, and probabilities, plus model and token usage. An `unclear` verdict can have high confidence: the model is confident that it cannot decide from the supplied facts.

Write observable rules and provide the facts needed to evaluate them. Compute exact amounts, dates, permissions, and hard limits in code. This semantic check does not contact anyone, enforce authorization, or provide a security boundary.

Run `npm run jev -- demo handoff` for the hand-authored offline [fixture](demo.json). Fixtures do not measure live model accuracy.
