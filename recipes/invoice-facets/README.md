# Label what an invoice states

<!-- BEGIN GENERATED: usage -->

Which of these does invoice state: vendor identity, an invoice number, a due date, line items, a tax or total breakdown?

Use when: You need several independent presence checks on invoice text in one call, to spot missing fields before routing it for approval or entry.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { invoiceFacets } from 'jev-recipes/invoice-facets';

const result = await invoiceFacets({
  invoice:
    'Northwind Design Studio\n412 Harbor St, Portland OR\n\nINVOICE #2024-0187\nBill to: Acme Robotics, Attn: Accounts Payable\n\n1. Landing page redesign, 24 hrs @ $120/hr ........ $2,880.00\n2. Icon set (32 icons) ................................ $640.00\n\nSubtotal: $3,520.00\nTax (0%): $0.00\nTotal due: $3,520.00\n\nThank you for your business.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo invoice-facets`.

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
  "detected": ["statesVendor", "statesInvoiceNumber", "statesLineItems", "statesTotals"],
  "labels": {
    "statesVendor": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.97,
      "confidence": 0.97
    },
    "statesInvoiceNumber": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "statesDueDate": {
      "status": "ready",
      "verdict": "absent",
      "probability": 0.12,
      "confidence": 0.88
    },
    "statesLineItems": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.93,
      "confidence": 0.93
    },
    "statesTotals": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.96,
      "confidence": 0.96
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`clarify`](../clarify/README.md): Use clarify to decide whether a request about an invoice is too ambiguous to act on, rather than what the invoice text itself states.
- [`field-select`](../field-select/README.md): Use field-select to pick which field of a record a value belongs to, rather than to check which fields the invoice text contains at all.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `invoice`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per label: `statesVendor`, `statesInvoiceNumber`, `statesDueDate`, `statesLineItems`, `statesTotals`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present labels in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per label in a single Jev request. This folder owns the questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

Every label is a presence check on the supplied text. A stated invoice number, due date, or total is reported as present even if it is wrong, duplicated, or inconsistent with the line items, so parse and validate values in code. Payment terms such as "Net 30" count as stating a due date even though the actual date must be computed by the caller. The recipe does not judge whether the invoice is genuine, matches a purchase order, or should be paid.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo invoice-facets` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe invoice-facets` to inspect the input and result schemas.
