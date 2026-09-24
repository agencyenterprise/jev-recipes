# Check response length fit

<!-- BEGIN GENERATED: usage -->

Is the length and detail of response proportionate to what request asks for?

Use when: You need to catch answers that are padded or truncated relative to the question before sending or scoring them.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { lengthFit } from 'jev-recipes/length-fit';

const result = await lengthFit({
  request: 'What is the capital of Australia? One word is fine.',
  response:
    'The capital of Australia is Canberra. Many people assume it is Sydney or Melbourne, since those are the largest cities, but Canberra was purpose-built as a compromise between the two and became the seat of government in 1927. It sits in the Australian Capital Territory, has a population of around 460,000, and is home to Parliament House, the High Court, and many national institutions.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo length-fit`.

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
  "verdict": "long",
  "confidence": 0.9,
  "probabilities": {
    "short": 0.01,
    "fits": 0.07,
    "long": 0.9,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`audience-fit`](../audience-fit/README.md): Use audience-fit to check that the response matches who is asking, not how much they asked for.
- [`answer-relevance`](../answer-relevance/README.md): Use answer-relevance to check that the response addresses the question at all.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `request`       | Yes      | string                       |
| `response`      | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

| Verdict   | Meaning                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------- |
| `short`   | The response omits detail that the request asks for or clearly needs.                           |
| `fits`    | The response gives about the amount of detail the request asks for.                             |
| `long`    | The response adds padding, repetition, or detail the request did not ask for and does not need. |
| `unclear` | The request does not establish how much detail is wanted.                                       |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including `short` and `long`.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

The recipe judges proportion between the request and the response. It does not check whether the response is correct, whether its substance is complete, or whether the tone suits the reader. An explicit length instruction in the request outweighs the scope of the question. Hard word or character limits are cheaper to enforce in code; use this recipe for the judgment of whether the detail matches what was asked.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo length-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe length-fit` to inspect the input and result schemas.
