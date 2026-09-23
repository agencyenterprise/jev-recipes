# Choose a checkers move

<!-- BEGIN GENERATED: usage -->

Recommend a supplied legal checkers move from a structured board and player, with built-in American/English checkers instructions.

Use when: Your checkers game already provides its board, acting player, and legal moves, and you want a move ID without writing decision prompts.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { checkersMove } from 'jev-recipes/checkers-move';

const result = await checkersMove({
  board: [
    { square: 'c3', player: 'red' },
    { square: 'b4', player: 'black' },
    { square: 'd4', player: 'black' },
    { square: 'f6', player: 'black', king: true },
  ],
  player: 'red',
  legalMoves: [
    { id: 'capture-left', from: 'c3', path: ['a5'], captures: ['b4'] },
    { id: 'capture-right', from: 'c3', path: ['e5', 'g7'], captures: ['d4', 'f6'] },
  ],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo checkers-move`.

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
  "verdict": "matched",
  "selection": "capture-right",
  "suggestedSelection": "capture-right",
  "confidence": 0.94,
  "probabilities": {
    "candidates": {
      "capture-left": 0.02,
      "capture-right": 0.94
    },
    "none": 0.02,
    "ambiguous": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`choose-action`](../choose-action/README.md): Use choose-action for other games, checkers variants, or custom objectives. It accepts your rules and action descriptions instead of translating a checkers board.
- [`take-turn`](../take-turn/README.md): Use take-turn for narrative turn eligibility. Checkers games should supply the known acting player directly without another model call.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                                              |
| --------------- | -------- | ------------------------------------------------------------------ |
| `board`         | Yes      | { square, player, king }[]; at least 1 items; at most 24 items     |
| `player`        | Yes      | `red`, `black`                                                     |
| `legalMoves`    | Yes      | { id, from, path, captures }[]; at least 1 items; at most 50 items |
| `minConfidence` | No       | number; minimum 0; maximum 1                                       |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Only three fields are required: `board`, `player`, and `legalMoves`. Your game supplies the current position and legal moves; the recipe supplies the checkers decision instructions. No image, free-text rules, action descriptions, or separate turn request is needed.

### Board and player

`board` lists every remaining piece as `{ square, player, king? }`. Unlisted squares are empty. Use `player: 'red'` or `'black'` for piece ownership and for the side whose move you want. `king` defaults to false when omitted. Map your game's colors to these two labels once.

Coordinates are fixed, regardless of whose turn it is or how your interface rotates the board:

```text
         a  b  c  d  e  f  g  h
rank 8   . b8  . d8  . f8  . h8   red promotes here
rank 7  a7  . c7  . e7  . g7  .
rank 6   . b6  . d6  . f6  . h6   black starts on ranks 6-8
rank 5  a5  . c5  . e5  . g5  .
rank 4   . b4  . d4  . f4  . h4
rank 3  a3  . c3  . e3  . g3  .   red starts on ranks 1-3
rank 2   . b2  . d2  . f2  . h2
rank 1  a1  . c1  . e1  . g1  .   black promotes here
```

The dots are unplayable light squares. Red men move toward rank 8; black men move toward rank 1. Kings can move and capture in either direction. This coordinate and color mapping is the recipe's API convention, not official numbered checkers notation.

### Legal moves

Each move is `{ id, from, path, captures? }`:

- `id`: a unique, non-empty ID from your game. The recipe returns it unchanged. `__proto__` is reserved by the result serializer and rejected before inference.
- `from`: the square occupied by the acting player's piece.
- `path`: every landing square in order, excluding `from`. An ordinary move has one landing. A multi-jump is one candidate containing the entire sequence.
- `captures`: the captured pieces' original squares, in jump order. Omit it or use `[]` for an ordinary move. Each capture must have a corresponding landing.

For example, `{ id: 'jump', from: 'c3', path: ['e5', 'g7'], captures: ['d4', 'f6'] }` means jump over d4 to e5, then over f6 to g7. A king's path may return to a previously visited square, including its starting square; the captured squares must be unique.

Supply one to fifty legal moves from the same board snapshot. Handle no-move and finished-game states in your game before calling. When there is only one legal move, your game can use it directly and avoid a model request. A valid recipe call always makes one logical request, even with one candidate. Lists above fifty are rejected, never silently shortened.

The schema checks playable coordinates, unique occupied squares, at most twelve pieces per player, unique IDs, path/capture lengths, starting-piece ownership, and captured-piece references. It rejects unknown fields to catch adapter mistakes. These are input consistency checks, not a legality proof: your game must enforce geometry, empty landing squares, compulsory captures, complete jump chains, promotion, turns, and game completion.

`minConfidence` is optional and defaults to `0.8`. See [shared options](../README.md#shared-options-and-behavior) for client injection, model selection, abort signals, and errors.

## Use the selected move

After the usage example:

```js
if (result.status === 'ready' && result.selection !== null) {
  console.log('Recommended move ID:', result.selection);
} else {
  console.log('Needs another decision:', result.status, result.verdict);
}
```

Use the ID to find the original move in your game's list; the [gameplay guide](../../docs/gameplay.md#a-checkers-decision-in-one-call) shows the complete flow. Before applying that move, check that the game is still on the same turn and board snapshot, and that the move is still legal. Discard stale results. The recipe never changes the board or executes a move. Handle validation and provider errors in your application's error path.

## Result

The result uses the same shape as [choose-action](../choose-action/README.md#result):

| Field                | Meaning                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| `selection`          | Your move ID when matched at sufficient confidence; otherwise `null`.         |
| `suggestedSelection` | Preserves a proposed move below the confidence threshold for inspection.      |
| `verdict`            | `matched`, `none`, or `ambiguous`.                                            |
| `status`             | `ready` or `review`; ambiguous decisions always require review.               |
| `confidence`         | Model confidence in this decision, not a measured probability of winning.     |
| `probabilities`      | Candidate probabilities under your original IDs, plus `none` and `ambiguous`. |
| `model`, `usage`     | Provider model and token usage, preserved from the response.                  |

A ready `none` still has no move. With valid supplied legal moves, the intended behavior is a recommendation or review; `none` is reserved for a supplied position in which no candidate can be used. Do not execute `suggestedSelection` merely because it is present.

## Decision policy

The objective is to win under 8x8 American/English checkers rules. The recipe supplies the orientation, movement, capture, and promotion conventions. Captures are compulsory, but choosing the sequence with the most captures is not compulsory. A man reaching the promotion row ends its turn. These rules follow the [WCDF rules of checkers, section 1](https://wcdf.net/rules/rules_of_checkers_english.pdf); the API uses its own documented color and coordinate mapping.

The instructions ask Jev to compare immediate wins, material, kings, exposure to replies, promotion, and mobility. They do not instruct it to choose the largest capture blindly. An unresolved tie requires review. Ordinary uncertainty about future play alone does not require review.

The board is translated into labeled pieces, such as `c3: your man`, and each move becomes a description. Piece counts and promotion labels are prepared in code. This follows TypeSafe's guidance to [perform counting in code and give Jev semantic descriptions](https://docs.typesafe.ai/model-jaggedness/jev-1.13). It is a design choice, not evidence of playing strength.

## Reuse and limits

- Uses the shared selection helper directly for candidate mapping and review handling. It does not call `choose-action` or `take-turn` and adds no runtime dependencies.
- Supports this one variant and objective. For international draughts, flying kings, backward captures by men, or custom play styles, use `choose-action` with the appropriate rules and descriptions.
- Does not generate moves, simulate future positions, solve the game, read images, or track repetition and draw history. Your game owns those responsibilities.
- One logical request avoids a chain of recipe calls; SDK retries and network/service time can still affect latency. Live speed and playing strength have not been measured.
- Tests and demos use saved responses. A future A/B evaluation should compare this recipe with `choose-action` on the same positions, recording latency, review rate, and move quality against an independent reference.
