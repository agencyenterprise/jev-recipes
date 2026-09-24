# Check passage self-containment

<!-- BEGIN GENERATED: usage -->

Can passage be understood on its own, without unresolved references to surrounding text?

Use when: You need to check chunks before embedding them, or decide whether a retrieved passage needs its neighbors to be useful.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { passageStandalone } from 'jev-recipes/passage-standalone';

const result = await passageStandalone({
  passage:
    'As noted above, this approach reduces the latency further, but it requires the second cache to be warmed before traffic shifts. Otherwise the fallback path described earlier is used.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo passage-standalone`.

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
  "probability": 0.08,
  "confidence": 0.92,
  "verdict": "dependent"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`context-role`](../context-role/README.md): Use context-role to decide what part a passage plays in answering a specific question.
- [`query-specificity`](../query-specificity/README.md): Use query-specificity to check the other side of retrieval: whether the query is clear enough to match.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `passage`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `standalone` when Jev's yes probability is at least 0.5 and `dependent` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.08 yes probability yields `dependent` with 0.92 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. A sensible default for review is to keep the passage's neighbors attached when indexing or answering.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe judges whether a reader with no other context can follow the passage. It does not check that the passage is accurate, relevant to any query, or chunked at a sensible boundary, and it does not say which references are unresolved or rewrite the passage to fix them. A passage can be `standalone` and still be too short or too long for your index. Repairing dependent chunks, such as prepending a heading or merging with a neighbor, belongs in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo passage-standalone` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe passage-standalone` to inspect the input and result schemas.
