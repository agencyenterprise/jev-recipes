# Verify

Check whether each claim is supported by its paired evidence. The caller supplies both. This function does not browse, extract claims, validate sources, or guarantee factual truth.

```ts
import { verify } from 'jev-recipes/verify';

const result = await verify({
  claims: [
    {
      id: 'refund-window',
      claim: 'Refunds are available for 60 days.',
      evidence: 'Refunds are available only within 30 days of purchase.',
    },
  ],
  minConfidence: 0.8,
});
```

Supply 1 to 100 claims, each with a unique non-empty `id`, `claim`, and `evidence`. One Jev call evaluates all pairs. Every check returns:

- `verdict`: `supported`, `contradicted`, or `unsupported`.
- `status`: `ready` when confidence meets `minConfidence`, otherwise `review`.
- `confidence` and the full probability distribution.

`minConfidence` defaults to `0.8`. A ready result can be a confident contradiction; always read its verdict. `allSupported` is true only when every claim is both supported and ready. A review result retains the suggested verdict for inspection.

Model and token usage appear on the overall result. Missing or malformed model answers fail the complete evaluation. Contradictory or incomplete evidence can still lead to mistakes; measure performance on your own examples. Quote matching and source retrieval are outside the 0.0.1 scope.

Try `npm run jev -- demo verify` for the offline [`demo.json`](demo.json) fixture. Use `node dist/cli/index.js example verify` to print editable input. Live claim-checking accuracy has not been measured.
