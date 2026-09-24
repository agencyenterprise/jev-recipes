# Check whether a message acknowledges a mistake

<!-- BEGIN GENERATED: usage -->

Does message explicitly acknowledge an earlier mistake and state a correction, rather than silently changing course or ignoring it?

Use when: An agent has been shown to be wrong earlier in a conversation and you want to verify that its follow-up owns the error and states the fix, rather than quietly switching answers.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { errorAcknowledgment } from 'jev-recipes/error-acknowledgment';

const result = await errorAcknowledgment({
  message:
    'I need to correct something I said earlier: I told you the API returns timestamps in your local time zone. That was wrong. It returns UTC, which is why you saw the three-hour offset. I have updated the example to parse the field with a UTC-aware formatter, so the times should now line up with your logs.',
  context:
    "Two turns earlier the assistant stated that the /events endpoint returns timestamps in the caller's local time zone. The user then reported a consistent three-hour offset.",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo error-acknowledgment`.

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
  "probability": 0.95,
  "confidence": 0.95,
  "verdict": "acknowledged"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`correction-target`](../correction-target/README.md): Use correction-target to identify which earlier statement a correction refers to, rather than whether the message acknowledges an error at all.
- [`uncertainty-expression`](../uncertainty-expression/README.md): Use uncertainty-expression to grade how the message hedges, rather than whether it admits a prior mistake.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `message`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

`verdict` is `acknowledged` when Jev's yes probability is at least 0.5 and `absent` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `absent` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict describes the wording of the message, not the truth of either the original statement or the correction; a message can acknowledge a mistake that was not one, or correct it wrongly. Without `context`, the recipe accepts any message that names a mistake and a fix, so pass the earlier turn when you need the acknowledgment to refer to a specific error. Tone is ignored: a brief factual correction passes and an apology with no correction fails. Deciding what to do about a silent course change belongs in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo error-acknowledgment` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe error-acknowledgment` to inspect the input and result schemas.
