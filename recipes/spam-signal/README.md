# Detect spam content

<!-- BEGIN GENERATED: usage -->

Is message unsolicited promotional, scam, or bulk content rather than a genuine contribution?

Use when: You need a yes/no gate before publishing, forwarding, or replying to community posts, comments, or inbound messages.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { spamSignal } from 'jev-recipes/spam-signal';

const result = await spamSignal({
  message:
    'Congratulations!! You have been selected for a $500 gift card. Claim now at bit.ly/claim-prize-4421 before it expires tonight!!!',
  context: 'Reply posted in a community forum thread about troubleshooting a printer driver.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo spam-signal`.

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
  "probability": 0.97,
  "confidence": 0.97,
  "verdict": "spam"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`turn-intent`](../turn-intent/README.md): Use turn-intent to classify what a genuine message is trying to do.
- [`response-needed`](../response-needed/README.md): Use response-needed to decide whether a genuine message calls for a reply.

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

`verdict` is `spam` when Jev's yes probability is at least 0.5 and `genuine` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `genuine` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default, such as holding the message for a moderator.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe judges the wording of one message. It does not know the sender's history, how many times similar text was posted, or what a shortened link resolves to, so pair it with rate limits and link checks. Supply `context` to describe the venue and its rules; an on-topic product recommendation in a thread asking for suggestions is `genuine`, while the same text dropped into an unrelated thread leans `spam`. Removal, hiding, and appeal decisions belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo spam-signal` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe spam-signal` to inspect the input and result schemas.
