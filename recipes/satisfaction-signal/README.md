# Grade expressed satisfaction

<!-- BEGIN GENERATED: usage -->

How much satisfaction with the outcome does message express at the close of an interaction, on a five-level rubric?

Use when: You need a graded satisfaction signal from closing messages when no survey response is available.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { satisfactionSignal } from 'jev-recipes/satisfaction-signal';

const result = await satisfactionSignal({
  message:
    'That fixed it, thank you so much for staying on this with me. Really appreciate the quick turnaround.',
  context: 'Final customer message after an agent reissued a failed refund.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo satisfaction-signal`.

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
  "score": 3.84,
  "level": 4,
  "confidence": 0.88,
  "probabilities": {
    "0": 0,
    "1": 0.01,
    "2": 0.02,
    "3": 0.09,
    "4": 0.88
  },
  "satisfaction": "delighted"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`resolution-check`](../resolution-check/README.md): Use resolution-check to decide whether the customer reported the issue itself resolved.
- [`frustration-signal`](../frustration-signal/README.md): Use frustration-signal for a categorical read on expressed frustration in any message.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `message`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

`satisfaction` is one of `dissatisfied`, `low`, `neutral`, `satisfied`, or `delighted`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it to trend satisfaction across conversations or to rank cases for follow-up.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the satisfaction question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade reads the wording of a closing message. It does not know whether the issue was actually fixed, whether the customer will return, or what they would answer on a survey. A polite sign-off with no evaluation grades `neutral`, not `satisfied`. Use [`resolution-check`](../resolution-check/README.md) when you need to know whether the issue was reported resolved. Application code maps levels to alerts or reporting buckets.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo satisfaction-signal` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe satisfaction-signal` to inspect the input and result schemas.
