# Check citation requirements

<!-- BEGIN GENERATED: usage -->

Do citationRules require evidence for statement?

Use when: You need to decide whether a statement requires a citation under your rules.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { citationNeeded } from 'jev-recipes/citation-needed';

const result = await citationNeeded({
  statement: 'Reset links expire after 30 minutes.',
  citationRules:
    'Cite documentation for claims about product behavior. Greetings need no citations.',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo citation-needed`.

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
  "verdict": "needed",
  "confidence": 0.96,
  "probabilities": {
    "needed": 1,
    "unnecessary": 0,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`citation-match`](../citation-match/README.md): Use citation-match to find supporting passages once a citation is needed.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `statement`     | Yes      | string                       |
| `citationRules` | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict       | Meaning                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `needed`      | The statement falls within a category requiring citation under the supplied rules.               |
| `unnecessary` | The supplied rules explicitly exempt this statement or clearly do not require a citation for it. |
| `unclear`     | The rules or statement do not establish whether a citation is required.                          |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Assesses a supplied citation policy; does not find sources or determine whether a statement is true.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo citation-needed` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe citation-needed` shows the input and result schemas.
