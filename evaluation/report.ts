import { isRecord, matchesExpected, roundedTo } from './decisions.js';
import type { EvaluationRow } from './engine.js';
import type { Price } from './schema.js';
import type { EvaluationCase, EvaluationPolicy } from './schema.js';

export interface ReportEvidence {
  runId: string;
  evaluatedAt: string;
  packageVersion: string;
  recipeFingerprint: string;
  datasetFingerprint: string;
  split: 'development' | 'held-out';
  mode: 'live' | 'fixture' | 'replay';
  policy: EvaluationPolicy;
  provenance: { method: EvaluationCase['provenance']['method']; source: string; cases: number }[];
}

export function buildReport(
  id: string,
  rows: EvaluationRow[],
  confidenceThresholds: number[],
  price?: Price,
  evidence?: ReportEvidence,
) {
  const completed = rows.filter((row) => row.error === undefined);
  const ready = completed.filter((row) => row.ready);
  const thresholds = confidenceThresholds.map((minConfidence) => {
    const decisions = completed
      .flatMap((row) => row.decisions)
      .filter((decision) => decision.minConfidence === minConfidence);
    const accepted = decisions.filter((decision) => decision.ready);
    return {
      minConfidence,
      deferRate: completed.length
        ? roundedTo(3, (completed.length - accepted.length) / completed.length)
        : null,
      readyAccuracy: accuracyOf(accepted),
      readyCases: accepted.length,
      reviewCases: completed.length - accepted.length,
      failedCases: rows.length - completed.length,
      readyAccuracyInterval95: wilsonInterval(
        accepted.filter((entry) => entry.correct).length,
        accepted.length,
      ),
    };
  });
  const usage = usageOf(rows);
  const models = [...new Set(rows.flatMap((row) => (row.model ? [row.model] : [])))].sort();
  return {
    ...(evidence ? { evidence } : {}),
    recipe: id,
    model: models.length === 1 ? models[0]! : models.length ? 'mixed' : 'unknown',
    models,
    cases: rows.length,
    completed: completed.length,
    failed: rows.length - completed.length,
    correct: rows.filter((row) => row.correct).length,
    wrong: completed.filter((row) => !row.correct).length,
    ready: ready.length,
    review: completed.length - ready.length,
    accuracy: accuracyOf(rows),
    completedAccuracy: accuracyOf(completed),
    accuracyInterval95: wilsonInterval(rows.filter((row) => row.correct).length, rows.length),
    readyAccuracy: accuracyOf(ready),
    readyAccuracyInterval95: wilsonInterval(
      ready.filter((row) => row.correct).length,
      ready.length,
    ),
    reviewRate: completed.length
      ? roundedTo(3, (completed.length - ready.length) / completed.length)
      : null,
    ...itemAccuracyOf(rows),
    contestedAccuracy: accuracyOf(rows.filter((row) => row.contested)),
    adversarialAccuracy: accuracyOf(rows.filter((row) => row.adversarial)),
    calibration: [0, 0.5, 0.6, 0.7, 0.8, 0.9].map((lower, index, edges) => {
      const upper = edges[index + 1] ?? 1.000001;
      const bucket = rows.filter(
        (row) => row.confidence !== undefined && row.confidence >= lower && row.confidence < upper,
      );
      return {
        confidence: `${lower}-${Math.min(upper, 1)}`,
        cases: bucket.length,
        accuracy: accuracyOf(bucket),
      };
    }),
    thresholdEvaluation:
      evidence?.split === 'held-out'
        ? 'frozen-policy'
        : confidenceThresholds.length
          ? 'recipe-replay'
          : 'not-applicable',
    thresholds,
    suggestedMinConfidence:
      thresholds.find((entry) => entry.readyAccuracy !== null && entry.readyAccuracy >= 0.95)
        ?.minConfidence ?? null,
    latencyMs: latencyOf(rows.map((row) => row.durationMs)),
    usage,
    cost:
      price &&
      usage.models.every((model) => model === price.model) &&
      usage.unknownResponses === 0 &&
      usage.failedRequests === 0
        ? {
            ...price,
            estimated: roundedTo(
              8,
              (usage.input_tokens * price.inputPerMillion +
                usage.output_tokens * price.outputPerMillion) /
                1_000_000,
            ),
          }
        : null,
    confusion: confusionOf(rows),
    failures: rows
      .filter((row) => !row.correct)
      .map(({ id, expected, actual, error, confidence, contested, adversarial }) => ({
        id,
        expected,
        ...(error === undefined ? { actual } : { error }),
        ...(confidence === undefined ? {} : { confidence: roundedTo(3, confidence) }),
        ...(contested ? { contested } : {}),
        ...(adversarial ? { adversarial } : {}),
      })),
  };
}

