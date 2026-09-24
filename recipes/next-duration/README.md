# Pick the next rhythmic value

<!-- BEGIN GENERATED: usage -->

Which candidate rhythmic value best continues recentRhythm within meter, given any style supplied?

Use when: A generation loop has chosen the next pitch and must decide how long to hold it, application code has enumerated a few legal durations, and you want a musical judgment of which one continues the rhythmic feel.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { nextDuration } from 'jev-recipes/next-duration';

const result = await nextDuration({
  meter: '3/4',
  recentRhythm: 'quarter quarter quarter | quarter quarter',
  style: 'steady waltz accompaniment',
  candidates: [
    { id: 'quarter', text: 'quarter note (keeps the one-two-three)' },
    { id: 'half', text: 'half note (held across the bar line)' },
  ],
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo next-duration`.

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
  "selection": "quarter",
  "suggestedSelection": "quarter",
  "confidence": 0.9,
  "probabilities": {
    "candidates": {
      "quarter": 0.9,
      "half": 0.05
    },
    "none": 0.03,
    "ambiguous": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`game-action`](../game-action/README.md): Use game-action when the choice is among generic JSON game actions rather than durations judged for rhythmic sense.
- [`take-turn`](../take-turn/README.md): Use take-turn to decide whether a player may act at all under game rules, rather than how long the next musical event should last.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `meter`         | Yes      | string                                             |
| `recentRhythm`  | Yes      | string                                             |
| `candidates`    | Yes      | { id, text }[]; at least 1 items; at most 50 items |
| `style`         | No       | string                                             |
| `minConfidence` | No       | number; minimum 0; maximum 1                       |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `style` is optional and is omitted from the request when absent.

## Result

`selection` is the id of the chosen `candidates` entry when the result is `ready` and a candidate matched. `verdict` is `matched`, `none` when no candidate fits, or `ambiguous` when several fit equally or the facts cannot separate them. `suggestedSelection` keeps a low-confidence pick for inspection while `selection` stays null.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `ambiguous`. `probabilities.candidates` is keyed by your candidate ids, with `none` and `ambiguous` reported alongside.

## Reuse and calls

Uses the shared candidate-selection helper, which presents your candidates as choices alongside none and ambiguous and maps the answer back to your ids. This folder owns the question wording and the review policy. A live invocation makes one logical Jev request.

## Limits

The pick is a judgment of rhythmic feel from written durations, not beat arithmetic: how many beats remain in the bar under `meter`, whether a candidate overflows it, and whether a tie is needed are exact questions for application code, which should filter the candidates before calling. Groove is a style judgment, so a pattern that wants a steady quarter in a waltz may want a syncopation in a swing tune; supply `style` when it matters and expect `ambiguous` when candidates fit similarly well. The result names a duration only; pitch, articulation, and dynamics are decided elsewhere.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo next-duration` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe next-duration` to inspect the input and result schemas.
