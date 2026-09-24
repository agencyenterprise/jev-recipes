# Grade a policy violation

<!-- BEGIN GENERATED: usage -->

How severely does content violate the supplied policy, on a five-level rubric?

Use when: You need a graded severity against your own written policy to choose between allow, flag, hide, or escalate.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { policySeverity } from 'jev-recipes/policy-severity';

const result = await policySeverity({
  content:
    'If you buy from this seller you deserve to get scammed, idiot. Everyone knows their address is 14 Elm Street, go tell them yourself.',
  policy:
    "Community posts may criticize sellers and products. Posts must not insult other members, and must not share a private individual's home address or other personal contact details.",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo policy-severity`.

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
  "score": 3.02,
  "level": 3,
  "confidence": 0.82,
  "probabilities": {
    "0": 0.01,
    "1": 0.02,
    "2": 0.1,
    "3": 0.82,
    "4": 0.05
  },
  "severity": "serious"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`handoff`](../handoff/README.md): Use handoff to decide whether a case matches your human escalation rules.
- [`promise-check`](../promise-check/README.md): Use promise-check to catch replies that commit beyond what your rules allow.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `content`       | Yes      | string                       |
| `policy`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`severity` is one of `none`, `minor`, `moderate`, `serious`, or `severe`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it to order a review queue.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the severity question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade is relative to the policy you pass in. A vague policy yields uncertain grades; a policy that omits a rule cannot produce a violation of it. The recipe does not decide what action to take, and it does not replace the human review, appeals, or legal reporting your platform may require.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo policy-severity` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe policy-severity` to inspect the input and result schemas.
