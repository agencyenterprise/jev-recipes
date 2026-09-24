# Identify expressed emotion

<!-- BEGIN GENERATED: usage -->

What primary emotion does the wording of message express?

Use when: You need a coarse emotion label for a message to route it, annotate a dataset, or adapt a reply.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { emotionKind } from 'jev-recipes/emotion-kind';

const result = await emotionKind({
  message:
    "I am really worried about tomorrow's deployment. If the migration fails again we lose the whole weekend and I do not know how to explain that to the client.",
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo emotion-kind`.

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
  "verdict": "fear",
  "confidence": 0.85,
  "probabilities": {
    "joy": 0,
    "anger": 0.02,
    "sadness": 0.05,
    "fear": 0.85,
    "surprise": 0.01,
    "neutral": 0.01,
    "unclear": 0.06
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`frustration-signal`](../frustration-signal/README.md): Use frustration-signal for a categorical read on expressed frustration specifically.
- [`uncertainty-expression`](../uncertainty-expression/README.md): Use uncertainty-expression to detect hedging and doubt rather than emotion.

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

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. `context` is optional and is omitted from the request when absent.

## Result

| Verdict    | Meaning                                                                               |
| ---------- | ------------------------------------------------------------------------------------- |
| `joy`      | The wording expresses happiness, delight, gratitude, or enthusiasm.                   |
| `anger`    | The wording expresses anger, irritation, or hostility.                                |
| `sadness`  | The wording expresses sadness, disappointment, grief, or discouragement.              |
| `fear`     | The wording expresses fear, worry, anxiety, or dread.                                 |
| `surprise` | The wording expresses surprise, astonishment, or disbelief.                           |
| `neutral`  | The wording expresses no discernible emotion.                                         |
| `unclear`  | The wording is ambiguous between emotions or depends on context that is not supplied. |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including `neutral`.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Labels expressed wording, not the writer's internal emotional state, sincerity, or mood over time. A message that reads as angry may come from someone who is not, and a flat message may hide strong feeling. Mixed emotions collapse to the dominant one or to `unclear`; the recipe does not return several labels or an intensity. Use [`frustration-signal`](../frustration-signal/README.md) when you only need a categorical read on frustration.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo emotion-kind` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe emotion-kind` shows the input and result schemas.
