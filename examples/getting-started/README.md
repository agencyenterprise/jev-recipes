# Three ways to start

After building, run `node examples/getting-started/run.mjs`. It needs no key and executes no side effects. Its nine outputs show a ready decision, a review outcome, and a provider failure for each path:

| Task             | Recipe           | Caller responsibility                                                    |
| ---------------- | ---------------- | ------------------------------------------------------------------------ |
| Route work       | `route`          | Supply valid routes, then dispatch or review the result                  |
| Select evidence  | `rerank`         | Retrieve candidates, retain source IDs, and verify support for an answer |
| Review an action | `tool-call-gate` | Enforce permissions and execute only actions the application permits     |

The responses are hand-authored fixtures. They demonstrate control flow, not accuracy, latency, or savings. To use a provider, inject a configured client following [the integration guide](../../docs/integrations.md). To evaluate recorded cases through Gateway, follow [the evaluation guide](../../docs/evaluation.md).

## Route work

For a complete conversation, start with the [portable support starter](../support-routing/README.md). It uses `clarify` to ask for missing details, resumes with the customer's answer, and uses `route` when the required information is present. An unresolved answer goes to review. Configuration and workflow code are included, with no repository build required.

Start with `npx jev-recipes demo route`, then inspect `npx jev-recipes describe route`. Supply the incoming request and descriptions of the teams you can route to. Dispatch only a ready result; send uncertainty or provider failure to your review queue. The `route work` cases in [run.mjs](run.mjs) show all three outcomes.

## Select evidence

Start with `npx jev-recipes demo rerank`, then inspect `npx jev-recipes describe rerank`. Supply a query and retrieved candidates with stable IDs. Keep the source IDs when using ranked results. Relevance alone does not establish that an answer is supported. The `select evidence` cases in [run.mjs](run.mjs) show useful results, no selected evidence, and provider failure.

## Review an action

Start with `npx jev-recipes demo tool-call-gate`, then inspect `npx jev-recipes describe tool-call-gate`. Supply the user's request, the proposed tool call, and your policy. The application checks permissions and carries out permitted actions. The `review an action` cases in [run.mjs](run.mjs) show a ready judgment, uncertainty, and provider failure without executing a tool.

## Explore a live application

[Jevthoven](https://jev-ai-music.com/) uses jev-recipes in a music app built by the package's maintainer. [Read what has been verified](../jevthoven/README.md) before adapting its approach. Playback requires sign-in.

## Check the evidence before enabling live decisions

Use `npx jev-recipes describe route` to inspect its schemas and `evidence` summary. Fixture-only and unknown-origin entries have no verified live measurement. A current measurement still describes only its named dataset and label provenance. Review the original evaluation date, ready/review counts, scoring revision, and experimental status.

The [direct and Gateway guide](../../docs/integrations.md) supplies the live client setup. Keep execution, permissions, and exact business rules in application code. The [evaluation guide](../../docs/evaluation.md) explains response archives and offline replay; replaying a fixture does not measure live accuracy.
