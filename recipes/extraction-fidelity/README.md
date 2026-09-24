# Grade extraction fidelity

<!-- BEGIN GENERATED: usage -->

How faithfully does extracted represent the facts in source, without invented, altered, or dropped values, on a five-level rubric?

Use when: You need to grade a structured extraction against its source document before trusting, storing, or acting on the values.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { extractionFidelity } from 'jev-recipes/extraction-fidelity';

const result = await extractionFidelity({
  source:
    'Invoice INV-2041 issued 3 March 2026 to Harbor Lighting Ltd for 12 LED fixtures at $85.00 each. Subtotal $1,020.00, tax $81.60, total $1,101.60. Payment due 2 April 2026.',
  extracted:
    '{"invoiceNumber":"INV-2041","issued":"2026-03-03","customer":"Harbor Lighting Ltd","total":1101.6,"due":"2026-04-02"}',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo extraction-fidelity`.

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
  "score": 3.04,
  "level": 3,
  "confidence": 0.81,
  "probabilities": {
    "0": 0,
    "1": 0.01,
    "2": 0.06,
    "3": 0.81,
    "4": 0.12
  },
  "fidelity": "high"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`field-select`](../field-select/README.md): Use field-select to pick which field a value belongs to before grading the result.
- [`summary-coverage`](../summary-coverage/README.md): Use summary-coverage when the output is prose that should cover the source, not a set of fields.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `source`        | Yes      | string                       |
| `extracted`     | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `extracted` is a string; pass the output of `JSON.stringify` for a structured record.

## Result

`fidelity` is one of `poor`, `low`, `fair`, `high`, or `exact`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it to rank extractions or set an acceptance threshold.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the fidelity question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The rubric grades agreement between `extracted` and `source`. It does not check whether the source is accurate or current, and it does not know your schema, so a field the extractor was never asked for counts as an omission only when the source states it. The grade is a single number for the whole extraction; it does not say which value is wrong or missing. Add a per-field check when you need to correct specific values.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo extraction-fidelity` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe extraction-fidelity` to inspect the input and result schemas.
