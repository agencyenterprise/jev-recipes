import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import {
  comparableDecision,
  deepEqual,
  listGoldenRecipeIds,
  loadRecipe,
  mapWithConcurrencyLimit,
  pickPaths,
  projectRoot,
  readGoldenCases,
  requireApiKey,
  roundedTo,
} from './lib/harness.mjs';

const CALIBRATION_EDGES = [0, 0.5, 0.6, 0.7, 0.8, 0.9, 1.000001];
const THRESHOLDS = [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95];
const TARGET_READY_ACCURACY = 0.95;
const REGRESSION_TOLERANCE = 0.05;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    write: { type: 'boolean', default: false },
    check: { type: 'boolean', default: false },
    concurrency: { type: 'string', default: '4' },
  },
});

requireApiKey();
const ids = positionals.length ? positionals : await listGoldenRecipeIds();
if (!ids.length) {
  console.error('No golden datasets found under evals/<recipe>/cases.jsonl.');
  process.exit(1);
}

let regressed = false;
for (const id of ids) {
  const report = await evaluateRecipe(id);
  printReport(report);
  if (values.check) regressed = (await checkAgainstSnapshot(report)) || regressed;
  if (values.write) await writeSnapshot(report);
}
if (regressed) process.exitCode = 1;

async function evaluateRecipe(id) {
  const { run } = await loadRecipe(id);
  const cases = await readGoldenCases(id);
  const rows = await mapWithConcurrencyLimit(
    cases,
    Number(values.concurrency),
    async (goldenCase) => {
      const base = {
        id: goldenCase.id,
        expected: goldenCase.expected,
        contested: goldenCase.contested === true,
        adversarial: goldenCase.adversarial === true,
      };
      try {
        const result = await run(goldenCase.input);
        const actual = pickPaths(result, Object.keys(goldenCase.expected));
        return {
          ...base,
          actual,
          confidence: result.confidence,
          status: result.status,
          model: result.model,
          correct: deepEqual(comparableDecision(actual), comparableDecision(goldenCase.expected)),
        };
      } catch (error) {
        return { ...base, error: error.message, correct: false };
      }
    },
  );
  return buildReport(id, rows);
}

function buildReport(id, rows) {
  const model = rows.find((row) => row.model)?.model ?? 'unknown';
  const thresholds = THRESHOLDS.map((threshold) => thresholdTradeoff(rows, threshold));
  return {
    recipe: id,
    model,
    cases: rows.length,
    accuracy: accuracyOf(rows),
    contestedAccuracy: accuracyOf(rows.filter((row) => row.contested)),
    adversarialAccuracy: accuracyOf(rows.filter((row) => row.adversarial)),
    calibration: calibrationOf(rows),
    thresholds,
    suggestedMinConfidence: suggestMinConfidence(thresholds),
    confusion: confusionOf(rows),
    failures: rows
      .filter((row) => !row.correct)
      .map(({ id: caseId, expected, actual, error, confidence, contested, adversarial }) => ({
        id: caseId,
        expected,
        ...(error === undefined ? { actual } : { error }),
        ...(confidence === undefined ? {} : { confidence: roundedTo(3, confidence) }),
        ...(contested ? { contested } : {}),
        ...(adversarial ? { adversarial } : {}),
      })),
  };
}

function accuracyOf(rows) {
  if (!rows.length) return null;
  return roundedTo(3, rows.filter((row) => row.correct).length / rows.length);
}

function calibrationOf(rows) {
  const scored = rows.filter((row) => row.confidence !== undefined);
  return CALIBRATION_EDGES.slice(0, -1).map((lower, index) => {
    const upper = CALIBRATION_EDGES[index + 1];
    const bucket = scored.filter((row) => row.confidence >= lower && row.confidence < upper);
    return {
      confidence: `${lower}-${Math.min(upper, 1)}`,
      cases: bucket.length,
      accuracy: accuracyOf(bucket),
    };
  });
}

function thresholdTradeoff(rows, threshold) {
  const ready = rows.filter((row) => row.confidence !== undefined && row.confidence >= threshold);
  return {
    minConfidence: threshold,
    deferRate: roundedTo(3, (rows.length - ready.length) / rows.length),
    readyAccuracy: accuracyOf(ready),
  };
}

function suggestMinConfidence(thresholds) {
  const sufficient = thresholds.find(
    (entry) => entry.readyAccuracy !== null && entry.readyAccuracy >= TARGET_READY_ACCURACY,
  );
  return sufficient?.minConfidence ?? null;
}

function confusionOf(rows) {
  const byExpected = new Map();
  for (const row of rows) {
    const expectedLabel = JSON.stringify(row.expected);
    const entry = byExpected.get(expectedLabel) ?? { total: 0, correct: 0, misses: {} };
    entry.total += 1;
    if (row.correct) entry.correct += 1;
    else {
      const actualLabel =
        row.error === undefined ? JSON.stringify(row.actual) : `error: ${row.error}`;
      entry.misses[actualLabel] = (entry.misses[actualLabel] ?? 0) + 1;
    }
    byExpected.set(expectedLabel, entry);
  }
  return Object.fromEntries([...byExpected.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

function printReport(report) {
  console.log(
    `${report.recipe}: accuracy ${format(report.accuracy)} over ${report.cases} cases ` +
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

async function writeSnapshot(report) {
  await mkdir(join(projectRoot, 'evals/results'), { recursive: true });
  await writeFile(snapshotPath(report.recipe), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`  Snapshot written to evals/results/${report.recipe}.json`);
}

async function checkAgainstSnapshot(report) {
  const previous = await readFile(snapshotPath(report.recipe), 'utf8')
    .then(JSON.parse)
    .catch(() => null);
  if (!previous) {
    console.log(`  No snapshot for ${report.recipe} yet; run with --write to create one.`);
    return false;
  }
  const drop = previous.accuracy - report.accuracy;
  if (drop > REGRESSION_TOLERANCE) {
    console.error(
      `  REGRESSION ${report.recipe}: accuracy fell from ${previous.accuracy} to ${report.accuracy}.`,
    );
    return true;
  }
  return false;
}
