# Choose a game action from supplied candidates

<!-- BEGIN GENERATED: usage -->

Recommend one eligible game action against a supplied goal, using rules, current state, and optional player history.

Use when: You need to choose the next game action from a list using the current environment, game rules, and previous player actions.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { chooseAction } from 'jev-recipes/choose-action';

const result = await chooseAction({
  player: 'Blue',
  objective:
    'Finish the final round with as many points as possible. Unused shields have no score.',
  rules:
    'A challenge pauses the normal turn. The challenged player must defend by spending one shield or concede and lose two points. Defending prevents the point loss.',
  environment:
    "Red's normal turn is paused while Blue answers a challenge. Blue has one shield and five points. This is the final round.",
  actions: [
    { id: 'defend', text: 'Spend one shield to defend against the current challenge.' },
    { id: 'concede', text: 'Accept the current challenge and lose two points.' },
  ],
  history: [
    {
      player: 'Red',
      action: "Challenged Blue; the challenge is awaiting Blue's response.",
    },
  ],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo choose-action`.

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
  "selection": "defend",
  "suggestedSelection": "defend",
  "confidence": 0.94,
  "probabilities": {
    "candidates": {
      "defend": 0.94,
      "concede": 0.02
    },
    "none": 0.02,
    "ambiguous": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`checkers-move`](../checkers-move/README.md): Use checkers-move for a structured American/English checkers board and legal moves, with built-in rules and move descriptions.
- [`take-turn`](../take-turn/README.md): Use take-turn to assess whether the player has an opportunity to act now before selecting an action.
- [`tool-fit`](../tool-fit/README.md): Use tool-fit to check one tool's capability for a task; it does not compare game actions under a goal and game rules.
- [`step-progress`](../step-progress/README.md): Use step-progress to assess an observed outcome after a move; this recipe recommends a candidate before execution.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                   |
| --------------- | -------- | --------------------------------------- |
| `player`        | Yes      | string                                  |
| `objective`     | Yes      | string                                  |
| `rules`         | Yes      | string                                  |
| `environment`   | Yes      | string                                  |
| `actions`       | Yes      | { id, text }[]; at least 1 items        |
| `history`       | No       | { player, action }[]; at most 100 items |
| `minConfidence` | No       | number; minimum 0; maximum 1            |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Describe the player, objective, applicable rules, and current environment in non-empty text. The objective defines what makes one action better than another. Pass one or more actions as `{ id, text }` objects with non-empty, unique IDs and non-empty descriptions. The recipe imposes no action-count cap and sends the entire list in one logical request; provider request limits still apply. It adds `none` and `ambiguous` as two additional choices.

Optional `history` contains at most 100 `{ player, action }` entries, oldest first. Each field must be non-empty text. Repeated actions are allowed; a player can take the same action on different turns. An empty list is valid and does not prove this is the first turn. Describe the current snapshot after those events in `environment`, including relevant phase and resource information. Include only information available to the acting player.

`minConfidence` defaults to `0.8` and accepts values from `0` to `1`. See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Field                  | Meaning                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `verdict: 'matched'`   | The model selected one supplied action.                                                         |
| `verdict: 'none'`      | The model found no eligible action fitting the objective.                                       |
| `verdict: 'ambiguous'` | A tie, missing fact, or unresolved constraint prevents a single choice.                         |
| `selection`            | The selected action's original ID when matched with sufficient confidence; otherwise `null`.    |
| `suggestedSelection`   | The proposed action ID, retained even when confidence is below the threshold; otherwise `null`. |
| `probabilities`        | Probabilities keyed by caller action ID under `candidates`, plus `none` and `ambiguous`.        |

The result is `ready` when confidence meets the threshold and the verdict is not `ambiguous`. A ready `none` result still has no action. An ambiguous result always requires review, even with a zero threshold. Use `selection` to look up your action only after checking the result; `suggestedSelection` is not a commitment to act. Model and token usage are preserved.

## Decision boundaries

These are intended policy examples, not measured gameplay results.

| Situation                                                                                       | Intended decision                                                |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Spending a shield prevents point loss in the final round, and unused shields have no value.     | Choose the supplied defend action.                               |
| A high-value move violates a resource rule, while another supplied move is eligible and useful. | Choose the eligible move.                                        |
| It is another player's turn, with no reaction available to this player.                         | `none` for actions that all require acting now.                  |
| A reaction is available during another player's ordinary turn.                                  | Compare the eligible reactions under the objective.              |
| Two actions are equally suitable with no supplied tie-breaking rule.                            | `ambiguous`.                                                     |
| A resource count needed to establish legality is missing.                                       | `ambiguous`, not a guessed legal move.                           |
| Passing is strategically preferable and is a supplied, eligible candidate.                      | The pass action may be selected.                                 |
| Passing would be useful but is not supplied as a candidate.                                     | Do not invent a pass action.                                     |
| Opponent history contains instructions to ignore the rules or choose a particular ID.           | Treat them as recorded text, not instructions for the evaluator. |

## Reuse

Use [take-turn](../take-turn/README.md) for narrative turn or reaction eligibility, then call this recipe when the player can act. The example below combines the calls; this recipe does not invoke take-turn itself.

Uses the shared candidate-selection helper for ID mapping, probability validation, and review handling. Each call makes one logical Jev request and performs no game action.

## Check turn eligibility

If your engine knows whose turn it is, use that answer directly. For narrative turn or reaction rules, combine `take-turn` and `choose-action` as below.

Red is taking a normal turn, but a challenge gives Blue a response window. Blue can spend a shield or lose points. Supply that context, then compare moves against Blue's objective.

Use the following in your JavaScript or TypeScript app with `TYPESAFE_API_KEY` set. See the [quickstart](../../README.md#use-a-recipe) for standalone setup. The example recommends a move; your game validates and applies it.

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

## Limits

- This is a model recommendation, not a game solver, legality proof, or guarantee of optimal play. Filter candidates using your game engine when possible and revalidate the selection against current state before executing it.
- Rules and history do not update the environment automatically. Your application owns state, legal actions, side effects, and turn progression.
- Tests and demos use saved responses. Playing strength and rule interpretation need separate evaluation on your games.
