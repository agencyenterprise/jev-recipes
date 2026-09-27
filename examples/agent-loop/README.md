# An agent turn with explicit decisions

Build the package, then run `node examples/agent-loop/run.mjs`. The default uses labeled fixtures and makes no network calls. Add `--live` with `TYPESAFE_API_KEY` to evaluate the same illustrative inputs with Jev. Neither mode executes tools or calls a text-generation model.

Read [workflow.mjs](workflow.mjs) from top to bottom: select a model, retain useful context and its dependencies, check progress, decide whether retrying helps, and return the next permitted step. A completion claim is checked against supplied evidence. Unverified claims return `verify`; uncertainty or provider failure returns `review`.

The host application executes `generate` or `execute_tool`, appends the actual result to the transcript, and calls `advanceAgent` with the returned state. It owns the model configuration, tool allowlist, attempt budget, persistence, and human review. The returned model ID names a supplied candidate; it is not an SDK model configuration.

Context items carry application-owned `requires` and `pair` fields. Keeping a diagnosis keeps its cited evidence and both halves of a tool exchange. Jev judges relevance; code preserves these explicit dependencies. Supply those links when ingesting context. A missing dependency is rejected before inference.

The fixtures demonstrate an unsupported completion claim, preserved evidence, and a permitted local test. The workflow tests also cover permanent repeated failure, uncertain routing, denied tools, and provider failure. They verify control flow, not decision accuracy or cost savings. No performance advantage is claimed without a comparison on matching tasks.
