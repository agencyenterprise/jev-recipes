# Classify search intent

<!-- BEGIN GENERATED: usage -->

What is the searcher behind query trying to do: learn, reach a site, buy, compare before buying, or find something nearby?

Use when: You map keywords to page types, route queries to different result layouts, or audit whether content matches the intent behind the terms it targets.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { searchIntentKind } from 'jev-recipes/search-intent-kind';

const result = await searchIntentKind({
  query: 'best noise cancelling headphones under 200 vs sony wh-1000xm5',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo search-intent-kind`.

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
  "verdict": "commercial",
  "confidence": 0.86,
  "probabilities": {
    "informational": 0.03,
    "navigational": 0.01,
    "transactional": 0.06,
    "commercial": 0.86,
    "local": 0.01,
    "unclear": 0.03
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`turn-intent`](../turn-intent/README.md): Use turn-intent to classify what a user wants from a single message in a conversation.
- [`query-specificity`](../query-specificity/README.md): Use query-specificity to judge how narrow or broad a query is rather than what the searcher wants to do.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `query`         | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is one of `informational`, `navigational`, `transactional`, `commercial`, `local`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The verdict comes from the words in the query, not from the searcher's history, device, location, or the pages a search engine returns. Many real queries blend intents, so use the probabilities when a page could serve more than one. Mapping intents to page templates, ad bids, or ranking rules belongs in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo search-intent-kind` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe search-intent-kind` to inspect the input and result schemas.
