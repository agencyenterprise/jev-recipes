# Check rule compliance

<!-- BEGIN GENERATED: usage -->

Is the described action permitted by the written rules?

Use when: An agent proposes a move or action in natural language and you want a quick check against the game's written rules before spending engine time or accepting it.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { ruleCompliance } from 'jev-recipes/rule-compliance';

const result = await ruleCompliance({
  action:
    'On my turn I play a Draw Two card on top of a red 7 that is showing on the discard pile. My Draw Two is blue.',
  rules:
    'UNO. On your turn you must play a card that matches the top discard by color, number, or symbol. Draw Two, Reverse, and Skip cards may be played on a top card of the same color or on another card of the same symbol. Wild cards may be played on anything. If you cannot play, draw one card; if it is playable you may play it immediately.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo rule-compliance`.

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
  "probability": 0.05,
  "confidence": 0.95,
  "verdict": "illegal"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`game-action`](../game-action/README.md): Use game-action to have Jev choose among actions your code has already generated as legal.
- [`action-scope`](../action-scope/README.md): Use action-scope to check whether an agent action stays within a granted permission rather than a game rule set.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `action`        | Yes      | string                       |
| `rules`         | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `legal` when Jev's yes probability is at least 0.5 and `illegal` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `illegal` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict reflects only the rules text supplied, so a rule that is omitted or paraphrased loosely cannot be applied. The recipe does not know the full game state beyond what the action describes and cannot enumerate legal moves. Authoritative move validation, state tracking, and enforcement belong in game code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo rule-compliance` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe rule-compliance` to inspect the input and result schemas.
