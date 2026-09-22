# Match a known incident

<!-- BEGIN GENERATED: usage -->

Which supplied incident is supported as a match for ticket?

Use when: You need to connect a support ticket to a supplied known incident.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { incidentMatch } from 'jev-recipes/incident-match';

const result = await incidentMatch({
  ticket: 'Workspace exports fail with EXPORT_TIMEOUT.',
  incidents: [
    {
      id: 'exports',
      text: 'Active incident: workspace exports fail with EXPORT_TIMEOUT.',
    },
    { id: 'billing', text: 'Active incident: invoices appear with a delay.' },
  ],
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo incident-match`.

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
  "selection": "exports",
  "suggestedSelection": "exports",
  "confidence": 0.96,
  "probabilities": {
    "candidates": {
      "exports": 1,
      "billing": 0
    },
    "none": 0,
    "ambiguous": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`ticket-match`](../ticket-match/README.md): Use ticket-match to compare two tickets directly.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `ticket`        | Yes      | string                                             |
| `incidents`     | Yes      | { id, text }[]; at least 1 items; at most 50 items |
| `context`       | No       | string                                             |
| `minConfidence` | No       | number; minimum 0; maximum 1                       |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

`verdict` is `matched`, `none`, or `ambiguous`. A confident match returns the original item ID in `selection`. A low-confidence match keeps that ID only in `suggestedSelection`. `none` returns a null selection and can be `ready`; `ambiguous` always requires review. Probabilities are grouped under `candidates` by your original IDs, plus `none` and `ambiguous`.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared candidate-selection helper. This folder owns its selection question and input schema. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Matches only incidents supplied by the caller. Filter incident status, dates, affected regions, and exact versions in code first.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo incident-match` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe incident-match` shows the input and result schemas.
