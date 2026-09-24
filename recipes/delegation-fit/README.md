# Check delegation fit

<!-- BEGIN GENERATED: usage -->

Does subtask fall within the capabilities described for the delegate?

Use when: You need a yes/no check before handing a subtask to a specific sub-agent or worker whose tools, access, or permissions are described in text.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { delegationFit } from 'jev-recipes/delegation-fit';

const result = await delegationFit({
  subtask:
    'Find the three most recent production incidents involving the checkout service, pull their postmortem documents from the wiki, and summarize the root causes in a short table.',
  capabilities:
    'Read-only access to the code repository and its git history. Can run the test suite and static analysis. No network access, no wiki or ticketing access, no production logs.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo delegation-fit`.

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
  "verdict": "outside"
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`tool-fit`](../tool-fit/README.md): Use tool-fit to check whether a single tool matches a request, rather than whether a whole subtask matches a delegate.
- [`route`](../route/README.md): Use route to choose among several named delegates at once when more than one might fit.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `subtask`       | Yes      | string                       |
| `capabilities`  | Yes      | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

`verdict` is `fits` when Jev's yes probability is at least 0.5 and `outside` otherwise. `probability` is that yes probability. `confidence` is the probability of the chosen side, so a 0.1 yes probability yields `outside` with 0.9 confidence.

A result is `ready` when `confidence` meets `minConfidence`. Otherwise it is `review`. Treat a review result as unknown and fall back to your safe default, such as keeping the subtask with the orchestrator or asking the delegate to confirm before starting.

## Reuse and calls

Uses the shared gate helper, a single yes/no question. This folder owns the question wording, the outcome descriptions, and the review policy. A live invocation makes one logical Jev request.

## Limits

The recipe judges the subtask against `capabilities` exactly as written, so an incomplete capability description produces `outside` verdicts for work the delegate could actually do. It says whether the subtask is in scope, not whether the delegate would do it well or how long it would take. To match one tool to one request use [`tool-fit`](../tool-fit/README.md); to choose among several delegates in one call use [`route`](../route/README.md).

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo delegation-fit` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe delegation-fit` to inspect the input and result schemas.
