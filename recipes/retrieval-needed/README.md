# Check whether retrieval is needed

<!-- BEGIN GENERATED: usage -->

Does request require facts beyond context?

Use when: You need to decide whether answering requires facts beyond the current context.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { retrievalNeeded } from 'jev-recipes/retrieval-needed';

const result = await retrievalNeeded({
  request: 'Summarize this policy in one sentence.',
  context: 'Customers may cancel their subscription from Account settings.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo retrieval-needed`.

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
  "verdict": "unnecessary",
  "confidence": 0.96,
  "probabilities": {
    "needed": 0,
    "unnecessary": 1,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`freshness-needed`](../freshness-needed/README.md): Use freshness-needed to check whether those facts must be current.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `request`       | Yes      | string                       |
| `context`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict       | Meaning                                                                       |
| ------------- | ----------------------------------------------------------------------------- |
| `needed`      | Answering the request requires information missing from the supplied context. |
| `unnecessary` | The requested work can be completed using only the supplied context.          |
| `unclear`     | The request is too ambiguous to establish its information needs.              |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses information needs without searching. A no-retrieval decision does not establish source truth.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo retrieval-needed` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe retrieval-needed` shows the input and result schemas.
