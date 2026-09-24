# Check commit message accuracy

<!-- BEGIN GENERATED: usage -->

Does message accurately describe change, neither omitting a material part nor claiming work not present?

Use when: You need to flag commit or pull request titles that understate, overstate, or misdescribe the change they accompany before merge or changelog generation.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { commitMessageFit } from 'jev-recipes/commit-message-fit';

const result = await commitMessageFit({
  message: 'Fix off-by-one in pagination cursor and add regression test',
  change:
    "In paginate() in src/api/list.ts, changed the end index from offset + limit to offset + limit - 1 so the last page no longer repeats the first row of the next page. Added the test 'returns the last page without a duplicate row' to tests/list.test.ts.",
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo commit-message-fit`.

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
  "probability": 0.93,
  "confidence": 0.93,
  "verdict": "fits"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`summary-coverage`](../summary-coverage/README.md): Use summary-coverage to check whether a longer description preserves each specific point of a change.
- [`change-meaning`](../change-meaning/README.md): Use change-meaning to decide whether an edit to text alters its meaning or is editorial only.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `message`       | Yes      | string                       |
| `change`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `fits` when Jev's yes probability is at least 0.5 and `mismatched` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `mismatched` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to asking the author to confirm the description.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe compares the message with the change as described, not with the repository, so it inherits any gaps in the supplied change summary. It judges material coverage and honesty only: a terse but accurate message grades `fits`, and a well-formatted message that mentions a refactor the change does not include grades `mismatched`. Style rules, ticket references, and commit conventions belong in a linter or application policy.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo commit-message-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe commit-message-fit` to inspect the input and result schemas.
