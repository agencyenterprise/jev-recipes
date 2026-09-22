# Assess fact stability

<!-- BEGIN GENERATED: usage -->

Is fact about an enduring or historical attribute, or a state that is expected to change?

Use when: You need to assess whether a fact is enduring or likely to change over time.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { factStability } from 'jev-recipes/fact-stability';

const result = await factStability({
  fact: 'The API is currently experiencing an outage.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo fact-stability`.

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
  "verdict": "changeable",
  "confidence": 0.96,
  "probabilities": {
    "stable": 0,
    "changeable": 1,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`freshness-needed`](../freshness-needed/README.md): Use freshness-needed to decide whether a question needs current information.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `fact`          | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict      | Meaning                                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| `stable`     | The fact describes a historical event, definition, or enduring attribute unlikely to change in the relevant context. |
| `changeable` | The fact describes a current state, preference, configuration, or other information that can change.                 |
| `unclear`    | The kind or relevant timescale is not established.                                                                   |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Does not establish truth, expiration times, or freshness. Refresh policies and timestamp comparisons belong in code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo fact-stability` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe fact-stability` shows the input and result schemas.
