# Classify what a log line reports

<!-- BEGIN GENERATED: usage -->

What does line report: an error, a warning, a lifecycle event, a handled request, a metric, or debug output?

Use when: You are grouping or filtering unstructured log lines from mixed sources and cannot rely on a level field being present or accurate.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { logLineKind } from 'jev-recipes/log-line-kind';

const result = await logLineKind({
  line: '2026-09-23T14:02:11Z WARN db.pool: connection pool at 87% capacity, above the 80% threshold; new requests may queue',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo log-line-kind`.

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
  "verdict": "warning",
  "confidence": 0.82,
  "probabilities": {
    "error": 0.03,
    "warning": 0.82,
    "lifecycle": 0.01,
    "request": 0.01,
    "metric": 0.1,
    "debug": 0.02,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`failure-kind`](../failure-kind/README.md): Use failure-kind once a line is known to report an error and you need to say what kind of failure it was.
- [`result-outcome`](../result-outcome/README.md): Use result-outcome to classify how a reported task or job ended, rather than what kind of log line it is.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `line`          | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is one of `error`, `warning`, `lifecycle`, `request`, `metric`, `debug`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The verdict describes one line in isolation. A stack-trace continuation, a bare number, or a line that only makes sense next to its neighbours may come back `unclear`, and application code should group multi-line records before classifying them. The recipe does not parse timestamps, request IDs, or numeric fields, and it does not decide whether an error is worth paging on.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo log-line-kind` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe log-line-kind` to inspect the input and result schemas.
