# Grade buying intent

<!-- BEGIN GENERATED: usage -->

How strong is the purchase intent expressed in message, on a five-level rubric?

Use when: You need to rank or route inbound leads and replies by how close the sender is to buying, not just whether they are interested.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { buyingIntent } from 'jev-recipes/buying-intent';

const result = await buyingIntent({
  message:
    "We've narrowed it down to you and one other vendor. Can you confirm whether the Team plan includes SSO, and what the annual price would be for 40 seats?",
  context: 'Reply from a prospect who attended a product demo last week.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo buying-intent`.

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
  "score": 2.06,
  "level": 2,
  "confidence": 0.84,
  "probabilities": {
    "0": 0.01,
    "1": 0.04,
    "2": 0.84,
    "3": 0.1,
    "4": 0.01
  },
  "intent": "evaluating"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`turn-intent`](../turn-intent/README.md): Use turn-intent to classify the communicative purpose of a message outside a sales context.
- [`commitment-strength`](../commitment-strength/README.md): Use commitment-strength to grade how firmly a message commits to a stated action.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `message`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

`intent` is one of `none`, `curious`, `evaluating`, `ready`, or `committed`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it for ranking leads where a single label loses information.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the intent question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The rubric grades what the message expresses about buying. It does not estimate budget, decision authority, or the likelihood that a deal closes, and a polite or enthusiastic message with no purchase signal still lands at `none` or `curious`. Explicit disinterest and silence on the topic both score at the lowest level. Routing and follow-up cutoffs belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo buying-intent` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe buying-intent` to inspect the input and result schemas.
