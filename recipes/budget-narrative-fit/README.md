# Check a budget narrative against its line items

<!-- BEGIN GENERATED: usage -->

Does narrative explain each line item in lineItems and nothing that lineItems does not list?

Use when: You review grant budgets before submission and want to catch a narrative that skips a line item or justifies an expense the budget table does not contain.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { budgetNarrativeFit } from 'jev-recipes/budget-narrative-fit';

const result = await budgetNarrativeFit({
  lineItems:
    'Program coordinator salary (0.5 FTE): $30,000\nBooks and materials: $9,000\nTutor training and background checks: $4,000\nSnacks and family reading nights: $5,000\nTotal: $48,000',
  narrative:
    "Personnel. A half-time program coordinator ($30,000) will recruit and schedule tutors, coordinate with the three partner schools, and track attendance. Books and materials ($9,000) cover levelled readers for 90 students, reading logs, and consumables for the school year. Tutor training and background checks ($4,000) fund a two-day orientation and state background screening for 12 volunteers. Travel ($2,400) reimburses the coordinator's mileage between the three school sites at the standard rate.",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo budget-narrative-fit`.

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
  "probability": 0.06,
  "confidence": 0.94,
  "verdict": "misaligned"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`summary-coverage`](../summary-coverage/README.md): Use summary-coverage to check that a summary preserves each supplied source point in one direction, rather than two-way alignment between a table and its narrative.
- [`commit-message-fit`](../commit-message-fit/README.md): Use commit-message-fit for the analogous check that a commit message describes the change it accompanies.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `lineItems`     | Yes      | string                       |
| `narrative`     | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `aligned` when Jev's yes probability is at least 0.5 and `misaligned` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `misaligned` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict is about coverage in both directions and nothing else: it does not check that narrative figures match the table, that line items sum to the total, or that any cost is reasonable or allowable under a funder's rules. Matching is by purpose rather than wording, so a narrative that renames an item still counts as covering it, while a narrative that only repeats the table without explaining anything still counts as aligned. A misaligned verdict does not say whether the table or the narrative is the one to fix; reconciling amounts and deciding which side to correct belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo budget-narrative-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe budget-narrative-fit` to inspect the input and result schemas.
