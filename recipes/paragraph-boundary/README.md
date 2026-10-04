# Recover a paragraph boundary

<!-- BEGIN GENERATED: usage -->

Do two adjacent extracted text fragments continue one paragraph or belong to separate blocks?

Use when: Extraction preserved reading order but lost the difference between a hard line wrap and a paragraph break.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { paragraphBoundary } from 'jev-recipes/paragraph-boundary';

const result = await paragraphBoundary({
  left: 'To finish installing the package, run',
  right: 'the command shown in the next example.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo paragraph-boundary`.

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
  "verdict": "continue",
  "confidence": 0.96,
  "probabilities": {
    "continue": 0.96,
    "separate": 0.02,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`passage-standalone`](../passage-standalone/README.md): Use passage-standalone to judge unresolved references within a passage.
- [`topic-shift`](../topic-shift/README.md): Use topic-shift for conversational subject changes rather than text boundaries.
- [`text-block-role`](../text-block-role/README.md): Use text-block-role to classify an individual block before considering a join.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `left`          | Yes      | string                       |
| `right`         | Yes      | string                       |
| `before`        | No       | string                       |
| `after`         | No       | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `before` and `after` and `context` are optional and are omitted from the request when absent.

## Result

Returns continue, separate, or unclear with probabilities and ready or review status. A review result never authorizes joining.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The caller owns ordering, whitespace, native structure, dehyphenation, and source offsets. Preserve the boundary unless a ready continue result meets the application policy. Experimental: the demo is a fixture, not an accuracy measurement.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo paragraph-boundary` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe paragraph-boundary` to inspect the input and result schemas.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

**Current public-dataset measurement; experimental.**

Measured on 112 golden cases against `jev-1.13.0`: **94% accurate** overall.

Recorded 2026-10-04 with package 0.9.12, on the **development** split. Recipe fingerprint: `4740e3077ceb0727eb06a35d4c4e3c56e01da0c117fbc378b8f7e940b53c9bfa`.

Scoring revision: 2.

105/112 cases correct; 55 ready, 57 review, 0 failed. Accuracy among ready cases: 100%.

Latency: p50 102.5 ms, p95 147.45 ms. Usage: 61304 input tokens and 4690 output tokens across 112 logical requests.

Labels: public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/assert.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/child_process.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/crypto.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/diagnostics_channel.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/dns.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/errors.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/process.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/repl.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/timers.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/tls.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/util.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/vm.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/wasi.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/webcrypto.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 88% to 97%.

| `minConfidence` | Deferred to review | Accuracy of ready results |
| --------------- | ------------------ | ------------------------- |
| 0.5             | 29%                | 99%                       |
| 0.6             | 43%                | 100%                      |
| 0.7             | 46%                | 100%                      |
| 0.8             | 51%                | 100%                      |
| 0.9             | 55%                | 100%                      |
| 0.95            | 60%                | 100%                      |

The lowest threshold reaching 95% accuracy on ready results is 0.5.

Run `npm run eval -- paragraph-boundary` to save new results and update this guide. The full report, including misses, is in [evals/results/paragraph-boundary.json](../../evals/results/paragraph-boundary.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->

The public evaluation corpus and reproducible transformations are described in the [evaluation guide](../../docs/evaluation.md#gateway-evaluation). The [ingestion example](../../examples/ingestion/README.md) preserves original text and offsets while returning a proposal.
