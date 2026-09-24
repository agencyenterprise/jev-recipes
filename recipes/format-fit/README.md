# Check requested format compliance

<!-- BEGIN GENERATED: usage -->

Does response follow the structure or format request explicitly asks for, such as a list, table, JSON, item count, sections, or language?

Use when: You need a yes/no check that a generated response honored the format the prompt or user explicitly asked for.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { formatFit } from 'jev-recipes/format-fit';

const result = await formatFit({
  request: 'Give me three benefits of unit testing as a numbered list, one sentence each.',
  response:
    '1. Unit tests catch regressions close to the change that caused them.\n2. They document how each function is expected to behave.\n3. They make refactoring safer because failures point to a specific unit.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo format-fit`.

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
  "probability": 0.95,
  "confidence": 0.95,
  "verdict": "follows"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`instruction-fit`](../instruction-fit/README.md): Use instruction-fit to check the response against all instructions, not only format.
- [`tone-check`](../tone-check/README.md): Use tone-check when the requirement is about voice or register rather than structure.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `request`       | Yes      | string                       |
| `response`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `follows` when Jev's yes probability is at least 0.5 and `deviates` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `deviates` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. A sensible default for review is to regenerate or route the response to a person rather than send it.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe checks the format instructions stated in `request`: list or table shape, machine formats, item counts, named sections, and the language of the answer. It does not judge whether the content is correct, and a request with no format instruction grades `follows`. The judgment is semantic, so strict machine formats such as JSON, CSV, or a schema should also be validated in code; use this recipe for the parts a parser cannot see, such as "three items" or "answer in Spanish".

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo format-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe format-fit` to inspect the input and result schemas.
