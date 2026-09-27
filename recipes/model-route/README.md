# Route a request to a model tier

<!-- BEGIN GENERATED: usage -->

Which of the described models should serve request, and how much reasoning effort does it need, decided in one call so a cheap model handles easy turns and a capable one handles hard turns?

Use when: An agent harness, gateway, or proxy chooses per request which LLM and thinking level to use, and you want that choice made in well under a second.

Install `jev-recipes` and set `TYPESAFE_API_KEY` in your server environment. See the [quick start](../../README.md#use-a-recipe).

```ts
import { modelRoute } from 'jev-recipes/model-route';

const result = await modelRoute({
  request: 'Rename the variable `usr` to `user` in src/session.ts and fix any references.',
  models: [
    {
      id: 'fast',
      text: 'Small, cheap, fast model. Good for edits with one obvious approach, reformatting, short answers, and simple lookups. Weak at multi-step reasoning and subtle bugs.',
    },
    {
      id: 'balanced',
      text: 'Mid-size model at moderate cost. Handles multi-file changes, explanations, and routine debugging. Occasionally misses subtle design issues.',
    },
    {
      id: 'frontier',
      text: 'Largest, slowest, most expensive model. Best for architecture, security-sensitive code, ambiguous requirements, and hard debugging.',
    },
  ],
  context: 'Coding agent inside a small TypeScript repository with tests.',
  minConfidence: 0.8,
});
console.log(result);
```

Try the saved example without an API key: `npx jev-recipes demo model-route`.

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
  "verdict": "matched",
  "selection": "fast",
  "suggestedSelection": "fast",
  "confidence": 0.92,
  "probabilities": {
    "candidates": {
      "fast": 0.92,
      "balanced": 0.05,
      "frontier": 0.01
    },
    "none": 0.01,
    "ambiguous": 0.01
  },
  "effort": "low",
  "effortLevel": 0,
  "effortScore": 0.1,
  "effortConfidence": 0.9,
  "effortProbabilities": {
    "0": 0.9,
    "1": 0.1,
    "2": 0
  }
}
```

This saved response illustrates behavior; it is not a model accuracy measurement.

</details>

Related recipes:

- [`route`](../route/README.md): Use route to send a request to a named handler or team when no effort level is needed.
- [`task-complexity`](../task-complexity/README.md): Use task-complexity for a five-level complexity grade without picking a model.

<!-- END GENERATED: usage -->

## Input

<!-- BEGIN GENERATED: input -->

| Field           | Required | Shape                                              |
| --------------- | -------- | -------------------------------------------------- |
| `request`       | Yes      | string                                             |
| `models`        | Yes      | { id, text }[]; at least 1 items; at most 50 items |
| `context`       | No       | string                                             |
| `minConfidence` | No       | number; minimum 0; maximum 1                       |

This table is generated from the input schema. Additional text, uniqueness, and policy checks are described below and in the shared options.

<!-- END GENERATED: input -->

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

`models` lists up to 50 candidates with unique ids. Each `text` should say what the model is good at, what it is weak at, and its relative cost, because the recipe prefers the cheapest model whose description covers the request. `context` can carry the environment, the conversation so far, or constraints such as latency budgets.

## Result

`selection` is the chosen model id when the result is `ready`, otherwise null. `suggestedSelection` keeps a low-confidence pick for logging. `verdict` is `matched`, `none`, or `ambiguous`; `none` means no described model fits, which usually signals a gap in the descriptions. `probabilities.candidates` is keyed by your model ids.

`effort` is `low`, `medium`, or `high`, taken from the most likely rubric level, with `effortLevel` as its index and `effortScore` as Jev's expected value between 0 and 2. `effortConfidence` and `effortProbabilities` describe that second judgment. Map `effort` onto your provider's thinking or reasoning parameter.

A result is `ready` when the selection confidence meets `minConfidence` and the verdict is not `ambiguous`. The effort grade does not affect `status`; read `effortConfidence` if you want to gate on it.

## Measured accuracy

<!-- BEGIN GENERATED: accuracy -->

Measured on 44 golden cases against `jev-1.13.0`: **84% accurate** overall (contested cases 60%, adversarial cases 50%).

| `minConfidence` | Deferred to review | Accuracy of ready results |
| --------------- | ------------------ | ------------------------- |
| 0.5             | 21%                | 91%                       |
| 0.6             | 23%                | 94%                       |
| 0.7             | 25%                | 94%                       |
| 0.8             | 32%                | 100%                      |
| 0.9             | 41%                | 100%                      |
| 0.95            | 52%                | 100%                      |

The lowest threshold reaching 95% accuracy on ready results is 0.75.

Rerun with `npm run eval -- model-route`; the full report, including misses, is in [evals/results/model-route.json](../../evals/results/model-route.json). Accuracy on your own data may differ.

<!-- END GENERATED: accuracy -->

## Reuse and calls

Uses the shared selection question and score parser. One live invocation makes one Jev request carrying both questions. This folder owns the routing instruction, the effort rubric, and the mapping onto model ids.

## Limits

Describe models by capability and cost, not by name alone. A description such as "the best model" gives the recipe nothing to compare.

The effort grade reads the request text. A short request can still be hard; supply `context` when the difficulty lives in the surrounding state.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo model-route` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe model-route` to inspect the input and result schemas.
