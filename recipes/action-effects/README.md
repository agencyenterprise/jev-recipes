# Label the side effects of an action

<!-- BEGIN GENERATED: usage -->

Which side effects does the described action involve: writing or modifying data, sending a message or notification, spending or moving money, deleting something, or calling an external service?

Use when: An agent is about to execute a step and your approval policy differs by effect, so you want to gate auto-execution per side effect rather than with one blanket risk score.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { actionEffects } from 'jev-recipes/action-effects';

const result = await actionEffects({
  action:
    'Send the weekly product digest to all 1,240 subscribers on the newsletter list through the SendGrid API, then set last_digest_sent_at to now on each subscriber row in the users table.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo action-effects`.

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
  "detected": ["writesData", "sendsMessage", "callsExternal"],
  "labels": {
    "writesData": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.94,
      "confidence": 0.94
    },
    "sendsMessage": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.97,
      "confidence": 0.97
    },
    "spendsMoney": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.04,
      "confidence": 0.96
    },
    "deletesData": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.02,
      "confidence": 0.98
    },
    "callsExternal": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.93,
      "confidence": 0.93
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`action-reversibility`](../action-reversibility/README.md): Use action-reversibility to grade how hard the action is to undo, rather than which kinds of effect it has.
- [`action-scope`](../action-scope/README.md): Use action-scope to check whether the action stays within the work that was requested.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `action`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per label: `writesData`, `sendsMessage`, `spendsMoney`, `deletesData`, `callsExternal`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

The labels describe the action as written, not what the underlying tool actually does, so a vaguely described action can hide effects and a verbose one can overstate them. External calls are labeled whether or not they are read-only, and archiving or deactivating data does not count as deletion; decide how each case should be treated in your policy code. The recipe does not authorize anything. Spending limits, confirmation prompts, and per-effect approval rules belong in the application that consumes the labels.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo action-effects` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe action-effects` to inspect the input and result schemas.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

**Current synthetic measurement.**

Measured on 40 golden cases against `typesafe-ai/jev`: **100% accurate** overall.

Recorded 2026-09-27 with package 0.8.1, on the **held-out** split. Recipe fingerprint: `1d8a904b39336096ed678153226be54701c7248ebdf7f840f089be0b46f7c1fc`.

40/40 cases correct; 20 ready, 20 review, 0 failed. Accuracy among ready cases: 100%.

Latency: p50 261.06 ms, p95 397.91 ms. Usage: 37890 input tokens and 3840 output tokens across 40 logical requests.

Labels: author-synthetic (40 cases): AI-authored new scenario families for the September 2026 update; not independently human-reviewed. Previous inspected holdouts moved to development.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 91% to 100%.

**Measured on these synthetic cases.**

A case counts as correct only when every item in it is right. Across the 200 individual items, **100%** were judged correctly.

Evaluated with the policy frozen on development data: minConfidence 0.8. No threshold search was performed on held-out cases.

Run `npm run eval -- action-effects` to save new results and update this guide. The full report, including misses, is in [evals/results/action-effects.json](../../evals/results/action-effects.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->

## Decision boundary

Judge the effects of executing the outer action. Explaining a deletion or drafting instructions to send money does not itself delete data or move money. The caller still determines permissions and executes any approved action.
