# Rerank evidence

<!-- BEGIN GENERATED: usage -->

Select candidate passages by relevance to a query.

Use when: You have retrieved passages and want the most relevant evidence for a question.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { rerank } from 'jev-recipes/rerank';

const result = await rerank({
  query: 'How do I reset my password?',
  items: [
    { id: 'billing', text: 'Invoices are available on the Billing page.' },
    {
      id: 'reset',
      text: 'Select Forgot password on the sign-in page. We will email you a reset link.',
    },
    {
      id: 'security',
      text: 'Choose a strong password and enable two-factor authentication.',
    },
  ],
  topK: 2,
  minRelevance: 0.5,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo rerank`.

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
  "items": [
    {
      "id": "reset",
      "text": "Select Forgot password on the sign-in page. We will email you a reset link.",
      "relevance": 0.97
    }
  ],
  "evaluated": 3
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`answerability`](../answerability/README.md): Use answerability to check whether the selected evidence is enough to answer.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field          | Required | Shape                                               |
| -------------- | -------- | --------------------------------------------------- |
| `query`        | Yes      | string                                              |
| `items`        | Yes      | { id, text }[]; at least 1 items; at most 100 items |
| `topK`         | No       | integer; minimum 1; maximum 100                     |
| `minRelevance` | No       | number; minimum 0; maximum 1                        |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

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

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo rerank` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe rerank` to inspect the input and result schemas.
