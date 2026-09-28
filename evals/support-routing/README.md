# Compare support routing strategies

This example-specific evaluator compares keyword rules, Jev alone, and the same Jev response with one eligible structured fallback. It reuses the package evaluator for primary requests, response retention, and policy replay. It is not a new public evaluation API.

See the [2026-09-27 recorded results](evidence/2026-09-27/README.md), including complete original responses. Those historical archives predate the current format; the replay commands below apply to new current-format runs.

All results remain **experimental**. The dataset has 48 AI-authored synthetic cases and labels, with no independent human review. Each split contains 24 cases: six billing, six account, six technical, and six requiring review. Case families do not cross splits. The reserved set was written before live evaluation, but its small size and common author do not establish generalization to customer traffic.

## Data and policy

[workflow-cases.jsonl](workflow-cases.jsonl) records each request, supplied queues, expected route (or null for review), rationale, provenance, and split. The label policy requires review for no fit, insufficient information, and independent requests spanning queues. Single requests with context or quoted instructions should follow the actual request. These labels are author judgments, not customer outcomes.

We examined the [CLINC150 dataset description](https://github.com/clinc/oos-eval) and its [CC BY 3.0 license](https://github.com/clinc/oos-eval/blob/master/LICENSE) on 2026-09-27. Its crowd-sourced single-intent labels do not directly label this queue taxonomy or mixed-request review policy. We did not reuse its data or present these authored cases as public benchmark evidence.

[policy.json](policy.json) fixes the keyword baseline, 0.8 Jev threshold, primary model, fallback model, and fallback eligibility before live calls. The larger model receives the same request and queues. It does not receive the expected label or Jev's answer. Jev is called once per case; its response is reused for both model strategies. A ready but wrong Jev answer cannot be corrected by this fallback policy.

## Reproduce

After `npm ci --ignore-scripts` and `npm run build`, run the offline plumbing check:

```sh
node evals/support-routing/run.mjs --out evals/runs/support-fixture-development
node evals/support-routing/run.mjs --split held-out --development evals/runs/support-fixture-development --out evals/runs/support-fixture-held-out
node evals/support-routing/run.mjs --replay evals/runs/support-fixture-held-out
```

Each output directory must be new. Fixture providers use keyword decisions with fixed uncertainty; they do not look up expected labels. Their results test the pipeline, not model quality.

For live measurements, set a Gateway key in the root `.env` and use:

```sh
node --env-file=.env evals/support-routing/run.mjs --live --out evals/runs/support-live-development
node --env-file=.env evals/support-routing/run.mjs --live --split held-out --development evals/runs/support-live-development --out evals/runs/support-live-held-out
node evals/support-routing/run.mjs --replay evals/runs/support-live-held-out
```

The held-out command rejects a changed policy, case set, mode, or workflow before making calls. No live tuning was used for the first recorded comparison. Once inspected, this reserved set must not support a fresh held-out claim after policy changes. Use fresh families for subsequent promotion decisions.

Replay makes no API calls. It rejects changed workflow code, modified archives, a different primary model, tuning on held-out data, and policy changes requiring fallback responses that were never recorded. `compareWorkflowRuns` in [benchmark.mjs](benchmark.mjs) requires the same case set, split, workflow, and policy. Response model identities and dates remain visible; aliases cannot prove a fixed backend.

## Read the report

Each strategy reports correct ready routes, wrong ready routes, correct reviews, unresolved requests, failures, ready coverage, accuracy among ready answers, inappropriate routing of required-review cases, fallback usage, token usage, and p50/p95 duration. `failed` overlaps `review`; failure never counts as correct review. `correct + wrong + unresolved` equals the case count.

Durations sum the recorded primary evaluation duration and any fallback duration for each request. They exclude browser, queue, and unrelated requests. Rules have no measured latency. Missing token usage stays null. Monetary cost stays null for model strategies because these responses do not establish the actual billed price; rules use no provider tokens. No savings claim is implied.

Archives include the frozen policy, both case splits, code and dataset hashes, primary evaluator archive, raw fallback request/response text, per-case checkpoints, report, and integrity checksum. Completed archives support offline replay. Interrupted runs keep available checkpoints but are not comparable completed runs. Checksums detect accidental changes, not malicious rewriting. Credentials are not recorded in request headers; use non-sensitive inputs and inspect provider text before sharing.

## Acceptance and ownership

Behavior acceptance requires tested ready, review, fallback, malformed response, error, cancellation, archival integrity, and replay paths. Live acceptance for this example requires complete retained responses and explicit failures, not an accuracy threshold chosen after seeing results. No recipe receives a new quality badge from this comparison. Claims that fallback improves quality or cost require fresh representative data, independently checked labels, and a predefined quality/coverage/latency tradeoff.

This small harness belongs to the support-routing example. Repository maintainers own it. Reuse the existing evaluator rather than introducing a general orchestration framework here. [The workflow](../../examples/support-routing/README.md) and [web starter](../../examples/support-routing/web/README.md) share the same decision code.

## What the retained comparison does not prove

The September 27 evaluation made no eligible fallback calls on its 48 authored cases. Separate fixture/transport checks cover fallback ready, review, error, and cancellation behavior, but those tests do not establish that fallback improves live accuracy. A new claim needs fresh held-out families and observed fallback cases under a frozen policy. See the [offline preparation plan](../../docs/evaluation-plan.md).
