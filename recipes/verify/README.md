# Verify claims

<!-- BEGIN GENERATED: usage -->

Check each supplied claim against its paired evidence.

Use when: You need to know whether a claim is supported by its supplied evidence.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { verify } from 'jev-recipes/verify';

const result = await verify({
  claims: [
    {
      id: 'refund-window',
      claim: 'Customers can request a refund within 60 days.',
      evidence: 'Refunds are available only within 30 days of purchase.',
    },
    {
      id: 'support-hours',
      claim: 'Support is available on weekdays.',
      evidence: 'Contact our support team Monday through Friday, 9 am to 5 pm.',
    },
  ],
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo verify`.

<details>
<summary>Illustrative result from the offline fixture</summary>

```json
{
  "model": "demo-fixture",
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0
  },
  "checks": [
    {
      "id": "refund-window",
      "status": "ready",
      "verdict": "contradicted",
      "confidence": 0.94,
      "probabilities": {
        "supported": 0.01,
        "contradicted": 0.97,
        "unsupported": 0.02
      }
    },
    {
      "id": "support-hours",
      "status": "ready",
      "verdict": "supported",
      "confidence": 0.92,
      "probabilities": {
        "supported": 0.96,
        "contradicted": 0.01,
        "unsupported": 0.03
      }
    }
  ],
  "allSupported": false
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`citation-match`](../citation-match/README.md): Use citation-match to select which passages support one claim.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                                          |
| --------------- | -------- | -------------------------------------------------------------- |
| `claims`        | Yes      | { id, claim, evidence }[]; at least 1 items; at most 100 items |
| `minConfidence` | No       | number; minimum 0; maximum 1                                   |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`checks` preserves each claim ID and returns its verdict, status, confidence, and choice probabilities.

| Verdict        | Meaning                                                                        |
| -------------- | ------------------------------------------------------------------------------ |
| `supported`    | The paired evidence supports the entire claim.                                 |
| `contradicted` | The paired evidence establishes something incompatible with the claim.         |
| `unsupported`  | The paired evidence is insufficient to support or contradict the entire claim. |

Each check is `ready` at or above `minConfidence`, otherwise `review`. A ready check can still be contradicted or unsupported. `allSupported` is true only when every check is ready and supported. Read individual check statuses; the result has no top-level status.

The result includes model and token usage. Inspect the outcome as well as its review status.

## Reuse and calls

Uses the shared item-check helper. This folder owns the evidence criteria and the all-supported decision. All claim questions are sent in one request. The citation-match recipe calls this public function to select supporting passages. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Checks only supplied claim/evidence pairs. It does not extract claims, retrieve sources, establish source truth, or check whether an answer addresses every requested point. Exact arithmetic and date comparisons belong in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo verify` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe verify` to inspect the input and result schemas.
