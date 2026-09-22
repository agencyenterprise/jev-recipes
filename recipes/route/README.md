# Route a request

Choose a handler from the routes you supply. The recipe returns the selection; your application runs the handler.

```ts
import { route } from 'jev-recipes/route';

const result = await route({
  request: 'I was charged twice.',
  routes: {
    billing: 'Payments, invoices, subscriptions, and refunds',
    technical: 'Errors, outages, and broken integrations',
  },
});

console.log(result.route);
```

## Input

| Field           | Accepts                                                                   |
| --------------- | ------------------------------------------------------------------------- |
| `request`       | Non-empty text describing the request                                     |
| `routes`        | 1 to 254 non-empty route names and descriptions; `__review__` is reserved |
| `minConfidence` | Optional number from 0 to 1; defaults to 0.8                              |

See [shared options and behavior](../README.md#shared-options-and-behavior) for client configuration, validation, and errors. Types are inferred from this folder's Zod 4 schemas.

## Result

A confident selection returns `status: "ready"` and the route name in `route`. A low-confidence result or the reserved `__review__` choice returns `status: "review"` and a null `route`.

`suggestedRoute` preserves a low-confidence suggestion. It is null when no route is selected. `confidence` and `probabilities` describe the model decision, including the `__review__` option.

The result includes model and token usage. Inspect the outcome as well as its review status.

## Reuse and calls

Uses the shared choice helper. This folder owns the routing question, route criteria, and review policy. A live invocation makes one logical Jev request; SDK retries can add transport attempts.

## Limits

Routes with overlapping descriptions can be difficult to distinguish. Describe their responsibilities clearly. Routing does not execute handlers or establish permission to act.

## Example input

[demo.json](demo.json) contains editable input and a hand-authored response. After installing `jev-recipes`, `npx jev-recipes demo route` shows an offline illustration, not an accuracy measurement. Use `npx jev-recipes describe route` to inspect the input and result schemas.
