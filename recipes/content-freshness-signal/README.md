# Detect perishable content

<!-- BEGIN GENERATED: usage -->

Does content contain claims that are likely to go stale, such as prices, versions, dates, current events, or latest wording?

Use when: You schedule content reviews, decide which pages need dated review notes, or want to flag articles that will silently become wrong.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { contentFreshnessSignal } from 'jev-recipes/content-freshness-signal';

const result = await contentFreshnessSignal({
  content:
    'Getting started with Node.js\n\nThe latest LTS release, Node 22, ships with built-in test runner support and a stable fetch API. Download the installer from nodejs.org; the current version is 22.11.0. Hosting on a small VPS costs around $6 per month with most providers this year. Once installed, run node --version to confirm the install.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo content-freshness-signal`.

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
  "verdict": "perishable"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`fact-stability`](../fact-stability/README.md): Use fact-stability to judge a single stored fact rather than a whole piece of content.
- [`freshness-needed`](../freshness-needed/README.md): Use freshness-needed to decide whether a question requires current information to answer.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `content`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `perishable` when Jev's yes probability is at least 0.5 and `evergreen` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `evergreen` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict says only that perishable claims are present; it does not check whether those claims are accurate today or estimate when they will become wrong. The recipe has no notion of the current date, so it cannot tell whether a dated claim has already expired. Review intervals, expiry rules, and which claims to re-verify belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo content-freshness-signal` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe content-freshness-signal` to inspect the input and result schemas.
