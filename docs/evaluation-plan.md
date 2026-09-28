# Next evaluation: support routing first

**Status: offline preparation only. No live execution or API budget is authorized by this plan.** Market research, research-tool selection, and new recipes remain deferred.

The first study should measure the existing support-routing workflow. It already supplies a keyword baseline, Jev-only decisions, and an optional fallback using the same primary response. Subsequent studies should cover `clarify`, `answerability`, and `verify` separately. Do not infer their accuracy from routing results.

## Define and freeze the study

| Item         | Required before calls                                                                                                                                                                                                                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Task         | Route requests to the supplied billing/account/technical queues, or review when no single supported route is established. Keep the current application contract explicit.                                                                                                                                                                  |
| Sources      | Select public material only where original labels support the chosen taxonomy. Retain source URL, revision/hash, attribution, license, and mapping. The previously inspected CLINC150 labels do not directly establish this workflow's taxonomy or mixed-request policy. No new public dataset has been selected or loaded by this change. |
| Labels       | Distinguish original labels from author-written mappings or cases. Mark derived judgments as authored, and record contested cases before calls. Do not claim independent review where none occurred.                                                                                                                                       |
| Splits       | Reserve whole source/conversation families, including all paraphrases and counterfactuals, to one split. The previously inspected 48 synthetic cases are regression/development evidence for subsequent tuning, not a fresh held-out claim.                                                                                                |
| Baselines    | Freeze keyword rules and the primary-only and fallback policies before the held-out run. Compare strategies on identical cases; retain paired outcomes and fallback eligibility.                                                                                                                                                           |
| Model/policy | Record requested and returned model identities, SDK/provider versions, route criteria, prompt/recipe/workflow fingerprints, confidence threshold, fallback eligibility, and scoring revision. Use a development-selected policy. An unchanged alias does not prove an unchanged backend.                                                   |
| Budget       | Supply an explicit approved maximum for requests and tokens/cost, with the reservation method and stop condition. Count transport attempts, retries, fallback, and failures. Use the existing request limiter and budget mechanisms rather than creating an unbounded runner.                                                              |

When exact pre-dispatch token/cost bounds are unavailable, describe cost as an estimate and use an enforceable request cap. Never describe a post-hoc total as a hard spending limit. No new live command should run automatically in CI or as part of building the package.

## Proposed acceptance criteria

These are proposed study criteria, not achieved results. Freeze them with the selected corpus before execution; do not lower them after inspecting held-out outcomes.

- At least 200 independent held-out source/conversation families, with meaningful coverage of each route, ambiguity, and no-fit cases. Authored variants from one template are not independent families.
- Ready-route precision at least 95%, a family-aware 95% lower bound at least 90%, and ready coverage at least 60%. Publish numerators/denominators, not just percentages.
- Report wrong-ready decisions, reviews, provider failures, no-fit errors, calibration, latency, and full workflow usage separately. Keep failures in the overall outcome denominator.
- Demonstrate improvement over the frozen baseline at a declared quality/coverage tradeoff before promotion. Compare paired cases and report uncertainty. A high model-only score does not establish lower workflow cost.
- A fallback-benefit claim requires observed eligible fallback cases and comparison with primary-only outcomes on the same cases. If no calls are eligible, say the study did not measure fallback benefit. Do not force eligibility by changing a held-out threshold.
- Provider failures, insufficient independent cases, weak label provenance, or unmet criteria keep the result experimental. Retain failed attempts instead of replacing them with only a clean retry.

## Artifacts to retain

Keep a source/provenance manifest, source-family split, labeled cases and rationales, frozen policy, baseline outputs, approved budget/usage ledger, raw requests and provider responses, failed attempts, and per-strategy reports. Archives use private local permissions where supported and are not uploaded by the tooling. Comparison and replay must use compatible recipe/workflow fingerprints and scoring revisions.

After outcomes inform a prompt or policy change, treat those inspected cases as development material. A subsequent promotion claim needs a fresh reserved split. Until this study is funded and completed, offline regressions establish software correctness only.

## Follow-on tasks

For `clarify`, evaluate present/missing/ambiguous requirements and whether the resulting application proposes an unnecessary question. For `answerability`, label support available in the supplied context, not general knowledge. For `verify`, label each claim against supplied evidence and report both claim-level and whole-case results. Each task needs its own source mapping, baselines, split, and acceptance policy before calls.
