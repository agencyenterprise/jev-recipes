# Check result plausibility

<!-- BEGIN GENERATED: usage -->

Is result a plausible, internally consistent answer to request rather than an error, placeholder, empty, or unrelated output dressed as data?

Use when: You need a yes/no check on a tool or subagent output before an agent trusts it, stores it, or builds the next step on it.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { resultPlausibility } from 'jev-recipes/result-plausibility';

const result = await resultPlausibility({
  request: 'List the three most recent production deploys with their commit SHAs and deploy times.',
  result:
    '[{"id": 1, "sha": "abc123", "deployed_at": "2024-01-01T00:00:00Z"}, {"id": 2, "sha": "abc123", "deployed_at": "2024-01-01T00:00:00Z"}, {"id": 3, "sha": "abc123", "deployed_at": "2024-01-01T00:00:00Z"}]',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo result-plausibility`.

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
  "probability": 0.07,
  "confidence": 0.9299999999999999,
  "verdict": "implausible"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`result-usefulness`](../result-usefulness/README.md): Use result-usefulness once a result is plausible to decide whether it actually carries information the task needs.
- [`result-outcome`](../result-outcome/README.md): Use result-outcome to classify what a result reports happened, such as success or failure, rather than whether it is real.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `request`       | Yes      | string                       |
| `result`        | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `plausible` when Jev's yes probability is at least 0.5 and `implausible` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.07 yes probability yields `implausible` with 0.93 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default, such as re-running the tool or refusing to build on the output.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe checks whether a result looks like a real answer: consistent with itself, about what was asked, and not an error, template, or filler. It does not check the values against outside knowledge, so a plausible result can still be wrong. A search that genuinely found nothing is plausible when the result says so and implausible when it returns blank output. Use [`result-usefulness`](../result-usefulness/README.md) to ask whether a plausible result carries what the task needs, and [`result-outcome`](../result-outcome/README.md) to classify what it reports happened.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo result-plausibility` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe result-plausibility` to inspect the input and result schemas.
