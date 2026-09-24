# Check a change against a change-window policy

<!-- BEGIN GENERATED: usage -->

Does the described change fall within the written change-window or freeze policy?

Use when: A deploy or infrastructure change is proposed in free text and you want a first read on whether it is permitted under a written change-window or freeze policy before a human approver looks at it.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { changeWindowFit } from 'jev-recipes/change-window-fit';

const result = await changeWindowFit({
  change:
    'Deploy payments-service 4.12.1 to production on Friday 2026-09-25 at 16:30 UTC. It patches a rounding bug in refund amounts. Standard rolling deploy, no schema change. Not an emergency; the bug affects about 0.1% of refunds.',
  policy:
    'Production change windows are Monday to Thursday, 09:00 to 17:00 UTC. No production deploys on Fridays, weekends, or during the quarter-end freeze covering the last five business days of each quarter. Emergency fixes may proceed outside windows only with written approval from the incident commander.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo change-window-fit`.

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
  "verdict": "blocked"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`slot-fit`](../slot-fit/README.md): Use slot-fit to check whether a proposed time matches a stated availability window in scheduling contexts, rather than a deployment policy.
- [`action-scope`](../action-scope/README.md): Use action-scope to check whether an action stays within what was requested, rather than whether its timing is allowed.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `change`        | Yes      | string                       |
| `policy`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `allowed` when Jev's yes probability is at least 0.5 and `blocked` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `blocked` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict compares two texts as written. It does not know what day of the week a date falls on, whether a date sits inside a freeze period, or how to convert time zones, so application code should compute those facts and state them plainly in `change` before calling. It also does not know about approvals or calendars that are not in `policy`, and a `blocked` verdict is a flag for an approver rather than an enforcement action.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo change-window-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe change-window-fit` to inspect the input and result schemas.
