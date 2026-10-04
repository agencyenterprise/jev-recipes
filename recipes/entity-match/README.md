# Match records to one entity

<!-- BEGIN GENERATED: usage -->

Do firstRecord and secondRecord describe the same real-world entity despite formatting, abbreviation, or partial fields?

Use when: You need to decide whether two customer, vendor, product, or place records should be merged or linked.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { entityMatch } from 'jev-recipes/entity-match';

const result = await entityMatch({
  firstRecord:
    '{"name":"Acme Corp.","city":"Portland, OR","phone":"(503) 555-0147","website":"acme.example"}',
  secondRecord: 'ACME Corporation, 1200 SW Main St, Portland Oregon 97204. Tel 503-555-0147.',
  context: 'Both records come from vendor onboarding forms filled in by hand.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo entity-match`.

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
  "probability": 0.94,
  "confidence": 0.94,
  "verdict": "same"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`ticket-match`](../ticket-match/README.md): Use ticket-match to decide whether two support tickets report the same issue.
- [`task-duplicate`](../task-duplicate/README.md): Use task-duplicate to catch a task that repeats one already on the list.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `firstRecord`   | Yes      | string                       |
| `secondRecord`  | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. Each record is a string; pass free text or the output of `JSON.stringify` for a structured record. `context` is optional and is omitted from the request when absent.

## Result

`verdict` is `same` when Jev's yes probability is at least 0.5 and `different` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `different` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and keep the records separate until a person or a stricter rule decides.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe compares the two records as supplied. It does not look either record up, check that its fields are accurate, or know your business definition of a duplicate. Records that share a name but conflict on a distinguishing detail grade `different`; records where one side simply has fewer fields can still grade `same`. Deciding which record survives a merge and how fields are combined belongs in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo entity-match` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe entity-match` to inspect the input and result schemas.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

Measured on 60 golden cases against `jev-1.13.0`: **87% accurate** overall.

Recorded 2026-10-04 with package 0.9.11, on the **development** split. Recipe fingerprint: `937fa33427abf5c862ed5c9f34919d1a5585a05b6cd7a722c857f0405f2dfb1d`.

Scoring revision: 2.

52/60 cases correct; 45 ready, 15 review, 0 failed. Accuracy among ready cases: 100%.

Latency: p50 106.09 ms, p95 168.95 ms. Usage: 31304 input tokens and 1200 output tokens across 60 logical requests.

Labels: author-synthetic (60 cases): AI-authored synthetic boundary cases for jev-recipes; labels have not had independent human review.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 76% to 93%.

| `minConfidence` | Deferred to review | Accuracy of ready results |
| --------------- | ------------------ | ------------------------- |
| 0.5             | 0%                 | 87%                       |
| 0.6             | 22%                | 100%                      |
| 0.7             | 25%                | 100%                      |
| 0.8             | 25%                | 100%                      |
| 0.9             | 25%                | 100%                      |
| 0.95            | 25%                | 100%                      |

The lowest threshold reaching 95% accuracy on ready results is 0.55.

Run `npm run eval -- entity-match` to save new results and update this guide. The full report, including misses, is in [evals/results/entity-match.json](../../evals/results/entity-match.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->
