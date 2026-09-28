# Decide whether an event should wake a waiting agent

<!-- BEGIN GENERATED: usage -->

Should event wake an agent that is paused until waitingFor happens: wake now, keep waiting, or ignore it as unrelated?

Use when: A paused or sleeping agent receives a timer tick, webhook, message, or file change and you must decide whether to resume its model loop.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { wakeGate } from 'jev-recipes/wake-gate';

const result = await wakeGate({
  waitingFor:
    'The CI pipeline for pull request #418 finishes, so the agent can read the results and either merge or fix failures.',
  event:
    'GitHub webhook: check_suite completed for PR #418 with conclusion "failure". 2 of 14 jobs failed: unit-tests (node 22) and lint.',
  context: 'The agent opened PR #418 twenty minutes ago and paused until CI completes.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo wake-gate`.

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
  "verdict": "wake",
  "confidence": 0.95,
  "probabilities": {
    "wake": 0.95,
    "not_yet": 0.02,
    "unrelated": 0.01,
    "unclear": 0.02
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`goal-drift`](../goal-drift/README.md): Use goal-drift to check whether a resumed agent's next step still serves its goal.
- [`progress-stall`](../progress-stall/README.md): Use progress-stall to detect an agent that keeps waking without making progress.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                        |
| --------------- | -------- | ---------------------------- |
| `waitingFor`    | Yes      | string                       |
| `event`         | Yes      | string                       |
| `context`       | No       | string                       |
| `minConfidence` | No       | number; minimum 0; maximum 1 |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas. `context` is optional and is omitted from the request when absent.

## Result

`verdict` is `wake`, `not_yet`, `unrelated`, or `unclear`. A `wake` result means the resumed agent should read the event and re-plan; `not_yet` means keep sleeping; `unrelated` means the event can be dropped without touching the agent. Only `unclear` and low-confidence results are `review`; treat review as `not_yet` unless the event is cheap to inspect.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

**Unknown response origin; experimental.**

No verified live measurement is available. Saved fixture or unknown-origin results do not establish model accuracy.

<!-- END GENERATED: accuracy -->

## Reuse and calls

Uses the shared choice helper for the Jev call and response parsing. This folder owns its question, verdict criteria, and review policy. A live invocation makes one logical Jev request.

## Limits

Pass one event per call. Batch pending events in your own code, or combine them into one event text when they arrive together. If the wait condition has a deadline, include the current time and the deadline in context; the recipe does not track time on its own.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo wake-gate` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe wake-gate` to inspect the input and result schemas.
