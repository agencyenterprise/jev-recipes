# Evaluate, retain the evidence, and replay the policy

The installed npm package can evaluate JSONL cases, save the requests and responses locally, replay a confidence policy offline, and compare compatible runs. Requires Node.js 22.9 or newer. Live evaluation uses API quota; replay and comparison do not need credentials.

```sh
npx jev-recipes evaluate route --cases ./routing-cases.jsonl --out ./results/baseline --model jev-1.13.0
npx jev-recipes replay ./results/baseline --min-confidence 0.9 --out ./results/review-at-90
npx jev-recipes compare ./results/baseline ./results/review-at-90
```

## Label the decision

Each nonblank line is one JSON object:

```json
{
  "id": "duplicate-charge",
  "family": "invoice-issue",
  "split": "development",
  "input": {
    "request": "Please refund a duplicate charge.",
    "routes": { "billing": "Payments and invoices", "technical": "Errors and outages" }
  },
  "expected": { "suggestedRoute": "billing" },
  "rationale": "The request concerns a payment.",
  "provenance": {
    "method": "author-synthetic",
    "source": "An authored support example; no independent review."
  }
}
```

`expected` maps result paths to ungated decisions, such as `verdict`, `suggestedRoute`, or `items.0.verdict`. Do not label confidence, probabilities, or `status`. A low-confidence correct answer and an incorrect answer are different observations. Compound cases count as correct only when every expected path matches. Item counts refer to expected paths, not tokens or provider calls.

Every case needs a unique ID, valid recipe input, a nonempty answer key, and a rationale. The evaluator validates the entire file, including the unselected split, before making a model call. Missing provenance is explicitly recorded as unspecified. Related counterfactuals can share a `family`; a family cannot cross development and held-out splits.

## Control the run

`--concurrency` defaults to 4 and accepts 1 through 32. `--max-cases` and `--max-requests` each default to 1000. The former rejects a selected split that is too large; the latter caps logical `systemOne` calls. An injected SDK client can retry an HTTP request internally, so logical calls are not necessarily transport attempts. Disable SDK retries when you need that distinction controlled.

Use `--model` to pin the requested model and `--min-confidence` to set an explicit policy. With no override, each case uses its input and the recipe's default. Requested and returned model identities are saved separately. Cost estimates require `--prices <file.json>` containing `model`, `inputPerMillion`, `outputPerMillion`, `currency: "USD"`, `date`, and `source`. Costs are unavailable when usage or failure costs are unknown, or when the returned models do not match the supplied rate.

Reports separate completed, wrong, ready, review, and failed cases. Overall accuracy includes failures in its denominator; completed accuracy excludes them. Review rate is measured among completed cases. Threshold tables replay the actual recipe, preserving mandatory review and compound decision rules. They include ready/review/failure counts and confidence intervals. A suggested development threshold is exploratory and is not proof of readiness. Case-level Wilson intervals assume independent observations; related synthetic variants can make those intervals too optimistic.

## Keep held-out cases held out

Choose a policy using development cases, then evaluate the reserved cases once that policy is fixed:

```sh
npx jev-recipes evaluate route --cases ./routing-cases.jsonl --split development --min-confidence 0.8 --model jev-1.13.0 --out ./results/development
npx jev-recipes replay ./results/development --min-confidence 0.9 --out ./results/chosen-policy
npx jev-recipes evaluate route --cases ./routing-cases.jsonl --split held-out --policy ./results/chosen-policy/policy.json --model jev-1.13.0 --out ./results/held-out
```

The policy file records the development run, dataset, recipe fingerprint, and requested model. Held-out evaluation requires that policy and rejects a different recipe version or requested model. It does not produce a threshold search, and replay will not change a held-out policy. Pin versioned model names because provider aliases can change even when their names remain the same.

## Understand the archive

The output directory must not already exist. It contains `manifest.json`, per-case checkpoints under `cases/`, `run.json`, `report.json`, and `policy.json`. The manifest remains running if the process does not finish. Completed archives retain package version, recipe dependency fingerprint, exact labeled cases and provenance, model requests and responses, outputs, timing, usage, and the applied policy. The provider client's authentication configuration is not recorded. Error text redacts known secret environment values and bearer tokens.

Raw input and model responses may contain sensitive application data. Archives stay local, are created with private filesystem permissions where supported, and are never automatically uploaded. Avoid putting credentials inside evaluation inputs. Repository evidence uses synthetic or previously public cases and is saved as `run.json.gz`; `readRun` and the CLI can read either form.

Replay loads the installed recipe and rejects a changed recipe fingerprint or any unrecorded request. It reuses recorded responses and propagates recorded provider failures. Timing and token totals remain measurements of the original run, not the cost of replay. Comparison requires matching recipe IDs, input case IDs and content, split, and answer keys; differences in version, model, policy, outcomes, and failures are shown explicitly.

