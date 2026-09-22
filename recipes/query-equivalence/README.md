# Compare question meaning

<!-- BEGIN GENERATED: usage -->

Do firstQuestion and secondQuestion request the same information under the same stated conditions?

Use when: You need to check whether two questions ask for the same information.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { queryEquivalence } from 'jev-recipes/query-equivalence';

const result = await queryEquivalence({
  firstQuestion: 'How can I reset my password?',
  secondQuestion: 'What should I do if I forgot my password?',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo query-equivalence`.

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
  "verdict": "equivalent",
  "confidence": 0.96,
  "probabilities": {
    "equivalent": 1,
    "related": 0,
    "different": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`cache-match`](../cache-match/README.md): Use cache-match when deciding whether an existing answer can be reused.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field            | Required | Shape                        |
| ---------------- | -------- | ---------------------------- |
| `firstQuestion`  | Yes      | string                       |
| `secondQuestion` | Yes      | string                       |
| `context`        | No       | string                       |
| `minConfidence`  | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict      | Meaning                                                                    |
| ------------ | -------------------------------------------------------------------------- |
| `equivalent` | Both questions request the same information with compatible conditions.    |
| `related`    | They share a topic but differ in a material information need or condition. |
| `different`  | They request different subjects or unrelated information.                  |
| `unclear`    | The intended meanings cannot be resolved.                                  |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Compares supplied questions. It does not rewrite them or establish that an existing answer is still valid.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo query-equivalence` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe query-equivalence` shows the input and result schemas.
