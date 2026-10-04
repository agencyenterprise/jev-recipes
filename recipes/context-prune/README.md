# Prune agent context

<!-- BEGIN GENERATED: usage -->

Which of items, earlier tool results and messages in an agent session, are still needed to finish objective, so the rest can be dropped from context?

Use when: An agent session is growing long and you want to drop stale tool output and messages before the next model turn without summarizing what must stay verbatim.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { contextPrune } from 'jev-recipes/context-prune';

const result = await contextPrune({
  objective:
    'Fix the failing test in tests/auth.test.ts, which expects a 401 for expired tokens but receives a 500, then run the suite and commit.',
  items: [
    {
      id: 'ls-root',
      text: 'Tool result (ls): README.md package.json src tests docs node_modules',
    },
    {
      id: 'auth-source',
      text: "Tool result (cat src/auth.ts): export function verify(token) { const payload = jwt.verify(token, SECRET); if (payload.exp < Date.now()) throw new Error('expired'); return payload; }",
    },
    {
      id: 'readme',
      text: 'Tool result (cat README.md): # Acme API. Install with npm ci. Run with npm start. See docs/ for endpoints.',
    },
    {
      id: 'user-note',
      text: "User: don't touch the token format, other services depend on it.",
    },
    {
      id: 'test-output',
      text: "Tool result (npm test): FAIL tests/auth.test.ts > returns 401 for expired token. Expected 401, received 500. TypeError: Cannot read properties of undefined (reading 'status') at src/auth.ts:9",
    },
  ],
  recent:
    'The agent has read the failing test and the auth source and is about to edit src/auth.ts.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo context-prune`.

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
  "items": [
    {
      "id": "ls-root",
      "status": "ready",
      "verdict": "drop",
      "probability": 0.06,
      "confidence": 0.94
    },
    {
      "id": "auth-source",
      "status": "ready",
      "verdict": "keep",
      "probability": 0.95,
      "confidence": 0.95
    },
    {
      "id": "readme",
      "status": "ready",
      "verdict": "drop",
      "probability": 0.08,
      "confidence": 0.92
    },
    {
      "id": "user-note",
      "status": "ready",
      "verdict": "keep",
      "probability": 0.93,
      "confidence": 0.93
    },
    {
      "id": "test-output",
      "status": "ready",
      "verdict": "keep",
      "probability": 0.96,
      "confidence": 0.96
    }
  ],
  "keep": ["auth-source", "user-note", "test-output"],
  "drop": ["ls-root", "readme"],
  "evaluated": 5
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`rerank`](../rerank/README.md): Use rerank to order passages by relevance to a query rather than decide what an agent still needs.
- [`memory-value`](../memory-value/README.md): Use memory-value to decide whether a fact is worth storing long term.
- [`progress-stall`](../progress-stall/README.md): Use progress-stall to detect an agent that keeps reprocessing the same context.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `objective`     | Yes      | string                                             |
| `items`         | Yes      | { id, text }[]; at least 1 items; at most 50 items |
| `recent`        | No       | string                                             |
| `minConfidence` | No       | number; minimum 0; maximum 1                       |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

`objective` is the remaining work, stated concretely. `items` are earlier tool results and messages with unique ids and up to 50 entries. `recent` summarizes what the agent has just done, so items that were consumed already can be released.

## Result

Each entry in `items` has a `verdict` of `keep` or `drop`, the yes probability that the item is still needed, `confidence`, and its own `status`. `drop` lists the ids that are both judged unnecessary and `ready`; everything else, including uncertain items, is in `keep`. The result `status` is `review` when any item is uncertain, which is informational: `keep` and `drop` are already safe to apply.

`evaluated` is the number of items judged.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

**Current mixed-source measurement; experimental.**

Measured on 136 golden cases against `jev-1.13.0`: **90% accurate** overall (contested cases 20%, adversarial cases 97%).

Recorded 2026-10-04 with package 0.9.11, on the **development** split. Recipe fingerprint: `921cf6a3ced0031109478c77c8b5e84815b8b7637f5c8d3380d555b888a2e62f`.

Scoring revision: 2.

122/136 cases correct; 84 ready, 52 review, 0 failed. Accuracy among ready cases: 100%.

Latency: p50 104.17 ms, p95 156.63 ms. Usage: 171170 input tokens and 9040 output tokens across 136 logical requests.

Labels: unspecified (36 cases): Existing repository labels; independent review and original authorship were not recorded. author-synthetic (100 cases): AI-authored synthetic boundary cases for jev-recipes; labels have not had independent human review.

These authored cases are not independent human validation. Related variants are correlated; case-level confidence intervals can overstate independent evidence.

95% case-level accuracy interval: 83% to 94%.

A case counts as correct only when every item in it is right. Across the 472 individual items, **97%** were judged correctly.

| `minConfidence` | Deferred to review | Accuracy of ready results |
| --------------- | ------------------ | ------------------------- |
| 0.5             | 0%                 | 90%                       |
| 0.6             | 11%                | 95%                       |
| 0.7             | 22%                | 100%                      |
| 0.8             | 38%                | 100%                      |
| 0.9             | 93%                | 100%                      |
| 0.95            | 100%               | n/a                       |

The lowest threshold reaching 95% accuracy on ready results is 0.6.

Run `npm run eval -- context-prune` to save new results and update this guide. The full report, including misses, is in [evals/results/context-prune.json](../../evals/results/context-prune.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->

## Reuse and calls

Builds one request with one yes/no question per item, sharing the objective across them. One live invocation makes one Jev request. This folder owns the retention question, the safe-default policy, and the aggregation.

## Limits

The judgment is per item. Two items that only matter together will each look weak on their own; combine them into one item when that is a concern.

A vague objective pushes everything toward `drop`. Say what the agent still has to do, including verification and cleanup steps.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo context-prune` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe context-prune` to inspect the input and result schemas.

## Decision boundary

Keep active constraints and results that the remaining work still needs. Completion of a step does not make its output disposable. Drop an item only when the remaining task no longer needs it; uncertain items remain for review.
