# Check an expense against a written policy

<!-- BEGIN GENERATED: usage -->

Does expense, as described, comply with the written policy?

Use when: You need a yes/no check on whether a described expense follows the rules in an expense policy before it is approved, flagged, or sent back to the submitter.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { policyCompliance } from 'jev-recipes/policy-compliance';

const result = await policyCompliance({
  expense:
    'Team dinner on Thursday for 4 engineers at a steakhouse after the release. Included two bottles of wine. Total $412, paid on my personal card, receipt attached. No client was present.',
  policy:
    "Meals: Team meals are reimbursable when approved in advance by the manager and when they mark a project milestone. Alcohol is reimbursable only at client-facing events. Meals over $75 per person require a manager's written approval before submission. Receipts are required for any expense over $25.",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo policy-compliance`.

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
  "probability": 0.09,
  "confidence": 0.91,
  "verdict": "noncompliant"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`policy-severity`](../policy-severity/README.md): Use policy-severity to grade how serious a known violation is, rather than to decide whether the expense violates the policy at all.
- [`action-scope`](../action-scope/README.md): Use action-scope to check whether an agent's proposed action stays within its permitted scope, rather than whether a submitted expense follows a spending policy.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `expense`       | Yes      | string                       |
| `policy`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `compliant` when Jev's yes probability is at least 0.5 and `noncompliant` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `noncompliant` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict compares the described facts with the written rules and nothing more. It does not compute per-person amounts, compare totals to limits, or check dates, so any numeric or calendar rule must be enforced in code before or after this call. Facts the description omits are not assumed either way, which means a vague description can pass while a detailed one fails, and rules the policy does not mention are treated as permitting the expense. A `compliant` verdict is not an approval, and a `noncompliant` verdict is not a determination of intent or misconduct.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo policy-compliance` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe policy-compliance` to inspect the input and result schemas.
