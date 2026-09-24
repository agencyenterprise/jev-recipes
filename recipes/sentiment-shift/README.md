# Compare sentiment across messages

<!-- BEGIN GENERATED: usage -->

How does the sentiment expressed in laterMessage compare with earlierMessage from the same person?

Use when: You need to know whether a customer's expressed sentiment moved during a conversation, for example after an agent reply or a handoff.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { sentimentShift } from 'jev-recipes/sentiment-shift';

const result = await sentimentShift({
  earlierMessage:
    'I have been waiting three days for a reply and my order still has not shipped. This is ridiculous.',
  laterMessage:
    'Thanks for sorting that out so quickly, the tracking number just arrived. Really appreciate it.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo sentiment-shift`.

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
  "verdict": "improved",
  "confidence": 0.94,
  "probabilities": {
    "improved": 0.94,
    "unchanged": 0.02,
    "worsened": 0.01,
    "unclear": 0.03
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`frustration-signal`](../frustration-signal/README.md): Use frustration-signal for a categorical read on frustration in a single message.
- [`resolution-check`](../resolution-check/README.md): Use resolution-check to decide whether the customer reported the issue resolved.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field            | Required | Shape                        |
| ---------------- | -------- | ---------------------------- |
| `earlierMessage` | Yes      | string                       |
| `laterMessage`   | Yes      | string                       |
| `minConfidence`  | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict     | Meaning                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| `improved`  | The wording of laterMessage expresses a clearly more positive sentiment than earlierMessage.                              |
| `unchanged` | The wording of laterMessage expresses about the same sentiment as earlierMessage, whether positive, negative, or neutral. |
| `worsened`  | The wording of laterMessage expresses a clearly more negative sentiment than earlierMessage.                              |
| `unclear`   | The supplied messages do not establish a clear comparison of expressed sentiment.                                         |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including `worsened`.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Compares expressed wording in two messages, not the person's actual feelings or the state of their issue. A shift does not establish its cause; the recipe does not see the turns between the two messages, so pair the verdict with that history in application code. Use [`frustration-signal`](../frustration-signal/README.md) when you need a read on a single message.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo sentiment-shift` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe sentiment-shift` shows the input and result schemas.
