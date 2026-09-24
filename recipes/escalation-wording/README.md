# Check whether a message asks for escalation

<!-- BEGIN GENERATED: usage -->

Does message explicitly ask for escalation to a higher tier, a manager, or on-call engineering?

Use when: You are routing inbound support messages or internal chat and need to catch explicit escalation requests so they reach a supervisor, a higher support tier, or the on-call engineer.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { escalationWording } from 'jev-recipes/escalation-wording';

const result = await escalationWording({
  message:
    'I have been going back and forth with support for a week and the billing error is still not fixed. Please escalate this to your engineering team or have a supervisor contact me directly today.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo escalation-wording`.

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
  "probability": 0.96,
  "confidence": 0.96,
  "verdict": "requested"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`urgency-signal`](../urgency-signal/README.md): Use urgency-signal to grade how urgent a message sounds, whether or not it asks for escalation.
- [`handoff`](../handoff/README.md): Use handoff to decide whether a conversation should move to a human at all, rather than whether the writer asked for a higher tier.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `message`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `requested` when Jev's yes probability is at least 0.5 and `absent` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `absent` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict reflects what the writer asked for, not what the situation warrants. A message can be urgent, angry, or describe an outage and still come back `absent` because it never asks for someone more senior; pair it with an urgency or frustration check when that matters. The recipe does not pick the recipient or decide whether the escalation is justified, so tier and on-call routing rules stay in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo escalation-wording` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe escalation-wording` to inspect the input and result schemas.
