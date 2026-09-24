# Pick the next chord

<!-- BEGIN GENERATED: usage -->

Which candidate chord best continues progression, given any key and style supplied?

Use when: A generation loop has a chord progression so far, application code has enumerated a few chords it could play next, and you want a musical judgment of which continuation a listener in the stated style would expect or enjoy.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { nextChord } from 'jev-recipes/next-chord';

const result = await nextChord({
  progression: 'C - Am - F - G',
  key: 'C major',
  style: 'pop ballad, end of the first verse',
  candidates: [
    { id: 'c', text: 'C (return to the tonic)' },
    { id: 'am', text: 'Am (deceptive move to the submediant)' },
  ],
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo next-chord`.

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
  "selection": "c",
  "suggestedSelection": "c",
  "confidence": 0.88,
  "probabilities": {
    "candidates": {
      "c": 0.88,
      "am": 0.08
    },
    "none": 0.02,
    "ambiguous": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`game-action`](../game-action/README.md): Use game-action when the choice is among generic JSON game actions rather than chords judged for harmonic sense.
- [`choose-action`](../choose-action/README.md): Use choose-action when an explicit goal and rulebook govern the pick instead of harmonic continuity in a key and style.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `progression`   | Yes      | string                                             |
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

The pick is a judgment of harmonic sense from chord symbols and descriptions, not a theory check: whether a candidate belongs to `key`, how its voices move from the previous chord, and whether it creates parallel fifths are exact questions for application code, which should filter the candidates before calling. Style shapes what counts as a good continuation, so the same progression can call for different chords in a jazz standard and a pop ballad; supply `style` when it matters and expect `ambiguous` when candidates fit similarly well. The result names a chord only; its voicing, rhythm, and duration are decided elsewhere.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo next-chord` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe next-chord` to inspect the input and result schemas.
