# Check whether a phrase has closed

<!-- BEGIN GENERATED: usage -->

Does recentNotes form a complete musical phrase that is ready to cadence or rest, or is it still open, given any meter supplied?

Use when: A generation loop needs to know whether the line it has produced can pause, cadence, or hand off to a new idea, or whether it should keep the phrase going.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { phraseComplete } from 'jev-recipes/phrase-complete';

const result = await phraseComplete({
  recentNotes: 'C major. E4 D4 C4 D4 | E4 E4 E4 (half) | D4 D4 E4 D4 | C4 (whole note, held)',
  meter: '4/4',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo phrase-complete`.

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
  "probability": 0.91,
  "confidence": 0.91,
  "verdict": "complete"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`step-complete`](../step-complete/README.md): Use step-complete when supplied evidence must establish a stated completion condition, rather than judging musical closure from the notes themselves.
- [`resolution-check`](../resolution-check/README.md): Use resolution-check to detect whether a customer reports an issue as resolved, not whether a melody has come to rest.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `recentNotes`   | Yes      | string                       |
| `meter`         | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `meter` is optional and is omitted from the request when absent.

## Result

`verdict` is `complete` when Jev's yes probability is at least 0.5 and `open` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `open` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict is a judgment of closure from the written notes and annotations, not a theory check: which key the line is in, whether the last note is the tonic, and whether the final bar is full are exact questions for application code, which should state the answers in `recentNotes` when they matter. A `complete` phrase is ready to close, not obliged to; a generation loop can still choose to extend it, and an `open` phrase can still be cut off deliberately. Closure conventions differ by style, so a line that reads as open in a chorale can read as complete in a blues, and `meter` only helps when the text also shows where the bars fall.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo phrase-complete` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe phrase-complete` to inspect the input and result schemas.
