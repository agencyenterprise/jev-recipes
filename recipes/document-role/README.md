# Identify document purpose

<!-- BEGIN GENERATED: usage -->

What is the primary purpose of document?

Use when: You need to identify the primary purpose of a document.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { documentRole } from 'jev-recipes/document-role';

const result = await documentRole({
  document:
    'New in this release: workspace exports now include archived reports. Fixed an invoice download error.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo document-role`.

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
  "verdict": "release_note",
  "confidence": 0.96,
  "probabilities": {
    "policy": 0,
    "tutorial": 0,
    "reference": 0,
    "troubleshooting": 0,
    "release_note": 1,
    "other": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`context-role`](../context-role/README.md): Use context-role to assess how a passage relates to a specific question.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `document`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict           | Meaning                                                        |
| ----------------- | -------------------------------------------------------------- |
| `policy`          | Defines rules, permissions, requirements, or allowed behavior. |
| `tutorial`        | Teaches a task through a guided sequence.                      |
| `reference`       | Describes interfaces, features, or facts for lookup.           |
| `troubleshooting` | Helps diagnose or resolve a described problem.                 |
| `release_note`    | Describes changes in a release or update.                      |
| `other`           | Has a clear purpose outside the listed roles.                  |
| `unclear`         | The primary role cannot be established.                        |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Returns one primary role from the supplied text. It does not read files, split mixed documents, or create an index.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo document-role` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe document-role` shows the input and result schemas.
