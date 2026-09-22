# Rerank evidence

Select supplied passages by how directly they help answer a query, then order them by relevance.

```ts
import { rerank } from 'jev-recipes/rerank';

const result = await rerank({
  query: 'How do I reset my password?',
  items: [
    {
      id: 'billing',
      text: 'Invoices appear on the Billing page.',
    },
    {
      id: 'reset',
      text: 'Select Forgot password to receive a reset link.',
    },
  ],
  topK: 1,
});

console.log(result.items);
```

## Input

| Field          | Accepts                                                                    |
| -------------- | -------------------------------------------------------------------------- |
| `query`        | Non-empty text describing the information needed                           |
| `items`        | 1 to 100 `{ id, text }` items with unique non-empty IDs and non-empty text |
| `topK`         | Optional integer from 1 to 100; defaults to 5                              |
| `minRelevance` | Optional number from 0 to 1; defaults to 0.5                               |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`items` contains passages at or above `minRelevance`, ordered from highest relevance to lowest and limited to `topK`. Each item keeps its ID and text and adds `relevance`. Equal values preserve input order. The input array is not changed.

`status` is `ready` when at least one passage qualifies, otherwise `review`. `evaluated` reports the number of supplied items. Relevance comes from independent yes/no questions, so values do not sum to 1 and have no separate confidence field.

The result includes model and token usage. Inspect the outcome as well as its review status.

## Reuse and calls

Uses shared input preparation, instruction handling, the SDK client, and yes/no answer parsing. This folder owns the relevance question, filtering, and ordering. All item questions are sent in one request. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Relevance does not establish that a passage is true or sufficient to answer the entire query. Use answerability to assess the selected evidence. This recipe does not retrieve documents or generate an answer.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After building the repository, `npm run jev -- demo rerank` shows an offline illustration, not an accuracy measurement. Use `npm run jev -- describe rerank` to inspect the input and result schemas.
