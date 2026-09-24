# Match an expense to a category list

<!-- BEGIN GENERATED: usage -->

Does expense clearly fall under one of the caller's categories, under several equally, under none, or is it unclear?

Use when: You need to know whether a described expense can be filed under one of your own category definitions before an agent picks the category or asks the submitter for more detail.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { expenseCategory } from 'jev-recipes/expense-category';

const result = await expenseCategory({
  expense:
    "Uber from the airport to the client's office for the Tuesday kickoff meeting, then back to the hotel.",
  categories:
    'Travel - Airfare: flights and airline fees.\nTravel - Ground: taxis, rideshares, rental cars, trains, and parking while traveling for business.\nMeals: food and drink while traveling or hosting clients.\nSoftware: subscriptions and licenses for work tools.\nOffice Supplies: consumable items for the office.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo expense-category`.

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
  "verdict": "matched",
  "confidence": 0.86,
  "probabilities": {
    "matched": 0.86,
    "multiple": 0.08,
    "none": 0.03,
    "unclear": 0.03
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`route`](../route/README.md): Use route to pick one destination from a fixed list of routes rather than to check whether a category list covers an expense at all.
- [`field-select`](../field-select/README.md): Use field-select to choose which field of a record holds a value, rather than which category definition a described purchase satisfies.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `expense`       | Yes      | string                       |
| `categories`    | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is one of `matched`, `multiple`, `none`, `unclear`. `unclear` means the supplied facts do not establish a decision and always requires review.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. Inspect the verdict as well as the status: a ready result can name an outcome your application treats as negative. `probabilities` covers every verdict.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

The result says only which situation holds. When it is `matched`, the category name still has to be extracted in a follow-up call or by a second, narrower recipe, and when it is `multiple` the caller decides which definition wins. The judgment uses the category definitions exactly as supplied, so vague or overlapping definitions produce `multiple` or `unclear` rather than a guess. Amounts, currency, dates, and whether the expense is allowed at all are outside this decision and belong in code or a policy check.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo expense-category` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe expense-category` to inspect the input and result schemas.
