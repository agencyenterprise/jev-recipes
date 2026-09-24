# Choose an action for every finger

<!-- BEGIN GENERATED: usage -->

On beat, which listed option should each finger in fingers take, given music and style, or rest?

Use when: A playing loop advances one subdivision at a time and wants every finger to pick from its own reachable options in a single call.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { fingerActions } from 'jev-recipes/finger-actions';

const result = await fingerActions({
  music:
    'Key C major, 72 bpm, gentle ballad. Last bar: right hand melody E4 D4 C4 (quarter, quarter, half) over a C major chord held in the left hand. The phrase just ended on the tonic.',
  beat: 'Bar 5, eighth 1, start of a new phrase',
  fingers: [
    {
      id: 'rh-thumb',
      text: 'Right thumb, resting on C4, free to move',
      options: [
        { id: 'c4', text: 'Press C4 to restate the tonic' },
        { id: 'hold', text: 'Keep C4 sounding from the previous bar' },
      ],
    },
    {
      id: 'rh-index',
      text: 'Right index, hovering over D4 and E4',
      options: [
        { id: 'e4', text: 'Press E4 to start the melody a third above' },
        { id: 'd4', text: 'Press D4 to start stepwise' },
      ],
    },
    {
      id: 'lh-pinky',
      text: 'Left pinky, on C3 which is currently sounding',
      options: [
        { id: 'c3', text: 'Re-strike C3 for a fresh bass note' },
        { id: 'g2', text: 'Move down to G2 for a dominant pedal' },
      ],
    },
  ],
  style: 'Keep the texture sparse; melody on top, single bass notes below.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo finger-actions`.

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
  "assignments": [
    {
      "id": "rh-thumb",
      "status": "ready",
      "verdict": "rest",
      "action": null,
      "suggestedAction": null,
      "confidence": 0.84,
      "probabilities": {
        "options": {
          "c4": 0.08,
          "hold": 0.06
        },
        "rest": 0.84,
        "ambiguous": 0.02
      }
    },
    {
      "id": "rh-index",
      "status": "ready",
      "verdict": "chosen",
      "action": "e4",
      "suggestedAction": "e4",
      "confidence": 0.86,
      "probabilities": {
        "options": {
          "e4": 0.86,
          "d4": 0.1
        },
        "rest": 0.03,
        "ambiguous": 0.01
      }
    },
    {
      "id": "lh-pinky",
      "status": "ready",
      "verdict": "chosen",
      "action": "c3",
      "suggestedAction": "c3",
      "confidence": 0.9,
      "probabilities": {
        "options": {
          "c3": 0.9,
          "g2": 0.06
        },
        "rest": 0.03,
        "ambiguous": 0.01
      }
    }
  ]
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`next-note`](../next-note/README.md): Use next-note when the loop chooses one melodic note rather than an action per finger.
- [`next-chord`](../next-chord/README.md): Use next-chord to pick the harmony first, then let finger-actions voice it.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                                       |
| --------------- | -------- | ----------------------------------------------------------- |
| `music`         | Yes      | string                                                      |
| `beat`          | Yes      | string                                                      |
| `fingers`       | Yes      | { id, text, options }[]; at least 1 items; at most 20 items |
| `style`         | No       | string                                                      |
| `minConfidence` | No       | number; minimum 0; maximum 1                                |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `style` is optional and is omitted from the request when absent. `fingers` holds 1 to 20 entries, each with a unique `id`, a `text` describing that finger's current position, and 1 to 50 `options` with unique ids.

## Result

`assignments` holds one entry per finger, in input order. `verdict` is `chosen` when a listed option was picked, `rest` when the finger should release or stay silent this beat, or `ambiguous` when several options fit equally. `action` is the chosen option id when the entry is `ready` and something was chosen; otherwise it is null. `suggestedAction` keeps a low-confidence pick for inspection. `probabilities.options` is keyed by your option ids, with `rest` and `ambiguous` reported alongside.

An entry is `ready` when its `confidence` meets `minConfidence` and the verdict is not `ambiguous`. The overall `status` is `review` when any finger is. Fingers that are individually `ready` remain usable.

## Reuse and calls

Uses the shared assignments helper, which asks one question per finger in a single Jev request, each with that finger's own options plus the reserved `rest` and `ambiguous` outcomes, and maps answers back to your ids. This folder owns the per-finger question wording. A live invocation makes one logical Jev request.

## Limits

Each finger is a separate question that shares the same state, so Jev does not jointly plan the hand. Two fingers can choose the same key, or a voicing can exceed a comfortable stretch. Resolve collisions, reach, and fingering rules in code before sending anything to an instrument. The recipe never invents notes: it only picks from the options you list, so give each finger the keys it can actually reach. Beat scheduling, note lengths, velocity, and MIDI output belong in application code. For a single melodic choice use [`next-note`](../next-note/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response in which the thumb rests, the index starts the melody on E4, and the left pinky re-strikes the bass. After installing `jev-recipes`, `npx jev-recipes demo finger-actions` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe finger-actions` to inspect the input and result schemas.
