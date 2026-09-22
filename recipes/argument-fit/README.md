# Check argument meaning

<!-- BEGIN GENERATED: usage -->

Does proposedValue for argument express the intended value in request and context?

Use when: You need to check whether a proposed argument value matches the user request.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { argumentFit } from 'jev-recipes/argument-fit';

const result = await argumentFit({
  request: 'Search closed incidents only.',
  argument: 'Incident status filter',
  proposedValue: 'open',
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo argument-fit`.

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
  "verdict": "conflicts",
  "confidence": 0.96,
  "probabilities": {
    "fits": 0,
    "conflicts": 1,
    "unclear": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`tool-fit`](../tool-fit/README.md): Use tool-fit to check the tool capability before choosing its arguments.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `request`       | Yes      | string                       |
| `argument`      | Yes      | string                       |
| `proposedValue` | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors.

## Result

| Verdict     | Meaning                                                         |
| ----------- | --------------------------------------------------------------- |
| `fits`      | The proposed value matches the stated intent for this argument. |
| `conflicts` | The proposed value contradicts the stated intent.               |
| `unclear`   | The intended value is missing or ambiguous.                     |

The result includes `verdict`, `confidence`, and all choice `probabilities`. `unclear` always requires review, even at high confidence. Other verdicts can be ready, including negative assessments.

Results include model and token usage. Decisions below `minConfidence` require review. Inspect the outcome as well as the status.

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Does not validate schemas, compare identifiers, or enforce authorization. Check those deterministically before acting.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo argument-fit` shows the result offline. The fixture is an illustration, not an accuracy measurement. `npx jev-recipes describe argument-fit` shows the input and result schemas.
