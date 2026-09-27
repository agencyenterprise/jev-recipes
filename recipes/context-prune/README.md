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

Measured on 36 golden cases against `jev-1.13.0`: **53% accurate** overall (contested cases 20%, adversarial cases 50%).

A case counts as correct only when every item in it is right. Across the 172 individual items, **88%** were judged correctly. A case's confidence is the minimum over its items, so the threshold table below is conservative for batches.

| `minConfidence` | Deferred to review | Accuracy of ready results |
| --------------- | ------------------ | ------------------------- |
| 0.5             | 0%                 | 53%                       |
| 0.6             | 31%                | 68%                       |
| 0.7             | 81%                | 86%                       |
| 0.8             | 92%                | 100%                      |
| 0.9             | 100%               | n/a                       |
| 0.95            | 100%               | n/a                       |

The lowest threshold reaching 95% accuracy on ready results is 0.75.

Rerun with `npm run eval -- context-prune`; the full report, including misses, is in [evals/results/context-prune.json](../../evals/results/context-prune.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->

## Reuse and calls

Builds one request with one yes/no question per item, sharing the objective across them. One live invocation makes one Jev request. This folder owns the retention question, the safe-default policy, and the aggregation.

## Limits

The judgment is per item. Two items that only matter together will each look weak on their own; combine them into one item when that is a concern.

A vague objective pushes everything toward `drop`. Say what the agent still has to do, including verification and cleanup steps.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo context-prune` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe context-prune` to inspect the input and result schemas.