function accuracyOf(rows: { correct: boolean }[]): number | null {
  return rows.length ? roundedTo(3, rows.filter((row) => row.correct).length / rows.length) : null;
}

function itemAccuracyOf(rows: EvaluationRow[]) {
  const paths = rows.flatMap((row) =>
    Object.entries(row.expected).map(([path, expected]) => ({
      expected,
      actual: row.error === undefined ? row.actual?.[path] : undefined,
    })),
  );
  if (paths.length <= rows.length) return {};
  const correct = paths.filter((entry) => matchesExpected(entry.actual, entry.expected)).length;
  return {
    items: paths.length,
    correctItems: correct,
    itemAccuracy: roundedTo(3, correct / paths.length),
  };
}

export function wilsonInterval(correct: number, total: number): [number, number] | null {
  if (!total) return null;
  const z = 1.959963984540054;
  const proportion = correct / total;
  const denominator = 1 + (z * z) / total;
  const center = (proportion + (z * z) / (2 * total)) / denominator;
  const margin =
    (z * Math.sqrt((proportion * (1 - proportion)) / total + (z * z) / (4 * total * total))) /
    denominator;
  return [roundedTo(4, Math.max(0, center - margin)), roundedTo(4, Math.min(1, center + margin))];
}

function latencyOf(values: number[]) {
  const ordered = [...values].sort((a, b) => a - b);
  const percentile = (fraction: number) =>
    ordered[Math.max(0, Math.ceil(ordered.length * fraction) - 1)] ?? null;
  return {
    p50: percentile(0.5),
    p95: percentile(0.95),
    totalCaseTime: roundedTo(
      2,
      values.reduce((sum, value) => sum + value, 0),
    ),
  };
}

function usageOf(rows: EvaluationRow[]) {
  let input_tokens = 0,
    output_tokens = 0,
    unknownResponses = 0,
    failedRequests = 0;
  const models = new Set<string>();
  const exchanges = rows.flatMap((row) => row.exchanges);
  for (const exchange of exchanges) {
    if (exchange.error !== undefined) {
      failedRequests++;
      continue;
    }
    const response = exchange.response;
    if (isRecord(response) && typeof response.model === 'string') models.add(response.model);
    if (
      !isRecord(response) ||
      !isRecord(response.usage) ||
      typeof response.usage.input_tokens !== 'number' ||
      typeof response.usage.output_tokens !== 'number'
    ) {
      unknownResponses++;
      continue;
    }
    input_tokens += response.usage.input_tokens;
    output_tokens += response.usage.output_tokens;
  }
  return {
    requests: exchanges.length,
    input_tokens,
    output_tokens,
    unknownResponses,
    failedRequests,
    models: [...models].sort(),
  };
}

function confusionOf(rows: EvaluationRow[]) {
  const byExpected = new Map<
    string,
    { total: number; correct: number; misses: Record<string, number> }
  >();
  for (const row of rows) {
    const label = JSON.stringify(row.expected);
    const entry = byExpected.get(label) ?? {
      total: 0,
      correct: 0,
      misses: Object.create(null) as Record<string, number>,
    };
    entry.total++;
    if (row.correct) entry.correct++;
    else {
      const actual = row.error === undefined ? JSON.stringify(row.actual) : `error: ${row.error}`;
      entry.misses[actual!] = (entry.misses[actual!] ?? 0) + 1;
    }
    byExpected.set(label, entry);
  }
  return Object.fromEntries([...byExpected.entries()].sort(([a], [b]) => a.localeCompare(b)));
}
