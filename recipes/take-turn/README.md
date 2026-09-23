# Assess whether a player can act now

<!-- BEGIN GENERATED: usage -->

Interpret game rules and current state to label a player's turn or reaction opportunity as act, wait, inactive, or unclear.

Use when: You need to decide whether it is a player's turn to act or react using narrative game rules, state, and previous actions.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { takeTurn } from 'jev-recipes/take-turn';

const result = await takeTurn({
  player: 'Blue',
  rules:
    'A challenge pauses the normal turn. The challenged player must defend or concede before the normal turn resumes.',
  environment:
    "Red's normal turn is paused while Blue answers a challenge. The challenge is unresolved.",
  history: [
    {
      player: 'Red',
      action: "Challenged Blue; the challenge is awaiting Blue's response.",
    },
  ],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo take-turn`.

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
  "verdict": "act",
  "confidence": 0.94,
  "probabilities": {
    "act": 0.94,
    "wait": 0.02,
    "inactive": 0.02,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`choose-action`](../choose-action/README.md): Use choose-action to compare candidate moves after establishing the player can act.
- [`step-complete`](../step-complete/README.md): Use step-complete to check whether a defined turn-completion condition was met; take-turn assesses the current opportunity to act.
- [`response-needed`](../response-needed/README.md): Use response-needed for conversational follow-through, rather than turn and reaction eligibility under game rules.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                   |
| --------------- | -------- | --------------------------------------- |
| `player`        | Yes      | string                                  |
| `rules`         | Yes      | string                                  |
| `environment`   | Yes      | string                                  |
| `history`       | No       | { player, action }[]; at most 100 items |
| `minConfidence` | No       | number; minimum 0; maximum 1            |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Supply non-empty text describing the player, applicable rules, and current environment. Include phase, unresolved reactions, elimination, and game completion when relevant. This recipe is useful when that information needs interpretation from narrative text; use ordinary code when an authoritative engine already provides turn eligibility.

Optional `history` contains at most 100 `{ player, action }` entries, oldest first. Both fields must contain non-empty text. Repeated actions and an empty list are allowed. History may be incomplete; missing history does not imply the game just started. `environment` describes the current snapshot after these events.

`minConfidence` defaults to `0.8` and accepts values from `0` to `1`. See [shared options and behavior](../README.md#shared-options-and-behavior) for configuration and errors.

## Result

| Verdict    | Meaning                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------- |
| `act`      | The player has a current normal turn, response, reaction, or simultaneous-action opportunity. |
| `wait`     | The player cannot act now, but their participation is not established to be over.             |
| `inactive` | The game is over or this player has no remaining participation or reaction right.             |
| `unclear`  | Missing or conflicting facts prevent determining current eligibility.                         |

`status` is `ready` when confidence meets the threshold and the verdict is not `unclear`; otherwise it is `review`. An unclear verdict always requires review, even with a zero threshold. `ready` can accompany `wait` or `inactive`: it describes confidence in the assessment, not permission to move. Even `act` does not choose a move or say whether an optional reaction is worth using. Model, token usage, confidence, and per-verdict probabilities are preserved.

## Decision boundaries

These are intended policy examples, not measured gameplay results.

| Situation                                                                    | Intended verdict                                               |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------- |
| It is Blue's normal turn and the rules permit Blue to choose an action.      | `act` for Blue.                                                |
| It is Red's normal turn, paused until Blue answers a challenge.              | `act` for Blue and `wait` for Red.                             |
| The rules explicitly give Blue an optional reaction right now.               | `act`, regardless of whether reacting is strategically useful. |
| All active players must submit simultaneous choices; Blue has not submitted. | `act` for Blue.                                                |
| Blue has already submitted and must wait for others.                         | `wait`.                                                        |
| Blue's turn is skipped this round but Blue stays in the game.                | `wait`.                                                        |
| Blue is eliminated with no remaining participation or reaction rights.       | `inactive`.                                                    |
| The game has ended.                                                          | `inactive`.                                                    |
| History says Blue acted, but a current rule grants Blue another turn.        | `act` if the current state establishes that extra turn.        |
| The active player or pending reaction cannot be resolved.                    | `unclear`.                                                     |

## Reuse

Use [choose-action](../choose-action/README.md#check-turn-eligibility) to recommend a move after checking eligibility; its guide shows how to combine the calls. Use [step-complete](../step-complete/README.md) to inspect evidence that a turn has already been completed.

Uses the shared choice helper and makes one logical Jev request. It does not invoke another recipe or perform game actions.

## Limits

- An exact game engine should own turn eligibility whenever it can compute it. This recipe interprets supplied text and can be wrong.
- It does not execute or complete the turn, choose a move, or advance state.
- Game state can change while the request is running. Check the current state before acting on a result.
