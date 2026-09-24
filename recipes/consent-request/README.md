# Detect an explicit consent request

<!-- BEGIN GENERATED: usage -->

Does text explicitly ask the reader for agreement or permission before something proceeds?

Use when: You need a yes/no check that a message, prompt, or notice actually asks for consent instead of announcing or assuming it before an action proceeds.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { consentRequest } from 'jev-recipes/consent-request';

const result = await consentRequest({
  text: 'Before we enable call recording on your account, we need your permission. Do you agree to have your support calls recorded for quality review? Reply YES to agree or NO to keep recording off.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo consent-request`.

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
  "verdict": "requested"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`confirmation-match`](../confirmation-match/README.md): Use confirmation-match to check whether a reply actually grants the consent that was requested.
- [`promise-check`](../promise-check/README.md): Use promise-check to detect commitments the text makes to the reader rather than permission it asks of them.

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

`verdict` is `requested` when Jev's yes probability is at least 0.5 and `absent` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `absent` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default, such as holding the action until a person checks the wording.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe detects that the text asks for agreement or permission. It does not judge whether the request is specific, informed, or freely given enough to count as valid consent under any regulation, and it does not know whether the action actually waited for the answer. Notices that say continuing implies agreement are `absent`, since they inform rather than ask. To check whether a reply then grants the consent, use [`confirmation-match`](../confirmation-match/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo consent-request` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe consent-request` to inspect the input and result schemas.
