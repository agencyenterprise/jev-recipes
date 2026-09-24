# Classify a billing dispute

<!-- BEGIN GENERATED: usage -->

What kind of billing dispute does message raise?

Use when: You need to sort incoming billing complaints into a fixed set of dispute types so each can be routed to the right handler or template.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { disputeKind } from 'jev-recipes/dispute-kind';

const result = await disputeKind({
  message:
    'I cancelled my Pro plan on August 28th and got the confirmation email, but my card was charged $49 again on September 1st. Please reverse it and confirm the account is actually closed this time.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo dispute-kind`.

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
  "verdict": "cancellation_not_honored",
  "confidence": 0.88,
  "probabilities": {
    "duplicate_charge": 0.03,
    "wrong_amount": 0.02,
    "unrecognized_charge": 0.02,
    "refund_not_received": 0.02,
    "cancellation_not_honored": 0.88,
    "other": 0.01,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`issue-impact`](../issue-impact/README.md): Use issue-impact to grade how badly a reported problem affects the customer, rather than what kind of billing dispute it is.
- [`route`](../route/README.md): Use route when the destinations are caller-defined queues rather than this fixed set of billing dispute types.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `message`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is one of `duplicate_charge`, `wrong_amount`, `unrecognized_charge`, `refund_not_received`, `cancellation_not_honored`, `other`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The label describes the customer's claim as worded, not what your billing system shows. A customer who says they cancelled may not have, and a charge they do not recognize may be legitimate, so every type still needs verification against records in code. Messages that mix several disputes are classified by the one pressed hardest, and `other` covers genuine billing complaints outside the named types rather than non-billing messages, which should land on `unclear`.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo dispute-kind` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe dispute-kind` to inspect the input and result schemas.
