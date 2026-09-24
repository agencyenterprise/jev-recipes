# Check deal stage against evidence

<!-- BEGIN GENERATED: usage -->

Does evidence support that the deal is at stage as described?

Use when: You need to audit pipeline hygiene by checking whether the conversation or activity on a deal justifies the stage a rep set.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { stageEvidence } from 'jev-recipes/stage-evidence';

const result = await stageEvidence({
  stage:
    'Proposal sent: a written proposal with pricing has been delivered to the decision maker and they have acknowledged receiving it.',
  evidence:
    'Call on Tuesday with Priya (VP Operations) to review requirements. She asked for a formal proposal covering the 40-seat rollout. Rep noted: will draft proposal this week and send Friday. No further activity logged.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo stage-evidence`.

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
  "probability": 0.07,
  "confidence": 0.9299999999999999,
  "verdict": "unsupported"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`step-complete`](../step-complete/README.md): Use step-complete to check whether a single workflow step was actually finished.
- [`resolution-check`](../resolution-check/README.md): Use resolution-check to decide whether a support conversation reached resolution.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `stage`         | Yes      | string                       |
| `evidence`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `supported` when Jev's yes probability is at least 0.5 and `unsupported` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `unsupported` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and flag the deal for a human look rather than moving it automatically.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe checks whether the supplied evidence justifies the supplied stage. It does not pick the correct stage, so an `unsupported` deal may be behind or ahead of the stage given. Write `stage` as the conditions that must hold, not just a stage name, because the judgment depends on that description. Evidence that omits activity which happened elsewhere yields `unsupported`; the recipe cannot see your CRM. Stage changes, alerts, and forecast adjustments belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo stage-evidence` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe stage-evidence` to inspect the input and result schemas.
