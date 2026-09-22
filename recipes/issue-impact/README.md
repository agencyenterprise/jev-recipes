# Assess reported issue impact

<!-- BEGIN GENERATED: usage -->

What practical impact does message explicitly describe?

Use when: You need to assess the practical impact explicitly described in a support message.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { issueImpact } from 'jev-recipes/issue-impact';

const result = await issueImpact({
  message: 'I cannot sign in, so I cannot access any of my reports.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo issue-impact`.

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
  "verdict": "blocked",
  "confidence": 0.96,
  "probabilities": {
    "blocked": 1,
    "degraded": 0,
    "cosmetic": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`urgency-signal`](../urgency-signal/README.md): Use urgency-signal to detect requests for immediate attention.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `message`       | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict    | Meaning                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| `blocked`  | The customer reports being unable to perform the intended task with no described working alternative. |
| `degraded` | The task remains possible but with a meaningful limitation or workaround.                             |
| `cosmetic` | The reported problem concerns appearance without a described functional limitation.                   |
| `unclear`  | The practical impact is not established by the supplied report.                                       |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses reported impact, not verified system severity. Service commitments and escalation thresholds remain application rules.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo issue-impact` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe issue-impact` shows the input and result schemas.
