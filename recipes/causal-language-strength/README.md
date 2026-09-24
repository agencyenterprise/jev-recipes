# Grade the strength of causal language

<!-- BEGIN GENERATED: usage -->

How strong is the causal claim in the wording of statement, from no relationship claimed to causation stated as fact?

Use when: You are checking abstracts, press releases, or summaries of studies for causal overreach, so that wording can be compared with what the study design supports.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { causalLanguageStrength } from 'jev-recipes/causal-language-strength';

const result = await causalLanguageStrength({
  statement:
    'Adolescents who reported more screen time in the hour before bed also reported poorer sleep quality (r = 0.31, p < .001). Because the data are cross-sectional, our design does not permit causal conclusions.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo causal-language-strength`.

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
  "score": 1.09,
  "level": 1,
  "confidence": 0.9,
  "probabilities": {
    "0": 0.01,
    "1": 0.9,
    "2": 0.08,
    "3": 0.01,
    "4": 0
  },
  "causality": "association"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`causal-attribution`](../causal-attribution/README.md): Use causal-attribution to label whether an explanation blames the person or the situation, rather than how strongly any causal link is asserted.
- [`uncertainty-expression`](../uncertainty-expression/README.md): Use uncertainty-expression to grade how hedged a statement is overall, rather than the strength of its causal claim specifically.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `statement`     | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`causality` is one of `none`, `association`, `suggestive`, `hedged`, `asserted`, taken from the most likely rubric level. `level` is that level's index from 0 to 4. `score` is Jev's expected value across the rubric and can fall between levels; use it for ranking or thresholds where a single label loses information.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review` and still carries the graded values for inspection. `probabilities` is keyed by level index.

## Reuse and calls

Uses the shared score helper. This folder owns the question, the rubric wording, and the review policy. A live invocation makes one logical Jev request.

## Limits

The grade measures how strongly the words claim causation, not whether the claim is justified; a randomized trial may be described in associational language and an observational study in causal language. Comparing the grade against the study design is the reader's task, and the recipe does not read the design unless it is part of the statement. Each statement is graded alone, so checking a whole abstract or press release for the strongest claim means splitting it and taking the maximum in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo causal-language-strength` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe causal-language-strength` to inspect the input and result schemas.
