# Three ways to start

After building, run `node examples/getting-started/run.mjs`. It needs no key and executes no side effects. Its nine outputs show a ready decision, a review outcome, and a provider failure for each path:

| Task             | Recipe           | Caller responsibility                                                    |
| ---------------- | ---------------- | ------------------------------------------------------------------------ |
| Route work       | `route`          | Supply valid routes, then dispatch or review the result                  |
| Select evidence  | `rerank`         | Retrieve candidates, retain source IDs, and verify support for an answer |
| Review an action | `tool-call-gate` | Enforce permissions and execute only actions the application permits     |

The responses are hand-authored fixtures. They demonstrate control flow, not accuracy, latency, or savings. To use a provider, inject a configured client following [the integration guide](../../docs/integrations.md). To evaluate recorded cases through Gateway, follow [the evaluation guide](../../docs/evaluation.md).
