# Identify a text block’s structure

<!-- BEGIN GENERATED: usage -->

Is extracted text a heading, body paragraph, list item, code, table, caption, formula, or other block?

Use when: You have already extracted a text block but its structural markup is missing.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { textBlockRole } from 'jev-recipes/text-block-role';

const result = await textBlockRole({
  text: 'Installation',
  after: 'Run npm install to add the package.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo text-block-role`.

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
  "verdict": "heading",
  "confidence": 0.94,
  "probabilities": {
    "heading": 0.94,
    "body": 0.04,
    "list_item": 0,
    "code": 0,
    "table": 0,
    "caption": 0,
    "formula": 0,
    "other": 0,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`document-role`](../document-role/README.md): Use document-role for the purpose of an entire document.
- [`context-role`](../context-role/README.md): Use context-role for the contribution a passage makes to a question.
- [`paragraph-boundary`](../paragraph-boundary/README.md): Use paragraph-boundary to decide whether adjacent fragments belong to one paragraph.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `text`          | Yes      | string                       |
| `before`        | No       | string                       |
| `after`         | No       | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `before` and `after` and `context` are optional and are omitted from the request when absent.

## Result

Returns a suggested structural verdict, probabilities, and ready or review status. Unclear always requires review.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The caller supplies ordered, retained text and owns native tags, extraction, offsets, and rendering. This recipe never deletes or rewrites a block. Experimental: the fixture demonstrates the contract, not accuracy.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo text-block-role` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe text-block-role` to inspect the input and result schemas.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

Measured on 126 golden cases against `jev-1.13.0`: **83% accurate** overall.

Recorded 2026-10-04 with package 0.9.11, on the **development** split. Recipe fingerprint: `32da43478751402b4e6dc643b92a96dfdbf6b467d1299cd29aedf389d4710b8b`.

Scoring revision: 2.

105/126 cases correct; 92 ready, 34 review, 0 failed. Accuracy among ready cases: 96%.

Latency: p50 109.23 ms, p95 185.59 ms. Usage: 92848 input tokens and 10333 output tokens across 126 logical requests.

Labels: public-dataset (9 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/assert.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (9 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/child_process.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (9 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/crypto.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (9 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/diagnostics_channel.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (9 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/dns.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (9 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/errors.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (9 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/process.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (9 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/repl.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (9 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/timers.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (9 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/tls.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (9 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/util.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (9 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/vm.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (9 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/wasi.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (9 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/webcrypto.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 76% to 89%.

| `minConfidence` | Deferred to review | Accuracy of ready results |
| --------------- | ------------------ | ------------------------- |
| 0.5             | 6%                 | 86%                       |
| 0.6             | 12%                | 90%                       |
| 0.7             | 19%                | 93%                       |
| 0.8             | 27%                | 96%                       |
| 0.9             | 35%                | 99%                       |
| 0.95            | 42%                | 100%                      |

The lowest threshold reaching 95% accuracy on ready results is 0.8.

Run `npm run eval -- text-block-role` to save new results and update this guide. The full report, including misses, is in [evals/results/text-block-role.json](../../evals/results/text-block-role.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->

The public evaluation corpus and reproducible transformations are described in the [evaluation guide](../../docs/evaluation.md#gateway-evaluation). The [ingestion example](../../examples/ingestion/README.md) preserves original text and offsets while returning a proposal.
