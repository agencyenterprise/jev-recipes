# Check whether a reply is needed

<!-- BEGIN GENERATED: usage -->

Does message require a substantive reply in context?

Use when: You need to decide whether a message calls for a substantive reply.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { responseNeeded } from 'jev-recipes/response-needed';

const result = await responseNeeded({
  message: 'Thanks, that solved it!',
  context: 'The assistant provided password reset instructions.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo response-needed`.

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
  "verdict": "no_reply_needed",
  "confidence": 0.96,
  "probabilities": {
    "reply_needed": 0,
    "no_reply_needed": 1,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`turn-intent`](../turn-intent/README.md): Use turn-intent to classify the message purpose in more detail.

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

| Verdict           | Meaning                                                                        |
| ----------------- | ------------------------------------------------------------------------------ |
| `reply_needed`    | The message requests or requires substantive follow-through.                   |
| `no_reply_needed` | The message closes or acknowledges the exchange without an unresolved request. |
| `unclear`         | The supplied context does not establish whether a response is expected.        |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses conversational need. Channel-specific response obligations and customer service policies remain application rules.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo response-needed` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe response-needed` shows the input and result schemas.
