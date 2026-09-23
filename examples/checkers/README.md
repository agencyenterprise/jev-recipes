# `jev-recipes` in action: choose a checkers move

Give a recipe the current state and the available moves. Get a decision back.

This example uses [`checkersMove`](../../recipes/checkers-move/README.md) to choose moves for both sides of a checkers game. Press **Play** to watch those decisions happen. The Jev connection lives in one small file: **[ai.mjs](ai.mjs)**.

## The recipe call

With `TYPESAFE_API_KEY` set in your server environment, the minimal integration is:

```js
import { checkersMove } from 'jev-recipes/checkers-move';

// Your application supplies these three values.
const result = await checkersMove({ board, player, legalMoves });

if (result.status === 'ready' && result.selection !== null) {
  console.log('Recommended move ID:', result.selection);
} else {
  console.log('Needs another decision:', result.verdict);
}
```

| You provide  | What it contains                                                    |
| ------------ | ------------------------------------------------------------------- |
| `board`      | Every remaining piece: its square, owner, and whether it is a king. |
| `player`     | The side making the decision: `red` or `black`.                     |
| `legalMoves` | The available moves, each with your own ID and its complete path.   |

The recipe checks the input structure, translates the position into Jev instructions, and returns your selected move ID. It also returns confidence, candidate probabilities, and review information. You do not need to write the decision prompt or parse a free-text answer.

Your application supplies legal moves and applies the selected move. The recipe does not update the board. See the [recipe reference](../../recipes/checkers-move/README.md) for concrete input and output examples.

## Try it locally

From the repository root, using Node.js 22.9 or newer:

```sh
npm ci --ignore-scripts
cp examples/checkers/.env.example examples/checkers/.env
```

Add your `TYPESAFE_API_KEY` to `examples/checkers/.env`, then run:

```sh
make -C examples/checkers
```

Open [the local demo](http://127.0.0.1:8787/) and press **Play**. Each move calls the recipe once, including forced moves. Your API key stays on the local server. Close the tab to cancel; use Ctrl+C to stop the server.

Without Make, run `npm run build` from the repository root, then `cd examples/checkers` and `node --env-file-if-exists=.env server.mjs`.

## Reuse the integration

Start with [ai.mjs](ai.mjs). Its `chooseMove` function accepts the board, player, legal moves, and a cancellation signal. It configures the Jev client and calls the recipe. Both AI players use this same function.

The remaining files support the demonstration:

| File                                                               | Responsibility                                                        |
| ------------------------------------------------------------------ | --------------------------------------------------------------------- |
| [server.mjs](server.mjs)                                           | Requests decisions, applies the autoplay policy, and streams updates. |
| [game.mjs](game.mjs)                                               | Generates legal moves and updates pieces.                             |
| [match.mjs](match.mjs)                                             | Tracks turns, wins, draws, and the move limit.                        |
| [index.html](index.html), [style.css](style.css), [app.js](app.js) | Display the decisions as an animated board.                           |

The demo uses `minConfidence: 0` to accept any matched recommendation. When no move is selected, autoplay picks the legal move with the highest candidate probability; equal probabilities use list order. The page labels this **automatic tiebreak**. Your application can choose its own review policy; the recipe's default confidence threshold is `0.8`.

Games end on a win, a draw, or the demo's 300-move limit. Provider errors stop playback. The displayed decision time measures each recipe call; this example does not measure playing strength.

## Tests and packaging

Run `make -C examples/checkers test` for offline tests with fixture responses. Tests make no live Jev calls.

Everything in this folder, including tests, is excluded from the npm package. The example adds no runtime dependencies to `jev-recipes`.
