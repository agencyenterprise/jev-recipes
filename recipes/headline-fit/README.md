# Check headline fit

<!-- BEGIN GENERATED: usage -->

Does headline accurately represent what body says, without promising more than the body delivers?

Use when: You publish or review articles and want to catch headlines that overstate, contradict, or misdirect from the body before they go live.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { headlineFit } from 'jev-recipes/headline-fit';

const result = await headlineFit({
  headline: 'New Study Proves Coffee Cures Depression',
  body: 'A small observational study of 212 adults published this week found that participants who drank two or more cups of coffee a day reported fewer depressive symptoms over a six-month period. The authors caution that the design cannot establish causation and that unmeasured lifestyle factors may explain the association. They call for randomized trials before drawing clinical conclusions.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo headline-fit`.

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
  "probability": 0.08,
  "confidence": 0.92,
  "verdict": "misleading"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`summary-coverage`](../summary-coverage/README.md): Use summary-coverage to judge whether a longer summary captures the main points of a source.
- [`attribution-match`](../attribution-match/README.md): Use attribution-match to check whether a quoted claim is attributed to the source that actually made it.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `headline`      | Yes      | string                       |
| `body`          | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `accurate` when Jev's yes probability is at least 0.5 and `misleading` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `misleading` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The verdict compares the headline to the supplied body and nothing else, so an accurate headline over a false body still reads as accurate. It does not grade style, length, search performance, or emotional appeal; use a separate check for those. Publishing rules such as character limits, banned words, and required disclaimers belong in application code.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo headline-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe headline-fit` to inspect the input and result schemas.
