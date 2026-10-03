import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { gzipSync } from 'node:zlib';
import { createClient } from '../dist/src/client.js';
import { evaluate, freezePolicy, readRun } from '../dist/evaluation/index.js';
import {
  datasetFingerprints,
  recipeFingerprint,
  loadEvaluationRecipe,
  validateCases,
} from '../dist/evaluation/dataset.js';
import { readGoldenCases, projectRoot, requireApiKey } from './lib/harness.mjs';
import { saveDevelopmentBaseline } from './lib/baselines.mjs';
import { meetsReadyAccuracy } from './lib/acceptance.mjs';

const { values } = parseArgs({
  options: {
    budget: { type: 'string' },
    split: { type: 'string' },
    out: { type: 'string' },
    'write-evidence': { type: 'boolean', default: false },
  },
});
const budget = Number(values.budget);
if (
  !Number.isFinite(budget) ||
  budget <= 0 ||
  !['development', 'held-out'].includes(values.split) ||
  !values.out
)
  throw new Error(
    'Usage: npm run eval:featured -- --budget <USD> --split development|held-out --out <run-directory>',
  );
requireApiKey();
const collections = JSON.parse(await readFile(new URL('./featured.json', import.meta.url), 'utf8'));
const price = JSON.parse(
  await readFile(new URL('./prices/jev-1.13.0.json', import.meta.url), 'utf8'),
);
const datasets = new Map();
for (const id of Object.values(collections).flat()) {
  const cases = await readGoldenCases(id);
  datasets.set(id, validateCases(await loadEvaluationRecipe(id), cases));
}
await mkdir(values.out, { recursive: true, mode: 0o700 });
const ledgerPath = join(values.out, 'budget.json');
const ledger = await readFile(ledgerPath, 'utf8')
  .then(JSON.parse)
  .catch((error) => {
    if (error.code === 'ENOENT')
      return {
        limit: budget,
        maximumCost: 0,
        inputTokens: 0,
        outputTokens: 0,
        requests: 0,
        unknownRequests: 0,
      };
    throw error;
  });
if (ledger.limit !== budget)
  throw new Error('Use the original spending limit for this run directory.');
const provider = createClient({
  baseURL: 'https://api.typesafe.ai',
  defaultModel: price.model,
  retry: { maxRetries: 0 },
});
const maximumRequestCost = (65_536 * price.inputPerMillion) / 1_000_000;
let saving = Promise.resolve();
let consecutiveFailures = 0;
function saveBudget() {
  saving = saving.then(() =>
    writeFile(ledgerPath, JSON.stringify(ledger, null, 2) + '\n', { mode: 0o600 }),
  );
  return saving;
}
const client = {
  async systemOne(request, options) {
    if (consecutiveFailures >= 3)
      throw new Error('Evaluation paused after consecutive provider failures.');
    if (ledger.maximumCost + maximumRequestCost > budget)
      throw new Error('The approved evaluation budget is exhausted.');
    ledger.maximumCost += maximumRequestCost;
    ledger.requests++;
    ledger.unknownRequests++;
    await saveBudget();
    let response;
    try {
      response = await provider.systemOne(request, options);
      consecutiveFailures = 0;
    } catch (error) {
      consecutiveFailures++;
      throw error;
    }
    ledger.inputTokens += response.usage.input_tokens;
    ledger.outputTokens += response.usage.output_tokens;
    ledger.unknownRequests--;
    ledger.maximumCost +=
      (response.usage.input_tokens * price.inputPerMillion +
        response.usage.output_tokens * price.outputPerMillion) /
        1_000_000 -
      maximumRequestCost;
    await saveBudget();
    return response;
  },
};

for (const [id, cases] of datasets) {
  const out = join(values.out, id, values.split);
  const existing = await readFile(join(out, 'run.json'), 'utf8')
    .then(JSON.parse)
    .catch((error) => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
  if (existing) {
    const current = datasetFingerprints(cases.filter((entry) => entry.split === values.split));
    if (
      existing.datasetFingerprint !== current.datasetFingerprint ||
      existing.recipeFingerprint !== (await recipeFingerprint(id)) ||
      existing.requestedModel !== price.model
    )
      throw new Error(
        `${id}: the saved run uses a different dataset, recipe, or model. Choose a new run directory.`,
      );
    console.log(`${id}: ${values.split} already recorded.`);
    continue;
  }
  const policy =
    values.split === 'held-out'
      ? freezePolicy(await readRun(join(values.out, id, 'development')))
      : { minConfidence: 0.8 };
  const run = await evaluate(id, cases, {
    client,
    model: price.model,
    price,
    split: values.split,
    policy,
    concurrency: 4,
    maxRequests: 1000,
    out,
  });
  console.log(
    `${id}: ${values.split}, ${run.report.correct}/${run.report.cases} correct, ${run.report.ready} ready, ${run.report.review} review, ${run.report.failed} failed; spend bound $${ledger.maximumCost.toFixed(6)}.`,
  );
  if (run.report.failed === run.report.cases)
    throw new Error(
      `Every ${id} case failed. Stopped before evaluating other recipes; inspect ${out}/report.json.`,
    );
  if (!values['write-evidence']) continue;
  const publicDirectory = join(projectRoot, 'evals/evidence', id, `${values.split}-${run.runId}`);
  await mkdir(publicDirectory, { recursive: true });
  await writeFile(join(publicDirectory, 'run.json.gz'), gzipSync(JSON.stringify(run) + '\n'), {
    flag: 'wx',
  });
  if (values.split === 'development') await saveDevelopmentBaseline(run.report);
  if (values.split === 'held-out') {
    const criteria = JSON.parse(
      await readFile(join(projectRoot, 'evals', id, 'dataset.json'), 'utf8'),
    ).acceptance;
    const accepted =
      run.report.ready >= criteria.minimumHeldOutReadyCases &&
      meetsReadyAccuracy(run.rows, criteria.minimumReadyAccuracy) &&
      run.report.failed <= criteria.maximumProviderFailures;
    const report = {
      ...run.report,
      acceptance: {
        ...criteria,
        met: accepted,
        label: accepted
          ? 'Measured on these synthetic cases'
          : 'Experimental: declared acceptance policy not met',
      },
    };
    await writeFile(
      join(projectRoot, 'evals/results', `${id}.json`),
      JSON.stringify(report, null, 2) + '\n',
    );
  }
}
console.log(
  `Recorded ${values.split}. Confirmed usage: ${ledger.inputTokens} input tokens. Maximum cost including unknown requests: $${ledger.maximumCost.toFixed(6)} of $${budget}.`,
);
