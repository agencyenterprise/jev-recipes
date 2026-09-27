import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { format as formatFile, resolveConfig } from 'prettier';
import { renderMeasuredAccuracy } from '../scripts/lib/docs.mjs';
import { randomUUID } from 'node:crypto';
import { evaluate } from '../dist/evaluation/index.js';
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
  },
});
const saveResults = values.write ?? !values.check;

requireApiKey();
const ids = positionals.length ? positionals : await listGoldenRecipeIds();
if (!ids.length) {
  console.error('No golden datasets found under evals/<recipe>/cases.jsonl.');
  process.exit(1);
}

let regressed = false;
for (const id of ids) {
  const cases = await readGoldenCases(id);
  const archive = saveResults
    ? join(projectRoot, 'evals/runs', `${id}-${Date.now()}-${randomUUID().slice(0, 8)}`)
    : undefined;
  const { report } = await evaluate(id, cases, {
    concurrency: Number(values.concurrency),
    ...(archive ? { out: archive } : {}),
  });
  if (archive) console.log(`  Recorded responses: ${archive}`);
  printReport(report);
  if (values.check) regressed = (await checkAgainstSnapshot(report)) || regressed;
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

async function checkAgainstSnapshot(report) {
  const previous = await readFile(snapshotPath(report.recipe), 'utf8')
    .then(JSON.parse)
    .catch(() => null);
  if (!previous) {
    console.log(
      `  No snapshot for ${report.recipe} yet; run npm run eval -- ${report.recipe} to create one.`,
    );
    return false;
  }
  if (
    !previous.evidence ||
    previous.evidence.datasetFingerprint !== report.evidence.datasetFingerprint ||
    previous.evidence.split !== report.evidence.split
  )
    throw new Error(
      `Cannot compare ${report.recipe}: the snapshot uses a different dataset or split, or has no recorded dataset identity. Save a baseline for these cases before using --check.`,
    );
  const drop = previous.accuracy - report.accuracy;
  if (drop > REGRESSION_TOLERANCE) {
    console.error(
      `  REGRESSION ${report.recipe}: accuracy fell from ${previous.accuracy} to ${report.accuracy}.`,
    );
    return true;
  }
  return false;
}
