# Check an intake question against its purpose

<!-- BEGIN GENERATED: usage -->

Does question ask only for what purpose needs, avoiding unrelated personal detail?

Use when: You are drafting or reviewing intake form questions and want a check that each one collects only what its stated purpose requires.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { intakeQuestionFit } from 'jev-recipes/intake-question-fit';

const result = await intakeQuestionFit({
  question:
    'To schedule your flu shot, please tell us your date of birth, your insurance provider and member ID, and whether you have ever been treated for depression or anxiety.',
  purpose: 'Schedule a routine flu shot appointment and verify insurance coverage for the visit.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo intake-question-fit`.

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
  "probability": 0.06,
  "confidence": 0.94,
  "verdict": "overreaches"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`question-relevance`](../question-relevance/README.md): Use question-relevance to check whether a question is on topic for a conversation rather than scoped to a data-collection purpose.
- [`instruction-fit`](../instruction-fit/README.md): Use instruction-fit to check whether a drafted question follows the form-writing instructions you gave.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `question`      | Yes      | string                       |
| `purpose`       | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `fits` when Jev's yes probability is at least 0.5 and `overreaches` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `overreaches` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict is about fit between the question and the purpose you supply, so its usefulness depends on writing the purpose precisely; a purpose of "general intake" would justify nearly any question. It does not determine whether collecting the information is lawful, whether consent or a notice is required, or whether a minimum-necessary standard is met; those are compliance decisions for your privacy team and application rules. A question can fit its purpose and still be badly worded, so pair this check with a readability or tone check when drafting forms.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo intake-question-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe intake-question-fit` to inspect the input and result schemas.
