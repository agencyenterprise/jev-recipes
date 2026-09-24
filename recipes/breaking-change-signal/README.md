# Detect breaking changes

<!-- BEGIN GENERATED: usage -->

Does change indicate a change that would break existing callers, integrations, stored data, or documented behavior?

Use when: You need to flag changes that require a major version bump, a migration note, or downstream coordination before they merge.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { breakingChangeSignal } from 'jev-recipes/breaking-change-signal';

const result = await breakingChangeSignal({
  change:
    'Rename the userId field in the /v1/orders response to customerId and remove the deprecated legacyStatus field from the same payload.',
  context: 'Public REST API consumed by three partner integrations and the mobile app.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo breaking-change-signal`.

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
  "verdict": "breaking"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`change-meaning`](../change-meaning/README.md): Use change-meaning to decide whether an edit to documentation or contract text alters its meaning.
- [`instruction-conflict`](../instruction-conflict/README.md): Use instruction-conflict when a change may disagree with an existing documented rule or requirement.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `change`        | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

`verdict` is `breaking` when Jev's yes probability is at least 0.5 and `compatible` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `compatible` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. A sensible default for review is to treat the change as breaking until a person confirms otherwise.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe reads the change as described and cannot inspect the code, its callers, or stored data, so a description that omits a removed field yields `compatible`. It flags incompatibility with existing behavior, not whether that behavior was correct: a fix that restores documented behavior grades `compatible` even if some caller relied on the bug. Version bumps, deprecation windows, and migration notes are application decisions.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo breaking-change-signal` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe breaking-change-signal` to inspect the input and result schemas.
