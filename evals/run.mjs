import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { format as formatFile, resolveConfig } from 'prettier';
import { renderMeasuredAccuracy } from '../scripts/lib/docs.mjs';
import { randomUUID } from 'node:crypto';
import { evaluate } from '../dist/evaluation/index.js';
import { scoringRevision } from '../dist/evaluation/comparison.js';
import { loadEvaluationRecipe, validateCases } from '../dist/evaluation/dataset.js';
import { readDevelopmentBaseline, saveDevelopmentBaseline } from './lib/baselines.mjs';
import {
  listGoldenRecipeIds,
  projectRoot,
  readGoldenCases,
  requireApiKey,
} from './lib/harness.mjs';

const REGRESSION_TOLERANCE = 0.05;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  allowNegative: true,
  options: {
    write: { type: 'boolean' },
    check: { type: 'boolean', default: false },
    concurrency: { type: 'string', default: '4' },
    featured: { type: 'boolean', default: false },
  },
});
const saveResults = values.write ?? !values.check;

if (values.featured && positionals.length)
  throw new Error('Use --featured or recipe names, not both.');
const ids = values.featured
  ? Object.values(
      JSON.parse(await readFile(join(projectRoot, 'evals/featured.json'), 'utf8')),
    ).flat()
  : positionals.length
    ? positionals
    : await listGoldenRecipeIds();
if (!ids.length) {
  console.error('No golden datasets found under evals/<recipe>/cases.jsonl.');
  process.exit(1);
}

const plannedRuns = [];
for (const id of ids) {
  const cases = validateCases(await loadEvaluationRecipe(id), await readGoldenCases(id));
  const baseline = values.check
    ? await readDevelopmentBaseline(id, cases, { expectedScoringRevision: scoringRevision })
    : undefined;
  plannedRuns.push({ id, cases, baseline });
}
requireApiKey();
let regressed = false;
for (const { id, cases, baseline } of plannedRuns) {
  const archive = saveResults
    ? join(projectRoot, 'evals/runs', `${id}-${Date.now()}-${randomUUID().slice(0, 8)}`)
    : undefined;
  const { report } = await evaluate(id, cases, {
    concurrency: Number(values.concurrency),
    ...(archive ? { out: archive } : {}),
    ...(baseline ? { model: baseline.model, policy: baseline.evidence.policy } : {}),
  });
  if (archive) console.log(`  Recorded responses: ${archive}`);
  printReport(report);
  if (baseline) regressed = checkAgainstBaseline(report, baseline) || regressed;
  if (saveResults) await saveEvaluation(report);
}
if (!saveResults && !values.check) console.log('Results were not saved (--no-write).');
if (regressed) process.exitCode = 1;

function printReport(report) {
  console.log(
    `${report.recipe}: accuracy ${format(report.accuracy)} over ${report.cases} cases ` +
      (report.itemAccuracy === undefined
        ? ''
        : `(${format(report.itemAccuracy)} over ${report.items} items) `) +
      `(contested ${format(report.contestedAccuracy)}, adversarial ${format(report.adversarialAccuracy)}), ` +
      `suggested minConfidence ${report.suggestedMinConfidence ?? 'none reaches the target'}.`,
  );
  for (const failure of report.failures) {
    console.log(
      `  MISS ${failure.id}: expected ${JSON.stringify(failure.expected)}, ` +
        (failure.error === undefined
          ? `got ${JSON.stringify(failure.actual)}` +
            (failure.confidence === undefined ? '' : ` at confidence ${failure.confidence}`)
          : `errored: ${failure.error}`),
    );
  }
}

function format(accuracy) {
  return accuracy === null ? 'n/a' : accuracy.toFixed(3);
}

function snapshotPath(id) {
  return join(projectRoot, 'evals/results', `${id}.json`);
}

async function saveEvaluation(report) {
  await saveDevelopmentBaseline(report);
  const config = await resolveConfig(join(projectRoot, 'package.json'));
  const reportPath = snapshotPath(report.recipe);
  await mkdir(join(projectRoot, 'evals/results'), { recursive: true });
  await writeFile(
    reportPath,
    await formatFile(JSON.stringify(report), { ...config, filepath: reportPath }),
  );
  console.log(`  Snapshot written to evals/results/${report.recipe}.json`);

  const guidePath = join(projectRoot, 'recipes', report.recipe, 'README.md');
  const originalGuide = await readFile(guidePath, 'utf8');
  const updatedGuide = renderMeasuredAccuracy(report.recipe, originalGuide, report);
  await writeFile(guidePath, await formatFile(updatedGuide, { ...config, filepath: guidePath }));
  console.log(`  Guide updated: recipes/${report.recipe}/README.md`);
}

function checkAgainstBaseline(report, previous) {
  const drop = previous.accuracy - report.accuracy;
  if (drop > REGRESSION_TOLERANCE) {
    console.error(
      `  REGRESSION ${report.recipe}: accuracy fell from ${previous.accuracy} to ${report.accuracy}.`,
    );
    return true;
  }
  return false;
}
