# Classify game phase

<!-- BEGIN GENERATED: usage -->

Which phase of the game does state describe: opening, midgame, endgame, or game over?

Use when: An agent adapts its strategy, prompts, or time budget by game phase and you have a textual state description rather than a structured engine.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { gamePhase } from 'jev-recipes/game-phase';

const result = await gamePhase({
  state:
    'Chess. White: king g1, rook d1, pawns a2, f2, g2. Black: king g8, rook e8, pawns a7, h6. Move 52, White to move. No queens or minor pieces remain. Neither side is in check.',
  rules:
    'Standard chess. The game ends by checkmate, stalemate, agreed draw, resignation, or the fifty-move and threefold repetition rules.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo game-phase`.

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
  "verdict": "endgame",
  "confidence": 0.85,
  "probabilities": {
    "opening": 0.01,
    "midgame": 0.09,
    "endgame": 0.85,
    "terminal": 0.02,
    "unclear": 0.03
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`game-action`](../game-action/README.md): Use game-action to choose a move from JSON game state and available actions.
- [`step-progress`](../step-progress/README.md): Use step-progress to judge how far a non-game task has advanced.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `state`         | Yes      | string                       |
| `rules`         | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `rules` is optional and is omitted from the request when absent.

## Result

`verdict` is one of `opening`, `midgame`, `endgame`, `terminal`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The verdict is read from the state description and any rules text supplied; the recipe does not simulate moves or evaluate positions. It cannot confirm a checkmate, elimination, or final score that the description does not state, so compute terminal conditions in game code. Phase boundaries vary by game and by convention, and the probabilities show when two phases are both plausible.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo game-phase` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe game-phase` to inspect the input and result schemas.
