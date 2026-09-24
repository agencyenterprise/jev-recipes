# Classify a patient's appointment request

<!-- BEGIN GENERATED: usage -->

What does the patient primarily want from message: to schedule, reschedule, or cancel an appointment, get results, get a refill, or ask a question?

Use when: You need to route incoming patient portal messages or voicemail transcripts to the scheduling, results, or pharmacy queue by the main thing the patient asks for.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { appointmentRequestKind } from 'jev-recipes/appointment-request-kind';

const result = await appointmentRequestKind({
  message:
    'Hi, I am scheduled with Dr. Nguyen on Thursday at 2pm but my work shift changed. Is there anything available Friday morning instead?',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo appointment-request-kind`.

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
  "verdict": "reschedule",
  "confidence": 0.9,
  "probabilities": {
    "schedule": 0.05,
    "reschedule": 0.9,
    "cancel": 0.02,
    "results": 0.01,
    "refill": 0,
    "question": 0.01,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`turn-intent`](../turn-intent/README.md): Use turn-intent for the general communicative purpose of a message outside the appointment domain.
- [`cancellation-check`](../cancellation-check/README.md): Use cancellation-check when you only need to know whether a message cancels something.

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

`verdict` is one of `schedule`, `reschedule`, `cancel`, `results`, `refill`, `question`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The verdict is the patient's primary stated request, so a message that asks for two things of equal weight returns unclear rather than both. It does not confirm that the appointment, prescription, or test the patient refers to exists, is theirs, or is eligible for the action; look those up in your scheduling and pharmacy records. Reschedule versus cancel depends on wording, and the recipe follows the words: a patient who cancels and separately asks to book later is judged on which request dominates.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo appointment-request-kind` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe appointment-request-kind` to inspect the input and result schemas.
