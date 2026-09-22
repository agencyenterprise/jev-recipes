# Check information freshness needs

<!-- BEGIN GENERATED: usage -->

Does question require a current or time-specific state that can change, or stable conceptual knowledge?

Use when: You need to know whether a question depends on current or changing information.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { freshnessNeeded } from 'jev-recipes/freshness-needed';

const result = await freshnessNeeded({
  question: 'Is the API experiencing an outage right now?',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo freshness-needed`.

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
  "verdict": "current",
  "confidence": 0.96,
  "probabilities": {
    "current": 1,
    "stable": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`fact-stability`](../fact-stability/README.md): Use fact-stability to assess a particular fact rather than a question.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `question`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict   | Meaning                                                                       |
| --------- | ----------------------------------------------------------------------------- |
| `current` | The answer depends on current or explicitly time-specific facts.              |
| `stable`  | The question asks for general concepts that do not depend on a current state. |
| `unclear` | The intended time sensitivity cannot be determined.                           |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Does not check timestamps, determine whether a source is up to date, or retrieve current information.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo freshness-needed` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe freshness-needed` shows the input and result schemas.
