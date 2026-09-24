# Select the practice exercise that addresses feedback

<!-- BEGIN GENERATED: usage -->

Which candidate practice exercise in candidates best addresses the problems raised in feedback, given the player's goal?

Use when: You are building a practice app that turns a teacher's or an automated assessor's feedback into a concrete assignment chosen from your own exercise library.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { exerciseSelect } from 'jev-recipes/exercise-select';

const result = await exerciseSelect({
  feedback:
    'You are rushing the sixteenth-note runs in the development section, and the left hand loses its evenness whenever the right hand takes the melody in bars 41 to 56.',
  goal: 'Perform the first movement at the studio recital in six weeks.',
  candidates: [
    {
      id: 'dev-section-metronome',
      text: 'Development section (bars 41 to 56) hands separately with the metronome clicking sixteenths at half tempo, then hands together, raising the tempo 4 bpm after each clean pass.',
    },
    {
      id: 'scales-in-thirds',
      text: 'Major scales in thirds, both hands, four octaves, all keys, at a steady moderate tempo.',
    },
  ],
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo exercise-select`.

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
  "selection": "dev-section-metronome",
  "suggestedSelection": "dev-section-metronome",
  "confidence": 0.9,
  "probabilities": {
    "candidates": {
      "dev-section-metronome": 0.9,
      "scales-in-thirds": 0.06
    },
    "none": 0.03,
    "ambiguous": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`choose-action`](../choose-action/README.md): Use choose-action to pick the next step from a list of general actions, rather than a practice exercise from an exercise library.
- [`troubleshooting-fit`](../troubleshooting-fit/README.md): Use troubleshooting-fit to check whether one supplied procedure addresses a reported problem, rather than to pick the best of several.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `feedback`      | Yes      | string                                             |
| `candidates`    | Yes      | { id, text }[]; at least 1 items; at most 50 items |
| `goal`          | No       | string                                             |
| `minConfidence` | No       | number; minimum 0; maximum 1                       |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `goal` is optional and is omitted from the request when absent.

## Result

`selection` is the id of the chosen `candidates` entry when the result is `ready` and a candidate matched. `verdict` is `matched`, `none` when no candidate fits, or `ambiguous` when several fit equally or the facts cannot separate them. `suggestedSelection` keeps a low-confidence pick for inspection while `selection` stays null.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `ambiguous`. `probabilities.candidates` is keyed by your candidate ids, with `none` and `ambiguous` reported alongside.

## Reuse and calls

Uses the shared candidate-selection helper, which presents your candidates as choices alongside none and ambiguous and maps the answer back to your ids. This folder owns the question wording and the review policy. A live invocation makes one logical Jev request.

## Limits

The selection is made among the candidates you supply and only against the problems as worded in the feedback, so a library that lacks a fitting exercise returns `none` rather than a suggestion, and generically useful exercises lose to one that names the passage and the problem. The recipe does not know the player's history, available practice time, or physical limits, and it does not check that the feedback itself is accurate. How long to assign the exercise, when to revisit the passage, and whether to override the choice with a teacher's plan belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo exercise-select` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe exercise-select` to inspect the input and result schemas.
