# Detect conflicting clauses

<!-- BEGIN GENERATED: usage -->

Do firstClause and secondClause impose requirements that cannot both be satisfied?

Use when: You need a yes/no check that two clauses from a contract, policy set, or amendment can both be honored before flagging them for review.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { clauseConflict } from 'jev-recipes/clause-conflict';

const result = await clauseConflict({
  firstClause:
    'The Customer shall pay each undisputed invoice within thirty (30) days of the invoice date.',
  secondClause:
    'All invoices are payable in full within fourteen (14) days of the invoice date, and no invoice may be disputed after payment is due.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo clause-conflict`.

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
  "probability": 0.89,
  "confidence": 0.89,
  "verdict": "conflict"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`instruction-conflict`](../instruction-conflict/README.md): Use instruction-conflict to compare two operational instructions rather than contract or policy clauses, with a separate different-scope outcome.
- [`evidence-conflict`](../evidence-conflict/README.md): Use evidence-conflict to check whether two factual statements contradict each other rather than whether two requirements can both be met.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `firstClause`   | Yes      | string                       |
| `secondClause`  | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `conflict` when Jev's yes probability is at least 0.5 and `compatible` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `compatible` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default, such as routing both clauses to a human reviewer.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe says whether both clauses can be honored at once, not which one should win. It is not legal advice: order-of-precedence rules, governing law, and enforceability belong to a lawyer or to application policy. It compares the two clauses as supplied, so defined terms or exceptions that live elsewhere in the document are unknown unless you include them in the clause text. For operational instructions rather than contract wording use [`instruction-conflict`](../instruction-conflict/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo clause-conflict` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe clause-conflict` to inspect the input and result schemas.
