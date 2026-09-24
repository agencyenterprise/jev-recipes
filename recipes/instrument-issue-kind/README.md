# Classify an instrument problem report

<!-- BEGIN GENERATED: usage -->

What kind of problem does report describe with a musical instrument: tuning, buzz or rattle, no sound, intonation, mechanical, cosmetic, or unclear?

Use when: You take in repair requests or support messages from players and need to route each one to the right technician, help article, or intake form based on the kind of problem described.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { instrumentIssueKind } from 'jev-recipes/instrument-issue-kind';

const result = await instrumentIssueKind({
  report:
    'My Telecaster has developed a metallic buzz on the low E and A strings whenever I fret anything between the 5th and 9th frets. Open strings are fine and it still tunes up normally. It only started after I swapped to a heavier string set last week.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo instrument-issue-kind`.

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
  "verdict": "buzz_or_rattle",
  "confidence": 0.9,
  "probabilities": {
    "tuning": 0.02,
    "buzz_or_rattle": 0.9,
    "no_sound": 0.01,
    "intonation": 0.02,
    "mechanical": 0.03,
    "cosmetic": 0,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`failure-kind`](../failure-kind/README.md): Use failure-kind when the categories are your own list rather than this fixed set of instrument problem types.
- [`issue-impact`](../issue-impact/README.md): Use issue-impact to grade how badly the problem affects the player, rather than what kind of problem it is.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `report`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is one of `tuning`, `buzz_or_rattle`, `no_sound`, `intonation`, `mechanical`, `cosmetic`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The label describes the symptom as the player worded it, not the cause behind it: a buzz can come from fret wear, a low nut slot, or loose hardware, and a tuning complaint can come from strings, pegs, or structural damage, so diagnosis still needs a technician or a follow-up recipe. Reports that mix several problems are classified by the one pressed hardest, and `cosmetic` applies only when appearance is the whole complaint. Urgency, repair cost, warranty status, and which queue each kind lands in belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo instrument-issue-kind` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe instrument-issue-kind` to inspect the input and result schemas.
