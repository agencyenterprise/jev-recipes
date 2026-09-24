# Pick the next melody note

<!-- BEGIN GENERATED: usage -->

Which candidate note best continues the melody in recentNotes, given any key and style supplied?

Use when: A generation loop such as an infinite piano player has produced the last few notes, application code has enumerated a handful of legal next notes, and you want a musical judgment of which one continues the line best, or whether a rest is better.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { nextNote } from 'jev-recipes/next-note';

const result = await nextNote({
  recentNotes: 'C4 E4 G4 E4 D4',
  key: 'C major',
  style: 'gentle lullaby',
  candidates: [
    { id: 'c5', text: 'C5 (octave leap up to the tonic)' },
    { id: 'b3', text: 'B3 (leading tone just below)' },
  ],
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo next-note`.

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
  "selection": "b3",
  "suggestedSelection": "b3",
  "confidence": 0.9,
  "probabilities": {
    "candidates": {
      "c5": 0.05,
      "b3": 0.9
    },
    "none": 0.03,
    "ambiguous": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`game-action`](../game-action/README.md): Use game-action when the choice is among generic JSON game actions rather than notes judged for melodic sense.
- [`choose-action`](../choose-action/README.md): Use choose-action when an explicit goal and rulebook govern the pick instead of melodic continuity in a key and style.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `recentNotes`   | Yes      | string                                             |
| `candidates`    | Yes      | { id, text }[]; at least 1 items; at most 50 items |
| `key`           | No       | string                                             |
| `style`         | No       | string                                             |
| `minConfidence` | No       | number; minimum 0; maximum 1                       |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `key` and `style` are optional and are omitted from the request when absent.

## Result

`selection` is the id of the chosen `candidates` entry when the result is `ready` and a candidate matched. `verdict` is `matched`, `none` when no candidate fits, or `ambiguous` when several fit equally or the facts cannot separate them. `suggestedSelection` keeps a low-confidence pick for inspection while `selection` stays null.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `ambiguous`. `probabilities.candidates` is keyed by your candidate ids, with `none` and `ambiguous` reported alongside.

## Reuse and calls

Uses the shared candidate-selection helper, which presents your candidates as choices alongside none and ambiguous and maps the answer back to your ids. This folder owns the question wording and the review policy. A live invocation makes one logical Jev request.

## Limits

The pick is a judgment of melodic sense from the note names and descriptions supplied, not a theory check: whether a candidate belongs to `key`, how large its interval from the last note is, and whether it breaks a voice-leading rule are exact questions that belong in application code, which should filter the candidates before calling. Style preference is a matter of taste, so candidates that fit similarly well can be ranked differently on different runs, and `ambiguous` is the honest answer when that happens. The result names a pitch only; duration, dynamics, and any harmony under the note are decided elsewhere.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo next-note` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe next-note` to inspect the input and result schemas.
