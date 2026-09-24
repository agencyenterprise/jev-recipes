# Check a proposed slot against constraints

<!-- BEGIN GENERATED: usage -->

Does the time or slot proposed in proposal satisfy the availability constraints written in constraints?

Use when: A scheduling assistant has a candidate time and the availability of a person described in plain language, and needs a yes/no check before offering the slot.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { slotFit } from 'jev-recipes/slot-fit';

const result = await slotFit({
  proposal: 'How about Friday at 3:00 PM for the kickoff call?',
  constraints:
    'I am available weekday afternoons from 1 PM to 5 PM, except Fridays, which I keep meeting-free.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo slot-fit`.

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
  "probability": 0.06,
  "confidence": 0.94,
  "verdict": "violates"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`constraint-strength`](../constraint-strength/README.md): Use constraint-strength to decide whether an availability statement is a hard requirement or a preference before treating it as a constraint.
- [`step-complete`](../step-complete/README.md): Use step-complete to check whether a scheduling step has finished rather than whether a slot is allowed.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `proposal`      | Yes      | string                       |
| `constraints`   | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `fits` when Jev's yes probability is at least 0.5 and `violates` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `violates` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default, such as asking the person to confirm the slot instead of booking it.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe judges wording against wording. It reads natural-language rules such as "afternoons except Fridays" but does not compute calendar arithmetic, so resolve concrete dates, durations, and time zones in code before or after the call; a proposal and constraints written in different time zones will not be reconciled. Constraints are taken as complete, so other commitments, holidays, or preferences not stated in `constraints` are unknown. To decide whether an availability statement is a hard rule or a preference, use [`constraint-strength`](../constraint-strength/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo slot-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe slot-fit` to inspect the input and result schemas.
