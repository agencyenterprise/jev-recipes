# Classify a listener's request

<!-- BEGIN GENERATED: usage -->

What does a listener's message ask of the performance?

Use when: Chat messages steer a live or generated musical performance and you need to know which control each message reaches for before deciding what to change.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { listenerRequestKind } from 'jev-recipes/listener-request-kind';

const result = await listenerRequestKind({
  message: 'can you slow it down a bit? feels kinda frantic rn',
  context:
    'Live piano stream. The current passage is a fast run of sixteenth notes in C minor at roughly 150 bpm.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo listener-request-kind`.

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
  "verdict": "tempo",
  "confidence": 0.9,
  "probabilities": {
    "mood": 0.03,
    "tempo": 0.9,
    "style": 0.02,
    "specific_piece": 0.01,
    "dynamics": 0.02,
    "stop": 0.01,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`turn-intent`](../turn-intent/README.md): Use turn-intent for the general communicative purpose of a message rather than which aspect of a performance it asks to change.
- [`route`](../route/README.md): Use route when the destinations are caller-defined handlers rather than this fixed set of performance controls.

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

`verdict` is one of `mood`, `tempo`, `style`, `specific_piece`, `dynamics`, `stop`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The label describes which control the message reaches for, not whether the performer should act on it or whether the request makes musical sense. A single message that asks for several changes is classified by the one it presses hardest, so application code should split or queue multi-part requests when each matters. Greetings, reactions, and questions land on `unclear` by design; treat that label as no steering signal rather than as a failure to classify.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo listener-request-kind` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe listener-request-kind` to inspect the input and result schemas.
