# Label the disclosures in an answer

<!-- BEGIN GENERATED: usage -->

Which of these does draft include: stated uncertainty, stated limitations, cited sources, stated assumptions?

Use when: You need to audit or gate model answers on transparency habits in a single call, for evaluation sets or response policies.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { answerDisclosures } from 'jev-recipes/answer-disclosures';

const result = await answerDisclosures({
  draft:
    'Based on the 2024 pricing page, the Team plan includes SSO. I am not certain this still applies to accounts created before March, and I have not checked the enterprise tier. I am assuming you are on a monthly plan.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo answer-disclosures`.

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
  "detected": ["statesUncertainty", "statesLimitations", "citesSources", "statesAssumptions"],
  "labels": {
    "statesUncertainty": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.95,
      "confidence": 0.95
    },
    "statesLimitations": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.9,
      "confidence": 0.9
    },
    "citesSources": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.88,
      "confidence": 0.88
    },
    "statesAssumptions": {
      "status": "ready",
      "verdict": "present",
      "probability": 0.94,
      "confidence": 0.94
    }
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`uncertainty-expression`](../uncertainty-expression/README.md): Use uncertainty-expression to grade how certain a single claim sounds.
- [`citation-needed`](../citation-needed/README.md): Use citation-needed to decide whether a statement requires evidence under your rules.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `draft`         | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`labels` holds one check per disclosure: `statesUncertainty`, `statesLimitations`, `citesSources`, and `statesAssumptions`. Each check has a `verdict` of `present` or `absent`, the yes `probability`, `confidence` for the chosen side, and its own `status`. `detected` lists the present disclosures in declaration order.

The overall `status` is `review` when any single label falls below `minConfidence`. Labels that are individually `ready` remain usable in that case.

## Reuse and calls

Uses the shared labels helper, which places one yes/no question per disclosure in a single Jev request. This folder owns the four questions and their outcome descriptions. A live invocation makes one logical Jev request.

## Limits

The recipe reports whether each disclosure appears, not whether it is warranted. An answer can hedge about something it should state plainly, or cite a source that does not exist. Pair `citesSources` with a link or reference check in code. For the strength of hedging on one claim use [`uncertainty-expression`](../uncertainty-expression/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo answer-disclosures` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe answer-disclosures` to inspect the input and result schemas.
