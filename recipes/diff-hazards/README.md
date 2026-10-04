# Flag hazards in a code diff

<!-- BEGIN GENERATED: usage -->

Which hazards does diff introduce: leaked secrets, destructive commands, debug leftovers, weakened tests, or dependency changes?

Use when: A coding agent or pre-commit hook needs a fast screen of a diff for the mistakes that reviewers most often catch late.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { diffHazards } from 'jev-recipes/diff-hazards';

const result = await diffHazards({
  diff: "--- a/src/payments.ts\n+++ b/src/payments.ts\n@@ -1,6 +1,9 @@\n import { Stripe } from 'stripe';\n-const stripe = new Stripe(process.env.STRIPE_KEY);\n+const stripe = new Stripe('sk_prod_51Hq9zLKj3mD8vXyZ2pQ7rT4wN6bF0cE1gA5hJ8kL');\n+console.log('DEBUG charge payload', payload);\n export async function charge(payload) {\n   return stripe.charges.create(payload);\n }",
  context: 'Pre-commit screen for a payments service.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo diff-hazards`.

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
  "detected": ["secretLeak", "debugLeftover"],
  "labels": {
    "secretLeak": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.97,
      "confidence": 0.97
    },
    "destructiveCommand": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.03,
      "confidence": 0.97
    },
    "debugLeftover": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.93,
      "confidence": 0.93
    },
    "testsWeakened": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.04,
      "confidence": 0.96
    },
    "dependencyChange": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.05,
      "confidence": 0.95
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`change-risk`](../change-risk/README.md): Use change-risk to grade the overall shipping risk of a described change rather than flag specific hazards in the diff text.
- [`commit-message-fit`](../commit-message-fit/README.md): Use commit-message-fit to check whether the commit message describes the change.
- [`breaking-change-signal`](../breaking-change-signal/README.md): Use breaking-change-signal to check whether a change breaks callers.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `diff`          | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

`labels` holds one check per label: `secretLeak`, `destructiveCommand`, `debugLeftover`, `testsWeakened`, `dependencyChange`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

**Current measurement; labels unspecified; experimental.**

Measured on 43 golden cases against `jev-1.13.0`: **95% accurate** overall (contested cases 100%, adversarial cases 80%).

Recorded 2026-10-04 with package 0.9.12, on the **development** split. Recipe fingerprint: `3d17977295595f9944444ce0330aa0158bd0649f056b4004fef0ff8f8c8a5c88`.

Scoring revision: 2.

41/43 cases correct; 35 ready, 8 review, 0 failed. Accuracy among ready cases: 97%.

Latency: p50 97 ms, p95 180.77 ms. Usage: 43106 input tokens and 4386 output tokens across 43 logical requests.

Labels: unspecified (43 cases): Not recorded by the dataset author.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 85% to 99%.

| `minConfidence` | Deferred to review | Accuracy of ready results |
| --------------- | ------------------ | ------------------------- |
| 0.5             | 0%                 | 95%                       |
| 0.6             | 5%                 | 95%                       |
| 0.7             | 12%                | 95%                       |
| 0.8             | 19%                | 97%                       |
| 0.9             | 40%                | 100%                      |
| 0.95            | 61%                | 100%                      |

The lowest threshold reaching 95% accuracy on ready results is 0.5.

Run `npm run eval -- diff-hazards` to save new results and update this guide. The full report, including misses, is in [evals/results/diff-hazards.json](../../evals/results/diff-hazards.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Split very large diffs by file and call the recipe per file; accuracy falls as unrelated hunks accumulate in one call. Deterministic checks such as secret-pattern scanners and lockfile diffs are cheaper and more reliable for what they cover; use this recipe for the semantic cases they miss.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo diff-hazards` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe diff-hazards` to inspect the input and result schemas.
