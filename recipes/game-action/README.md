# Choose a game action from JSON

<!-- BEGIN GENERATED: usage -->

Send game state, player state, and available actions as JSON; receive the original selected action with Jev confidence and probabilities.

Use when: Your game already supplies JSON state and actions, and you want Jev to choose an action without formatting descriptions or assigning IDs.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { gameAction } from 'jev-recipes/game-action';

const result = await gameAction({
  gameState: { actionsRemaining: 1, opponentScore: 9 },
  playerState: { id: 'blue', score: 8, energy: 1 },
  legalActions: [
    { id: 'collect-points', command: 'collect', energyCost: 1, points: 2 },
    { command: 'rest', energyGain: 1, points: 0 },
  ],
  rules: 'The game ends after this action. Highest score wins; unused energy has no value.',
  objective: 'Finish with more points than the opponent.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo game-action`.

<details>
<summary>Illustrative result from the offline fixture</summary>

```json
{
  "model": "demo-fixture",
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0
  },
  "selection": "action_0",
  "action": {
    "id": "collect-points",
    "command": "collect",
    "energyCost": 1,
    "points": 2
  },
  "confidence": 0.9,
  "probabilities": {
    "action_0": 0.95,
    "action_1": 0.05
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`choose-action`](../choose-action/README.md): Use choose-action for text-based rules and state, caller-named actions, and confidence-based review handling.
- [`checkers-move`](../checkers-move/README.md): Use checkers-move for its American/English checkers board format and built-in checkers instructions.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field          | Required | Shape   |
| -------------- | -------- | ------- |
| `gameState`    | Yes      | value   |
| `playerState`  | Yes      | value   |
| `legalActions` | Yes      | value[] |
| `rules`        | No       | value   |
| `objective`    | No       | value   |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

Supply your game's existing JSON. Each of `gameState`, `playerState`, `rules`, and `objective` accepts an object, array, string, number, boolean, or `null`. Each entry in `legalActions` also accepts any JSON value. Rules and objectives are optional when the state already describes them.

For example, actions can be strings such as `"move north"`, or objects such as `{ unit: "archer-7", command: "attack", target: "orc-3" }`. Their structure belongs to your game. Existing IDs are preserved, and actions without IDs work directly. Repeated actions or existing IDs are also accepted because each array entry receives a separate internal label.

An empty action list returns `null` without an API call. The recipe sends every supplied action in one logical request, without an action-count cap or truncation. Provider request limits still apply.

See [shared options](../README.md#shared-options-and-behavior) for the optional client, model, and abort signal. Inputs and public types come from this folder's Zod schemas.

## Use the selected action

After the usage example above:

```js
if (result !== null) {
  await game.applyAction(result.action);
}
```

Here, `game.applyAction` is your game's existing action execution function. Call the recipe again with refreshed information as play continues through turns and the game.

## Result

| Field           | Meaning                                                          |
| --------------- | ---------------------------------------------------------------- |
| `selection`     | The selected internal label, such as `action_0`.                 |
| `action`        | The original selected JSON data, including any existing game ID. |
| `confidence`    | Jev's returned confidence, passed through without a threshold.   |
| `probabilities` | Jev's probabilities keyed by internal action label.              |
| `model`         | The model reported by Jev.                                       |
| `usage`         | Reported input and output token counts.                          |

Use `result.action` directly; no ID lookup is needed. Internal labels follow the supplied array order and belong to that call. The recipe leaves the input unchanged. A selected action can itself be `null`, which is different from the entire result being `null` for an empty action list.

The response preserves Jev's selection, including low-confidence choices and ties. There are no extra `none` or `ambiguous` options. Invalid inputs and malformed responses throw validation errors; provider errors propagate to the caller.

## Jev request

The schema's input descriptions accompany this question:

> Which available action should this player take next, given the supplied game state, player state, rules, and objective?

Each action is serialized as JSON under its internal Choice label. This also represents primitive actions such as numbers, booleans, and `null` explicitly. State is forwarded as structured JSON, with omitted optional fields left out. A non-empty invocation makes one logical Jev request; SDK retries may add transport attempts.

The offline fixture demonstrates the request and result format. It does not measure live decision quality or latency.
