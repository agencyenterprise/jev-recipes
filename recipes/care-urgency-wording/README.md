# Grade the urgency a patient's wording asks for

<!-- BEGIN GENERATED: usage -->

How urgent is the care that message asks for, from routine to emergency, judged on what the patient's wording says rather than on medical assessment?

Use when: You need to sort patient messages into scheduling or response-time queues by the timeline the patient asks for, before or alongside clinical triage handled by protocol.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { careUrgencyWording } from 'jev-recipes/care-urgency-wording';

const result = await careUrgencyWording({
  message:
    'My daughter has had a fever of 101 since last night and now she says her ear really hurts. She is drinking fine and otherwise seems okay. Can someone see her today or tomorrow? I do not think it is an emergency, but I would rather not wait until next week.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo care-urgency-wording`.

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
  "score": 2.02,
  "level": 2,
  "confidence": 0.82,
  "probabilities": {
    "0": 0.02,
    "1": 0.06,
    "2": 0.82,
    "3": 0.08,
    "4": 0.02
  },
  "urgency": "prompt"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`urgency-signal`](../urgency-signal/README.md): Use urgency-signal when you only need a yes/no check that a message explicitly asks for urgent attention.
- [`handoff`](../handoff/README.md): Use handoff to decide whether a message should leave the automated flow for a human, such as a nurse line.

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

`urgency` is one of `routine`, `soon`, `prompt`, `urgent`, `emergency`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it for ranking or thresholds where a single label loses information.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

This is a reading of wording, not triage. A patient who describes chest pain in calm language and asks for "an appointment sometime" grades as routine, and a patient asking to be seen today for a mild rash grades as urgent. Do not use the level to decide medical priority; enforce emergency routing in code by protocol, such as keyword rules or a nurse review queue, before or regardless of this score. Use the level for scheduling queues, response-time expectations, and drafting replies that match the timeline the patient asked for.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo care-urgency-wording` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe care-urgency-wording` to inspect the input and result schemas.
