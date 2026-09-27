# Gateway validation: September 27, 2026

Live calls used the real TypeSafe SDK through Vercel's TypeSafe-compatible Gateway endpoint. Choice, Score, and Noul responses parsed successfully. Both request and response identified the model as `typesafe-ai/jev`; this alias does not establish a pinned backend version or which BYOK credential Vercel used. Direct TypeSafe transport was checked offline, not live in this run.

## Frozen held-out results

All five recipes used confidence 0.8, selected on development cases before evaluating the held-out split. Previously inspected synthetic cases were moved to development. The new synthetic families use correlated templates and AI-authored labels without independent review. Document labels derive from pinned public Markdown and transformations, also without independent review.

| Recipe             | Cases | Correct overall | Ready | Ready accuracy | Review | Acceptance                        |
| ------------------ | ----: | --------------: | ----: | -------------: | -----: | --------------------------------- |
| action-effects     |    40 |              40 |    20 |           100% |    50% | Met on these synthetic cases      |
| completion-gate    |    40 |              40 |    30 |           100% |    25% | Met on these synthetic cases      |
| context-prune      |    20 |              20 |    11 |           100% |    45% | Experimental: too few ready cases |
| text-block-role    |   189 |             155 |   136 |          90.4% |  28.0% | Experimental                      |
| paragraph-boundary |   167 |             155 |    82 |          98.8% |  50.9% | Experimental                      |

These completed runs had no provider failures. The first context-prune held-out attempt had seven connection errors. Its complete archive is retained alongside the subsequent run of the identical dataset, prompt, and policy. The report links that first attempt; it is not hidden by the successful retry.

The two passing synthetic recipes met the existing policy: at least 20 ready cases, at least 95% ready accuracy, and zero provider failures. Their new sets differ from the original evaluation, so the percentages do not establish a controlled before/after improvement or production reliability.

## Document limits and promotion criteria

Each document recipe has 21 held-out source documents. Text-block-role covers only heading, body, and code. List item, table, caption, formula, and other have no live labels in this corpus. Macro-F1 across all eight substantive roles is 0.300, counting unsupported roles as zero. The document-bootstrap interval for ready precision is 87.2% to 93.9%.

Paragraph-boundary accepted 81 joins, all correct against these labels, across 21 documents. Accepted-continuation recall was 96.4%. Its descriptive bootstrap interval is degenerate at 100% because all observed accepted joins were correct; this is not a guarantee about unseen documents. One confident `separate` decision was incorrect, which explains the lower overall ready accuracy.

Frozen syntax/punctuation rules achieved 92.6% overall block-role accuracy and 97.6% boundary accuracy. The models achieved 82.0% and 92.8%, respectively. Neither demonstrated improvement over these baselines. Prefer reliable source markup and deterministic rules for this corpus. These measurements do not establish that a model helps with degraded extraction, PDFs, or OCR.

Promotion requires the predeclared criteria below, plus zero provider failures and demonstrated improvement over the frozen baseline. These thresholds were not relaxed after seeing held-out results.

- **Text-block-role:** ready accuracy at least 95%; document-bootstrap 95% lower precision bound at least 90%; macro-F1 at least 90%; ready coverage at least 70%; at least 30 held-out cases for each substantive role.
- **Paragraph-boundary:** accepted-join precision at least 98%; document-bootstrap 95% lower precision bound at least 95%; accepted-continuation recall at least 80%; review rate at most 30%; at least 200 accepted joins across 100 documents.

The executable checks and descriptive intervals are in [save-gateway-evidence.mjs](../evals/save-gateway-evidence.mjs) and [ingestion-metrics.mjs](../evals/lib/ingestion-metrics.mjs). Further prompt development must use fresh held-out documents for any new promotion claim.

## Reproduce and inspect

Latest reports live in `evals/results/`. Each report's `evidence.runId` identifies its complete response archive at `evals/evidence/<recipe>/held-out-<runId>/run.json.gz`; its selected development policy identifies the corresponding development archive. The context-prune report's `previousAttempt` identifies the failed run. Route and model-route also retain individual live smoke archives. Existing evidence remains available.

Read an archive without making a provider request:

```js
import { readRun } from 'jev-recipes/evaluation';

const run = await readRun(
  './evals/evidence/action-effects/held-out-8e9eb8e2-16b8-422b-8e59-5ed4b2c05d94',
);
console.log(run.report, run.rows);
```

See [Gateway evaluation](evaluation.md#gateway-evaluation) for explicit live commands. Offline recipe fixtures, transport checks, and installed-package tests verify software contracts; they do not measure model accuracy. Corpus sources, hashes, license, label provenance, and document splits are retained in `evals/sources/node-v22.20.0/` and the two recipe datasets.
