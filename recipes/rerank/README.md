# Rerank

Rank supplied passages by how directly they help answer a query. This function does not retrieve documents or write an answer.

```ts
import { rerank } from 'jev-recipes/rerank';

const result = await rerank({
  query: 'How do I reset my password?',
  items: [
    { id: 'billing', text: 'Invoices appear on the Billing page.' },
    { id: 'reset', text: 'Select Forgot password to receive a reset link.' },
  ],
  topK: 5,
  minRelevance: 0.5,
});
```

Supply 1 to 100 items with unique, non-empty IDs and non-empty text. `topK` defaults to `5` and must be an integer from 1 to 100. `minRelevance` defaults to `0.5` and must be between 0 and 1.

One Jev call asks an independent yes/no relevance question for every item. The returned relevance values do not sum to 1 and have no separate confidence field. Results at or above the threshold are sorted, then limited to `topK`. Equal scores keep the original order. IDs and text are preserved, and the input array is not changed.

An empty selection returns `status: "review"`. `ready` means some candidates passed the relevance threshold; it does not establish that they completely answer the query. The result also includes the number evaluated, model, and token usage. Large passages may require fewer items to fit the provider's context limit.

Try `npm run jev -- demo rerank` for the offline [`demo.json`](demo.json) fixture. Use `node dist/cli/index.js example rerank` to print editable input. Live retrieval quality and cost improvements have not been measured.
