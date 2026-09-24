# Classify a reported shipping problem

<!-- BEGIN GENERATED: usage -->

What shipping problem does message report?

Use when: You need to route delivery complaints to the right workflow, such as a carrier trace, a replacement, or an address correction, from the words the customer used.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { shipmentIssueKind } from 'jev-recipes/shipment-issue-kind';

const result = await shipmentIssueKind({
  message:
    'Tracking says my order was delivered yesterday at 2:14 PM but there is nothing on my porch, in the mailbox, or with my neighbors. I have checked everywhere. Order #A81-2290.',
  context: 'Customer message submitted through the order help form for a small parcel shipment.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo shipment-issue-kind`.

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
  "verdict": "lost",
  "confidence": 0.9,
  "probabilities": {
    "delayed": 0.04,
    "damaged": 0.01,
    "lost": 0.9,
    "wrong_item": 0.01,
    "address": 0.02,
    "none": 0.01,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`failure-kind`](../failure-kind/README.md): Use failure-kind to classify why a technical operation failed rather than what went wrong with a physical delivery.
- [`issue-impact`](../issue-impact/README.md): Use issue-impact to grade how badly the reported problem affects the customer rather than what kind of problem it is.

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

| Verdict      | Meaning                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| `delayed`    | The shipment is late or has not arrived by the expected date but is still expected to arrive.        |
| `damaged`    | The shipment arrived with the item or packaging broken, crushed, leaking, or otherwise harmed.       |
| `lost`       | The shipment cannot be located, tracking has stopped, or it was marked delivered but never received. |
| `wrong_item` | The shipment arrived but contained a different item, quantity, size, or variant than ordered.        |
| `address`    | The shipment cannot be delivered because the address is wrong, incomplete, or undeliverable.         |
| `none`       | The message does not report a shipping problem.                                                      |
| `unclear`    | The message reports a problem whose kind is not established by the supplied text.                    |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

The recipe classifies the problem as the customer describes it, not as the carrier record shows it. A parcel reported `lost` may be sitting at a pickup point, so verify against tracking before issuing a refund or replacement. A message that mentions several problems, such as a late parcel that also arrived dented, is graded by the one the sender is mainly reporting, and the remedy they ask for does not affect the verdict. For how badly the problem affects the customer use [`issue-impact`](../issue-impact/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo shipment-issue-kind` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe shipment-issue-kind` shows the input and result schemas.
