# Compare two tools for a task

<!-- BEGIN GENERATED: usage -->

Which of firstTool and secondTool, as described by their stated capabilities, better fits task?

Use when: An agent has two candidate tools for one step and needs a head-to-head preference based on the capability descriptions it has been given.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { toolCompare } from 'jev-recipes/tool-compare';

const result = await toolCompare({
  task: 'Extract every line-item table from a batch of 40 scanned supplier invoices, delivered as image-only PDFs, into CSV rows with the page number each row came from.',
  firstTool:
    'pdf_text_extract: returns the embedded text layer of a PDF as a single plain-text string per page. Does not perform OCR and returns empty output for scanned or image-only pages.',
  secondTool:
    'document_ocr_tables: runs OCR on scanned or image-based PDFs and returns detected tables as structured rows, each with cell text, a table index, and the source page number.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo tool-compare`.

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
  "verdict": "second",
  "confidence": 0.93,
  "probabilities": {
    "first": 0.02,
    "second": 0.93,
    "tie": 0.02,
    "neither": 0.02,
    "unclear": 0.01
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`tool-fit`](../tool-fit/README.md): Use tool-fit to check whether a single tool can perform the task at all.
- [`action-compare`](../action-compare/README.md): Use action-compare to compare two next steps against a goal, rather than two tools against one task.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `task`          | Yes      | string                       |
| `firstTool`     | Yes      | string                       |
| `secondTool`    | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `first`, `second`, `tie`, `neither`, or `unclear`. `first` and `second` name the preferred candidate. `tie` means both fit about equally. `neither` means no candidate fits, which is a confident answer rather than a failure.

A result is `ready` when `confidence` meets `minConfidence` and the verdict is not `unclear`. `probabilities` covers all five outcomes.

## Reuse and calls

Uses the shared comparison helper, which fixes the five outcomes and tells Jev that presentation order is irrelevant. This folder owns the question wording and the four outcome descriptions. A live invocation makes one logical Jev request.

## Limits

The comparison is between the two capability descriptions as written, so a tool that is under-described will lose to one that is over-described even if it would work better in practice. The recipe does not call either tool, and a preferred tool can still be unavailable, unauthorized, or too costly; check those in application code before dispatching. Tools not supplied are not considered, so `neither` means only that these two descriptions do not cover the task.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo tool-compare` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe tool-compare` to inspect the input and result schemas.
