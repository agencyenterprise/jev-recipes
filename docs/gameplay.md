# Gameplay decisions

Give the recipe a game situation and available moves; read back a recommended move ID. Your game owns state, legal moves, turns, and execution.

| Recipe                                                | Give it                                                                | Read back                                                        |
| ----------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`checkers-move`](../recipes/checkers-move/README.md) | Checkers board, acting player, and complete legal moves.               | A selected move ID or a review outcome.                          |
| [`take-turn`](../recipes/take-turn/README.md)         | Player, rules, current environment, optional action history.           | `act`, `wait`, `inactive`, or `unclear`, plus review status.     |
| [`choose-action`](../recipes/choose-action/README.md) | The same context, an objective, and actions with IDs and descriptions. | A selected action ID, no fitting action, or an ambiguous choice. |

`take-turn` means assessing the current opportunity to act. It does not execute a turn or check whether a turn was already completed. For that retrospective question, use [`step-complete`](../recipes/step-complete/README.md) with an explicit completion condition and recorded evidence.

If your engine can compute whose turn it is or which moves are legal, use those answers directly. The turn recipe is for narrative rules, reaction windows, and game states that need text interpretation. You can call `choose-action` by itself after the engine establishes eligibility.

## A checkers decision in one call

For 8x8 American/English checkers, supply just the board, player, and legal moves. The recipe provides the decision instructions and describes the position for Jev. Use this in your app with `TYPESAFE_API_KEY` set; see the [quickstart](../README.md#use-a-recipe) for setup.

```js
import { checkersMove } from 'jev-recipes/checkers-move';

const legalMoves = [
  { id: 'capture-left', from: 'c3', path: ['a5'], captures: ['b4'] },
  { id: 'capture-right', from: 'c3', path: ['e5', 'g7'], captures: ['d4', 'f6'] },
];

const result = await checkersMove({
  board: [
    { square: 'c3', player: 'red' },
    { square: 'b4', player: 'black' },
    { square: 'd4', player: 'black' },
    { square: 'f6', player: 'black', king: true },
  ],
  player: 'red',
  legalMoves,
});

if (result.status === 'ready' && result.selection !== null) {
  const move = legalMoves.find((candidate) => candidate.id === result.selection);
  console.log('Recommended move:', move);
} else {
  console.log('No committed move:', result.status, result.verdict);
}
```

Squares use a fixed orientation: `a1` is bottom left, red men move toward rank 8, and black men move toward rank 1. List every remaining piece; omitted squares are empty. Each move's `path` includes all landing squares, with corresponding `captures` in order. See the [board diagram and complete format](../recipes/checkers-move/README.md#board-and-player) when adapting your game's state.

The saved fixture selects `capture-right`; this illustrates the result, not measured model performance. The recipe checks the input format and references, counts pieces in code, and makes one logical Jev request. It does not search future positions or generate legal moves. Skip the call when the game has ended or no move is available; with only one legal move, the game can use that move directly.

Before executing a recommendation, verify that the board and turn are unchanged and the move remains legal. Use the shared `signal` option to cancel obsolete requests. Live latency and playing strength have not been measured; one logical request can still involve SDK retries. For other checkers variants or custom objectives, use `choose-action`.

## A challenge interrupts a normal turn

Red is taking a normal turn, but a challenge gives Blue a response window. Blue can spend a shield or lose points. Supply that context, then compare moves against Blue's objective.

Use the following in your JavaScript or TypeScript app with `TYPESAFE_API_KEY` set. See the [quickstart](../README.md#use-a-recipe) for standalone setup. The example recommends a move; your game validates and applies it.

```js
import { takeTurn } from 'jev-recipes/take-turn';
import { chooseAction } from 'jev-recipes/choose-action';

const game = {
  player: 'Blue',
  rules:
    'A challenge pauses the normal turn. The challenged player must defend by spending one shield or concede and lose two points. Defending prevents the point loss.',
  environment:
    "Red's normal turn is paused while Blue answers a challenge. Blue has one shield and five points. This is the final round.",
  history: [
    { player: 'Red', action: "Challenged Blue; the challenge is awaiting Blue's response." },
  ],
};

const turn = await takeTurn(game);

if (turn.status === 'ready' && turn.verdict === 'act') {
  const move = await chooseAction({
    ...game,
    objective:
      'Finish the final round with as many points as possible. Unused shields have no score.',
    actions: [
      { id: 'defend', text: 'Spend one shield to defend against the current challenge.' },
      { id: 'concede', text: 'Accept the current challenge and lose two points.' },
    ],
  });

  if (move.status === 'ready' && move.selection !== null) {
    console.log('Recommended action:', move.selection);
  } else {
    console.log('No committed action:', move.status, move.verdict);
  }
} else {
  console.log('No move requested:', turn.status, turn.verdict);
}
```

A saved demo response recommends `defend`. A live recommendation can differ. The two recipes each make one logical request when called; the example skips action selection when the turn assessment is not ready to act. Handle thrown validation or provider errors in your application's error path.

## Describe the game, then own the result

- **Rules:** include applicable turn, reaction, resource, and scoring constraints. Player dialogue in the history does not become a new rule.
- **Environment:** describe the current snapshot after the listed actions, including decision-critical facts. Supply only information the player is allowed to know.
- **History:** optionally pass up to 100 `{ player, action }` entries, oldest first, from any players. Include observed outcomes where useful. Summarize older relevant events into the current environment.
- **Actions:** pass one to fifty `{ id, text }` candidates with unique IDs. Describe concrete moves, including targets and costs. Include pass or wait explicitly if they are available choices. If the engine provides no actions, handle that state directly instead of making a selection call.
- **Objective:** say what “best” means for this player, such as retaining points, cooperating, surviving, or following a play style. A reward objective and a rule constraint play different roles.

`ready` means the annotation or recommendation met the confidence policy. It can accompany `wait`, `inactive`, or no selected action. A low-confidence selection keeps `suggestedSelection` for inspection but leaves `selection` null. Your game should recheck the chosen ID against current legal moves before applying it, since state can change during a request.

## Try the saved decisions

These recipes are part of the current source batch. From this checkout:

```sh
make build
node dist/cli/index.js demo take-turn
node dist/cli/index.js demo choose-action
node dist/cli/index.js demo checkers-move
```

After installing a release that includes the selected recipe, run `npx jev-recipes demo <recipe-id>`, for example `npx jev-recipes demo checkers-move`. Demos use saved fixtures and make no model calls. Tests check schemas, board translation, result mapping, history preservation, confidence boundaries, and packaging. They do not measure playing strength, optimality, or the accuracy of rule interpretation.
