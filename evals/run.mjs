import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { format as formatFile, resolveConfig } from 'prettier';
import { renderMeasuredAccuracy } from '../scripts/lib/docs.mjs';
import { randomUUID } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { evaluate } from '../dist/evaluation/index.js';
import { scoringRevision } from '../dist/evaluation/comparison.js';
import { loadEvaluationRecipe, validateCases } from '../dist/evaluation/dataset.js';
import { readDevelopmentBaseline, readReport, saveDevelopmentBaseline } from './lib/baselines.mjs';
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
    'allow-failures': { type: 'boolean', default: false },
    'replace-held-out': { type: 'boolean', default: false },
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
let withheld = false;
for (const { id, cases, baseline } of plannedRuns) {
  const archive = saveResults
    ? join(projectRoot, 'evals/runs', `${id}-${Date.now()}-${randomUUID().slice(0, 8)}`)
    : undefined;
  const run = await evaluate(id, cases, {
    concurrency: Number(values.concurrency),
    ...(archive ? { out: archive } : {}),
    ...(baseline ? { model: baseline.model, policy: baseline.evidence.policy } : {}),
  });
  const { report } = run;
  if (archive) console.log(`  Recorded responses: ${archive}`);
  printReport(report);
  if (baseline) regressed = checkAgainstBaseline(report, baseline) || regressed;
  if (!saveResults) continue;
  if (failuresWithholdSaving(report)) {
    withheld = true;
    continue;
  }
  await saveEvaluation(run);
}
if (!saveResults && !values.check) console.log('Results were not saved (--no-write).');
if (regressed || withheld) process.exitCode = 1;

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

function failuresWithholdSaving(report) {
  if (report.failed === 0) return false;
  if (report.failed === report.cases) {
    console.error(
      `  NOT SAVED ${report.recipe}: every case failed, so this run measured nothing. ` +
        'The responses are retained under evals/runs; the report, baseline, and guide were kept.',
    );
    return true;
  }
  if (values['allow-failures']) return false;
  console.error(
    `  NOT SAVED ${report.recipe}: ${report.failed} of ${report.cases} cases failed. ` +
      'Rerun with --allow-failures to save a measurement that includes provider failures.',
  );
  return true;
}

async function saveEvaluation(run) {
  const { report } = run;
  const evidence = join(projectRoot, 'evals/evidence', run.recipe, `${run.split}-${run.runId}`);
  await mkdir(evidence, { recursive: true });
  await writeFile(join(evidence, 'run.json.gz'), gzipSync(JSON.stringify(run) + '\n'), {
    flag: 'wx',
  });
  await saveDevelopmentBaseline(report);
  const reportPath = snapshotPath(report.recipe);
  const previous = await readReport(reportPath);
  if (previous?.evidence?.split === 'held-out' && !values['replace-held-out']) {
    console.log(
      `  Kept the held-out summary in evals/results/${report.recipe}.json and its guide; ` +
        'pass --replace-held-out to replace them with this development run.',
    );
    return;
  }
  const config = await resolveConfig(join(projectRoot, 'package.json'));
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
