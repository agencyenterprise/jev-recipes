# Route

Choose a handler for a request. This function returns a decision and never executes the handler.

```ts
import { route } from 'jev-recipes/route';

const result = await route({
  request: 'I was charged twice.',
  routes: {
    billing: 'Payments, invoices, subscriptions, and refunds',
    technical: 'Errors, outages, and broken integrations',
  },
  minConfidence: 0.8,
});
```

Provide 1 to 254 route names and non-empty descriptions. The recipe adds a reserved `__review__` option for ambiguous requests or requests with no suitable handler. Do not use that name for your own route.

`minConfidence` defaults to `0.8`. At or above the threshold, a non-review selection returns `status: "ready"` and `route`. Below the threshold, or when Jev selects `__review__`, `route` is null and `status` is `review`. `suggestedRoute` preserves a low-confidence model suggestion for inspection; it is not an accepted decision.

Results include confidence, the complete choice probability distribution (including `__review__`), model, and token usage. Describe overlapping routes carefully. Confidence does not guarantee correctness.

Try `npm run jev -- demo route` for the offline [`demo.json`](demo.json) fixture. Use `node dist/cli/index.js example route` to print editable input for a live run. Live routing accuracy has not been measured.
