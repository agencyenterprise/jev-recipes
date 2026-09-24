# Check a corrective action against its root cause

<!-- BEGIN GENERATED: usage -->

Does action address the cause stated in rootCause rather than only the symptom or the affected items?

Use when: You review corrective action plans in a CAPA or nonconformance workflow and want to flag actions that rework parts, add inspection, or retrain people while leaving the stated cause in place.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { correctiveActionFit } from 'jev-recipes/corrective-action-fit';

const result = await correctiveActionFit({
  rootCause:
    'The torque wrench at station 4 was reading 15% low because the tooling register lists a 24-month calibration interval for this wrench model while the manufacturer specifies 12 months. The wrench passed its last register-scheduled check and drifted out of tolerance eight months later, so every assembly torqued at station 4 since then is suspect.',
  action:
    'Rework the 340 assemblies built since the last calibration to the specified torque and verify with a calibrated reference wrench. Send the station 4 wrench for recalibration and return it to service once it passes. Brief operators on checking the calibration sticker before each shift.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo corrective-action-fit`.

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
  "probability": 0.08,
  "confidence": 0.92,
  "verdict": "misses"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`workaround-fit`](../workaround-fit/README.md): Use workaround-fit to check whether a temporary workaround addresses an issue within stated constraints, rather than whether a permanent action removes a cause.
- [`troubleshooting-fit`](../troubleshooting-fit/README.md): Use troubleshooting-fit to assess a diagnostic procedure rather than a proposed fix.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `rootCause`     | Yes      | string                       |
| `action`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `addresses` when Jev's yes probability is at least 0.5 and `misses` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `misses` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict compares two texts: it takes rootCause as given and does not know whether that cause is real, whether action is feasible, or whether it will prove effective once implemented. An action that addresses the cause can still lack an owner, a due date, or an effectiveness check, and an action that misses the cause can still be a necessary containment step, so the verdict is one input to a reviewer rather than a decision to accept or reject the plan. Tracking action completion, verifying effectiveness, and closing the CAPA record belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo corrective-action-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe corrective-action-fit` to inspect the input and result schemas.
