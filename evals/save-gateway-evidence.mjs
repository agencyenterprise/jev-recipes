import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { readRun } from '../dist/evaluation/index.js';
import { saveDevelopmentBaseline } from './lib/baselines.mjs';
import { ingestionMetrics } from './lib/ingestion-metrics.mjs';

const directory = process.argv[2];
if (!directory)
  throw new Error('Usage: node evals/save-gateway-evidence.mjs <completed-run-directory>');
const records = [];
for (const recipe of [
  'action-effects',
  'completion-gate',
  'context-prune',
  'text-block-role',
  'paragraph-boundary',
]) {
  const development = await readRun(join(directory, recipe, 'development'));
  await archiveRun(development);
  await saveDevelopmentBaseline(development.report);
  const heldOut = await readRun(
    join(directory, recipe, recipe === 'context-prune' ? 'held-out-retry' : 'held-out'),
  );
  await archiveRun(heldOut);
  const report = heldOut.report;
  if (recipe === 'context-prune') {
    const firstAttempt = await readRun(join(directory, recipe, 'held-out'));
    await archiveRun(firstAttempt);
    report.previousAttempt = {
      runId: firstAttempt.runId,
      failed: firstAttempt.report.failed,
      reason:
        'Connection errors; the same dataset and frozen policy were rerun without prompt or threshold changes.',
    };
  }
  if (['text-block-role', 'paragraph-boundary'].includes(recipe)) {
    report.documentEvaluation = ingestionMetrics(heldOut);
    const metrics = report.documentEvaluation;
    const common = {
      noProviderFailures: report.failed === 0,
      beatsFrozenBaseline: metrics.baselineImprovementInterval95?.[0] > 0,
    };
    const checks =
      recipe === 'text-block-role'
        ? {
            ...common,
            readyAccuracy: report.readyAccuracy >= 0.95,
            precisionLowerBound: metrics.acceptedPrecisionInterval95?.[0] >= 0.9,
            macroF1: metrics.macroF1 >= 0.9,
            readyCoverage: metrics.readyCoverage >= 0.7,
            everyRoleRepresented: metrics.perLabel.every((entry) => entry.cases >= 30),
          }
        : {
            ...common,
            acceptedJoinPrecision: metrics.acceptedPrecision >= 0.98,
            precisionLowerBound: metrics.acceptedPrecisionInterval95?.[0] >= 0.95,
            continuationRecall: metrics.acceptedContinuationRecall >= 0.8,
            reviewRate: report.reviewRate <= 0.3,
            acceptedJoins: metrics.acceptedDecisions >= 200,
            acceptedDocuments: metrics.acceptedDocuments >= 100,
          };
    report.acceptance = {
      met: Object.values(checks).every(Boolean),
      checks,
      label: Object.values(checks).every(Boolean)
        ? 'Measured on these public document cases'
        : 'Experimental: declared document acceptance policy not met',
    };
  } else {
    const criteria = JSON.parse(await readFile(`evals/${recipe}/dataset.json`, 'utf8')).acceptance;
    const met =
      report.ready >= criteria.minimumHeldOutReadyCases &&
      report.readyAccuracy >= criteria.minimumReadyAccuracy &&
      report.failed <= criteria.maximumProviderFailures;
    report.acceptance = {
      ...criteria,
      met,
      label: met
        ? 'Measured on these synthetic cases'
        : 'Experimental: declared acceptance policy not met',
    };
  }
  report.gatewayIdentity =
    'Gateway returned the alias typesafe-ai/jev; backend version and BYOK credential use are not independently established.';
  await writeFile(`evals/results/${recipe}.json`, JSON.stringify(report, null, 2) + '\n');
  records.push({
    recipe,
    cases: report.cases,
    correct: report.correct,
    ready: report.ready,
    readyAccuracy: report.readyAccuracy,
    review: report.review,
    failed: report.failed,
    accepted: report.acceptance.met,
    documentEvaluation: report.documentEvaluation,
  });
}
for (const name of ['smoke', 'score-smoke']) await archiveRun(await readRun(join(directory, name)));
console.log(JSON.stringify(records, null, 2));

async function archiveRun(run) {
  const target = join('evals/evidence', run.recipe, `${run.split}-${run.runId}`);
  await mkdir(target, { recursive: true });
  const path = join(target, 'run.json.gz');
  try {
    await writeFile(path, gzipSync(JSON.stringify(run) + '\n'), { flag: 'wx' });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}
