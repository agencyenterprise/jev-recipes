# Check move explanation fit

<!-- BEGIN GENERATED: usage -->

Does explanation give a reason for move that is consistent with the described game state?

Use when: An agent or player justifies a move in text and you want to catch explanations that cite pieces, threats, or resources the state does not contain.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { moveExplanationFit } from 'jev-recipes/move-explanation-fit';

const result = await moveExplanationFit({
  move: 'Knight from g1 to f3',
  explanation:
    "Developing the knight to f3 defends the pawn on e4 against the black knight's threat and prepares to castle kingside.",
  state:
    'Chess, White to move. White pieces: king e1, queen d1, rooks a1 and h1, bishops c1 and f1, knights b1 and g1, pawns a2 b2 c2 d2 e2 f2 g2 h2. Black pieces: king e8, queen d8, rooks a8 and h8, bishops c8 and f8, knights b8 and f6, pawns a7 b7 c7 d7 e7 f7 g7 h7. Move 2: Black has just played knight g8 to f6.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo move-explanation-fit`.

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
  "probability": 0.07,
  "confidence": 0.9299999999999999,
  "verdict": "inconsistent"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`game-action`](../game-action/README.md): Use game-action to have Jev choose a move from JSON game state and available actions.
- [`causal-attribution`](../causal-attribution/README.md): Use causal-attribution to judge whether a stated cause is supported by the described outcome outside a game context.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `move`          | Yes      | string                       |
| `explanation`   | Yes      | string                       |
| `state`         | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `consistent` when Jev's yes probability is at least 0.5 and `inconsistent` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `inconsistent` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict says whether the explanation matches the state as written, not whether the move is good, legal, or the best choice. If the supplied state description is itself wrong, the recipe cannot tell. Exact legality, position evaluation, and move generation belong in game code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo move-explanation-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe move-explanation-fit` to inspect the input and result schemas.