## Use the JavaScript API

```js
import { evaluate, readEvaluationCases, replay, compare } from 'jev-recipes/evaluation';

const cases = await readEvaluationCases('./routing-cases.jsonl');
const baseline = await evaluate('route', cases, {
  model: 'jev-1.13.0',
  policy: { minConfidence: 0.8 },
  out: './results/baseline',
});
const candidate = await replay(baseline, { minConfidence: 0.9 });
console.log(compare(baseline, candidate));
```

Pass `client` for an existing integration or a test client. Use `mode: 'fixture'` for fixture-backed runs so their evidence is identified honestly. This API has no dependency on contributor formatting tools.

## Repository evaluation

`npm run eval -- <recipe>` saves a development baseline in `evals/baselines/`, updates the report and recipe guide, and retains responses in an ignored `evals/runs/` archive. Cases without a split are treated as development cases. `--no-write` and `--check` remain read-only.

Use `npm run eval -- --featured --check` to check all 20 featured recipes against their recorded development baselines. This is also the optional golden check in the evaluation workflow. The check uses each baseline's model and confidence policy, and validates every selected dataset and baseline before the first provider call. It leaves held-out reports in `evals/results/` untouched. Without a separate baseline, a compatible development report in `evals/results/` can be used; held-out reports, unknown dataset identities, and changed case files are rejected. For other recipes, save a development baseline before enabling regression checks.

The featured evaluation runner validates all 20 datasets before its first request. Its dated TypeSafe rate comes from [the model documentation](https://docs.typesafe.ai/models). It reserves the full documented request token allowance against an explicit budget before each request, disables retries, and retains the reservation when usage is unknown. Its budget ledger persists across both splits:

```sh
npm run eval:featured -- --budget 5 --split development --out evals/runs/my-featured-run
npm run eval:featured -- --budget 5 --split held-out --out evals/runs/my-featured-run
```

These commands retain local archives. To deliberately update the repository's public evidence, add `--write-evidence` when running each split, then run `npm run docs`. Each compressed evidence archive receives a unique run ID. Development reports update regression baselines; held-out reports become the current guide summaries. Existing raw runs are retained.

The featured policy is declared in each `dataset.json` before evaluation: confidence 0.8, at least 20 held-out ready cases, at least 95% accuracy among those ready cases, and no provider failures. Missing that policy leaves a recipe experimental for this use. Meeting it means only that the policy was met on these authored cases. It is not independent human validation or a general production-readiness claim.

## Gateway evaluation

Set `VERCEL_GATEWAY_API_KEY` (or `AI_GATEWAY_API_KEY`) in your local `.env`. After building, run a development evaluation explicitly:

```sh
node --env-file=.env evals/gateway.mjs --recipe text-block-role --cases evals/text-block-role/cases.jsonl --out evals/runs/my-document-evaluation/development
```

Then freeze that development policy for the held-out split:

```sh
node --env-file=.env evals/gateway.mjs --recipe text-block-role --cases evals/text-block-role/cases.jsonl --split held-out --development evals/runs/my-document-evaluation/development --out evals/runs/my-document-evaluation/held-out
```

These commands make paid calls. They disable SDK retries and retain every provider response using the existing evaluator. Use a new output directory for each run. Provider failures set a nonzero exit status. A changed response model between splits also prevents promotion, although unchanged alias text cannot prove an unchanged backend model. Billing limits remain with your provider configuration.

The September 2026 document datasets retain pinned Node.js Markdown sources, their license, hashes, and provenance in `evals/sources/node-v22.20.0/`. Rebuild cases offline with `node scripts/build-ingestion-cases.mjs`. Labels come from source markup and documented transformations, not independent human review. Source documents never cross splits. This initial corpus covers heading/body/code and prose boundaries in technical documentation, not all block roles, languages, PDF layouts, or OCR noise.

`evals/lib/ingestion-metrics.mjs` supplies frozen deterministic baselines and descriptive document-bootstrap intervals. Unsupported classes and insufficient independent documents keep the new recipes experimental regardless of fixture correctness. Previously inspected cases for the three revised featured recipes are now development/regression cases; their new held-out families remain correlated synthetic evidence.

Catalog and CLI descriptions include an `evidence` object derived from the same saved reports as the static site. Its `kind` describes provenance and source freshness; `experimental` separately indicates an absent or unmet current acceptance policy. A current public-dataset report does not imply independently reviewed labels.

## Compare an application workflow

The [support-routing comparison](../evals/support-routing/README.md) uses this evaluator for primary Jev responses and a small example-specific layer for rules and an optional chat fallback. It records both stages, shares the same primary response between strategies, reports review and failure separately, and refuses replay when a required fallback response is missing. The [web starter](../examples/support-routing/web/README.md) uses the same workflow. Its fixtures are behavior demonstrations; its authored live cases remain experimental.
