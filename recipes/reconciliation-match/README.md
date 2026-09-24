# Match a ledger record to a statement line

<!-- BEGIN GENERATED: usage -->

Do record and statementLine describe the same transaction, judging payee, purpose, and timing wording?

Use when: You need a yes/no judgment on whether a bookkeeping entry and a bank or card statement line refer to the same transaction, after exact amount and date checks in code have narrowed the candidates.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { reconciliationMatch } from 'jev-recipes/reconciliation-match';

const result = await reconciliationMatch({
  record:
    '2024-03-14 | Adobe Creative Cloud team subscription, monthly, design team | Vendor: Adobe Inc.',
  statementLine: '03/16 ADOBE *CREATIVE CLD 800-833-6687 CA PURCHASE',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo reconciliation-match`.

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
  "probability": 0.9,
  "confidence": 0.9,
  "verdict": "same"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`entity-match`](../entity-match/README.md): Use entity-match to decide whether two descriptions name the same organization or person, rather than whether two records describe the same transaction.
- [`ticket-match`](../ticket-match/README.md): Use ticket-match to decide whether two support tickets report the same issue, rather than whether a ledger entry matches a statement line.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `record`        | Yes      | string                       |
| `statementLine` | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `same` when Jev's yes probability is at least 0.5 and `different` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `different` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict rests on how payee, purpose, and timing are worded, so it complements rather than replaces exact matching. Compare amounts and dates in code first and use this recipe to confirm or reject candidates whose descriptors differ, such as processor names and abbreviated merchant strings. A `same` verdict on two entries with different amounts is a signal to investigate, not to reconcile. The recipe cannot detect duplicate transactions from the same merchant on nearby dates unless the wording distinguishes them.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo reconciliation-match` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe reconciliation-match` to inspect the input and result schemas.
