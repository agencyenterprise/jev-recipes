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

**Earlier-evaluator measurement; experimental.**

Measured on 167 golden cases against `typesafe-ai/jev`: **93% accurate** overall.

Recorded 2026-09-27 with package 0.8.1, on the **held-out** split. Recipe fingerprint: `4740e3077ceb0727eb06a35d4c4e3c56e01da0c117fbc378b8f7e940b53c9bfa`.

Scoring revision: 1.

155/167 cases correct; 82 ready, 85 review, 0 failed. Accuracy among ready cases: 99%.

Latency: p50 242.82 ms, p95 347.69 ms. Usage: 90864 input tokens and 6993 output tokens across 167 logical requests.

Labels: public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/async_context.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/buffer.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/cli.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/console.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/events.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/fs.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/http.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/https.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/net.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/path.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/perf_hooks.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/querystring.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/readline.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/stream.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (7 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/string_decoder.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/test.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/tty.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/url.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/v8.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/worker_threads.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license. public-dataset (8 cases): https://raw.githubusercontent.com/nodejs/node/v22.20.0/doc/api/zlib.md; source Markdown labels, transformed by build-ingestion-cases.mjs; no independent human review; Node.js MIT license.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 88% to 96%.

**Experimental: declared document acceptance policy not met.**

Evaluated with the policy frozen on development data: minConfidence 0.8. No threshold search was performed on held-out cases.

Run `npm run eval -- paragraph-boundary` to save new results and update this guide. The full report, including misses, is in [evals/results/paragraph-boundary.json](../../evals/results/paragraph-boundary.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->

The public evaluation corpus and reproducible transformations are described in the [evaluation guide](../../docs/evaluation.md#gateway-evaluation). The [ingestion example](../../examples/ingestion/README.md) preserves original text and offsets while returning a proposal.
