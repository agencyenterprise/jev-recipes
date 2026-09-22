# Clarify

Check whether a request supplies the information your application needs. You define the requirements; the recipe identifies which ones are present, missing, or ambiguous.

```ts
import { clarify } from 'jev-recipes/clarify';

const result = await clarify({
  request: 'Please cancel it.',
  context: 'The customer has a storage subscription and a pending hardware order.',
  requirements: [
    { id: 'target', description: 'Which product or order should be changed' },
    { id: 'action', description: 'What change the customer wants' },
  ],
});

console.log(result.canProceed, result.missing, result.ambiguous);
```

Provide 1 to 50 requirements with unique, non-empty IDs. Optional `context` supplies conversation history or application facts. `minConfidence` defaults to `0.8` and applies independently to each check.

- `present`: the required information is explicit or unambiguously implied.
- `missing`: the required information is absent.
- `ambiguous`: relevant information has multiple plausible meanings or conflicting values.

`canProceed` is true only when every requirement is confidently present. `missing` and `ambiguous` contain confidently classified requirement IDs. Low-confidence checks remain in `checks` with `status: "review"`; they block proceeding even if both arrays are empty. Overall `status` is `review` when any check falls below the threshold.

A `ready` result can still require clarification. Each check includes its verdict, confidence, and probabilities; the result also includes model and token usage.

Your application maps requirement IDs to follow-up questions or asks its generative model to phrase them. This recipe neither discovers requirements nor generates questions. It does not validate identity, permissions, or exact field formats.

Run `npm run jev -- demo clarify` for the hand-authored offline [fixture](demo.json). Evaluate your own requirements and thresholds on labeled examples before relying on them.
