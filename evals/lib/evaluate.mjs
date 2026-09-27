import { createClient } from '../../dist/src/client.js';
import {
  caseConfidence,
  comparableDecision,
  deepEqual,
  hasReviewAnywhere,
  mapWithConcurrencyLimit,
  pickPaths,
  roundedTo,
} from './harness.mjs';

const CALIBRATION_EDGES = [0, 0.5, 0.6, 0.7, 0.8, 0.9, 1.000001];
const THRESHOLDS = [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95];
const TARGET_READY_ACCURACY = 0.95;

export async function evaluateRecipe(
  recipe,
  cases,
  { client = createClient(), concurrency = 4 } = {},
) {
  const thresholds = Object.hasOwn(recipe.inputSchema.shape, 'minConfidence') ? THRESHOLDS : [];
  const rows = await mapWithConcurrencyLimit(cases, concurrency, (goldenCase) =>
    evaluateCase(recipe.run, goldenCase, client, thresholds),
  );
  return buildReport(recipe.id, rows, thresholds);
}

async function evaluateCase(run, goldenCase, client, thresholds) {
  const base = {
    id: goldenCase.id,
    expected: goldenCase.expected,
    contested: goldenCase.contested === true,
    adversarial: goldenCase.adversarial === true,
  };
  const exchanges = [];
  let result;
  try {
    result = await run(goldenCase.input, { client: recordResponses(client, exchanges) });
  } catch (error) {
    return { ...base, error: error.message, correct: false };
  }

  const actual = pickPaths(result, Object.keys(goldenCase.expected));
  const decisions = await replayThresholds(run, goldenCase, exchanges, thresholds);
  return {
    ...base,
    actual,
    confidence: caseConfidence(result, Object.keys(goldenCase.expected)),
    model: result?.model,
    correct: matchesExpected(actual, goldenCase.expected),
    decisions,
  };
}

function recordResponses(client, exchanges) {
  return {
    async systemOne(request, options) {
      const savedRequest = structuredClone(request);
      const response = await client.systemOne(request, options);
      exchanges.push({ request: savedRequest, response: structuredClone(response) });
      return response;
    },
  };
}

async function replayThresholds(run, goldenCase, exchanges, thresholds) {
  const decisions = [];
  for (const minConfidence of thresholds) {
    const result = await run(
      { ...goldenCase.input, minConfidence },
      { client: replayResponses(exchanges) },
    );
    const actual = pickPaths(result, Object.keys(goldenCase.expected));
    decisions.push({
      minConfidence,
      ready: isReady(result),
      correct: matchesExpected(actual, goldenCase.expected),
    });
  }
  return decisions;
}

function replayResponses(exchanges) {
  const remaining = [...exchanges];
  return {
    async systemOne(request) {
      const index = remaining.findIndex((exchange) => deepEqual(exchange.request, request));
      if (index === -1) throw new Error('Threshold replay requested an unrecorded model response.');
      const [exchange] = remaining.splice(index, 1);
      return structuredClone(exchange.response);
    },
  };
}

function isReady(result) {
  if (result === null) return false;
  if (result.status !== undefined) return result.status === 'ready';
  return !hasReviewAnywhere(result);
}

function matchesExpected(actual, expected) {
  return deepEqual(comparableDecision(actual), comparableDecision(expected));
}

function buildReport(id, rows, confidenceThresholds) {
  const thresholds = confidenceThresholds.map((threshold) => thresholdTradeoff(rows, threshold));
  return {
    recipe: id,
    model: rows.find((row) => row.model)?.model ?? 'unknown',
    cases: rows.length,
    accuracy: accuracyOf(rows),
    ...itemAccuracyOf(rows),
    contestedAccuracy: accuracyOf(rows.filter((row) => row.contested)),
    adversarialAccuracy: accuracyOf(rows.filter((row) => row.adversarial)),
    calibration: calibrationOf(rows),
    thresholdEvaluation: confidenceThresholds.length ? 'recipe-replay' : 'not-applicable',
    thresholds,
    suggestedMinConfidence: suggestMinConfidence(thresholds),
    confusion: confusionOf(rows),
    failures: rows.filter((row) => !row.correct).map(failureDetails),
  };
}

function itemAccuracyOf(rows) {
  const paths = rows.flatMap((row) =>
    Object.entries(row.expected).map(([path, expected]) => ({
      expected,
      actual: row.error === undefined ? row.actual[path] : undefined,
    })),
  );
  if (paths.length <= rows.length) return {};
  const correct = paths.filter((entry) => matchesExpected(entry.actual, entry.expected)).length;
  return { items: paths.length, itemAccuracy: roundedTo(3, correct / paths.length) };
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
  const ready = rows
    .flatMap((row) => row.decisions ?? [])
    .filter((decision) => decision.minConfidence === threshold && decision.ready);
  return {
    minConfidence: threshold,
    deferRate: roundedTo(3, (rows.length - ready.length) / rows.length),
    readyAccuracy: accuracyOf(ready),
  };
}

function suggestMinConfidence(thresholds) {
  return (
    thresholds.find(
      (entry) => entry.readyAccuracy !== null && entry.readyAccuracy >= TARGET_READY_ACCURACY,
    )?.minConfidence ?? null
  );
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

function failureDetails({ id, expected, actual, error, confidence, contested, adversarial }) {
  return {
    id,
    expected,
    ...(error === undefined ? { actual } : { error }),
    ...(confidence === undefined ? {} : { confidence: roundedTo(3, confidence) }),
    ...(contested ? { contested } : {}),
    ...(adversarial ? { adversarial } : {}),
  };
}
