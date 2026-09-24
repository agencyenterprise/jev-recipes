# Detect personal information

<!-- BEGIN GENERATED: usage -->

Does text contain information identifying a specific private individual?

Use when: You need a yes/no gate before storing, logging, sharing, or sending text that might contain personal data.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { piiPresence } from 'jev-recipes/pii-presence';

const result = await piiPresence({
  text: 'Hi, this is Dana Whitfield. My account number is 44-9921 and you can reach me at 555-0142 about the refund.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo pii-presence`.

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
  "probability": 0.96,
  "confidence": 0.96,
  "verdict": "present"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`injection-signal`](../injection-signal/README.md): Use injection-signal to screen the same text for instructions aimed at an AI agent.
- [`memory-scope`](../memory-scope/README.md): Use memory-scope to decide how narrowly a fact about a person should be stored.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `text`          | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `present` when Jev's yes probability is at least 0.5 and `absent` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `absent` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default, such as redacting or withholding the text.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe says whether identifying information is present, not where it is. Use a pattern-based redactor or an extraction step to locate spans. It judges identifiability semantically, so a first name alone is usually `absent` while a name with a phone number is `present`. Legal definitions of personal data differ by jurisdiction; encode the one you need in application policy.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo pii-presence` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe pii-presence` to inspect the input and result schemas.
