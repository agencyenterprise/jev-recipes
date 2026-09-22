# Check reply commitments

<!-- BEGIN GENERATED: usage -->

Does reply promise actions or outcomes beyond allowedCommitments?

Use when: You need to catch commitments in a reply that exceed what is allowed.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { promiseCheck } from 'jev-recipes/promise-check';

const result = await promiseCheck({
  reply: 'Your refund is guaranteed.',
  allowedCommitments: 'We may promise to review a refund request. We cannot promise approval.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo promise-check`.

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
  "verdict": "unsupported",
  "confidence": 0.96,
  "probabilities": {
    "within_commitments": 0,
    "unsupported": 1,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`action-scope`](../action-scope/README.md): Use action-scope to check a proposed action against the requested work.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field                | Required | Shape                        |
| -------------------- | -------- | ---------------------------- |
| `reply`              | Yes      | string                       |
| `allowedCommitments` | Yes      | string                       |
| `minConfidence`      | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict              | Meaning                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `within_commitments` | Every promise is permitted by the supplied commitments, or the reply contains no promise. |
| `unsupported`        | At least one promise exceeds or contradicts the supplied commitments.                     |
| `unclear`            | The wording or allowed commitments leave a promise ambiguous.                             |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Reviews expressed promises. It does not approve refunds, establish contractual obligations, or execute actions.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo promise-check` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe promise-check` shows the input and result schemas.
