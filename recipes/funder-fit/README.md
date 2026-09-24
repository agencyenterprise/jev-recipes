# Compare two funding opportunities for a program

<!-- BEGIN GENERATED: usage -->

Which of firstOpportunity and secondOpportunity better fits program in purpose, eligibility wording, and scope?

Use when: You are shortlisting funding opportunities for a described program and want a head-to-head read on which of two calls fits it better before a development officer reads the full guidelines.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { funderFit } from 'jev-recipes/funder-fit';

const result = await funderFit({
  program:
    'Mobile dental clinic serving uninsured adults in Harney and Malheur counties, rural eastern Oregon. Operated by Sagebrush Health Partners, a 501(c)(3) founded in 2019. Two clinic days per week rotating across four towns, providing cleanings, fillings, and extractions. Seeking about $120,000 for one year of clinical staffing and supplies.',
  firstOpportunity:
    'Hollis Family Foundation, Rural Health Access grants. Awards of $25,000 to $150,000 to nonprofit organizations delivering direct health services in rural counties of Oregon and Washington. Priority given to programs serving uninsured or underinsured adults. Applicants must hold 501(c)(3) status and have at least two years of operating history. Operating and program costs are eligible.',
  secondOpportunity:
    'Brightway Fund, Youth Wellness Initiative. Awards of $10,000 to $50,000 for school-based health and nutrition programs serving children ages 5 to 18 in the Portland metropolitan area. Public schools and their nonprofit partners are eligible. Capital and equipment purchases are not funded.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo funder-fit`.

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
  "verdict": "first",
  "confidence": 0.92,
  "probabilities": {
    "first": 0.92,
    "second": 0.01,
    "tie": 0.02,
    "neither": 0.03,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`listing-compare`](../listing-compare/README.md): Use listing-compare for the same pairwise judgment over product listings and a shopper request.
- [`passage-compare`](../passage-compare/README.md): Use passage-compare for the same pairwise judgment over text passages and a question.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field               | Required | Shape                        |
| ------------------- | -------- | ---------------------------- |
| `program`           | Yes      | string                       |
| `firstOpportunity`  | Yes      | string                       |
| `secondOpportunity` | Yes      | string                       |
| `minConfidence`     | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `first`, `second`, `tie`, `neither`, or `unclear`. `first` and `second` name the preferred candidate. `tie` means both fit about equally. `neither` means no candidate fits, which is a confident answer rather than a failure.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. `probabilities` covers all five outcomes.

## Reuse and calls

Uses the shared comparison helper, which fixes the five outcomes and tells Jev that presentation order is irrelevant. This folder owns the question wording and the four outcome descriptions. A live invocation makes one logical Jev request.

## Limits

The verdict compares two opportunity descriptions against a program description, all as written; it does not know deadlines, prior awards, funder relationships, or eligibility facts such as audited financials that the texts omit. A better fit is not a likelier award, since competitiveness and unstated funder priorities are not judged. Funding ranges are read as stated, so checking whether a program budget falls inside a range, converting currencies, and computing whether a deadline has passed belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo funder-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe funder-fit` to inspect the input and result schemas.
