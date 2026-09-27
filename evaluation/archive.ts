import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { z } from 'zod';
import { gunzipSync } from 'node:zlib';
import type { DecisionClient } from '../src/schema.js';
import {
  datasetFingerprints,
  fingerprint,
  loadEvaluationRecipe,
  recipeFingerprint,
  validateCases,
} from './dataset.js';
import { confidenceThresholds, evaluateCases } from './engine.js';
import type { EvaluationRow } from './engine.js';
import { buildReport } from './report.js';
import {
  evaluationCaseSchema,
  evaluationOptionsSchema,
  evaluationPolicySchema,
  priceSchema,
} from './schema.js';
import type { EvaluationOptions, EvaluationPolicy } from './schema.js';

const archiveSchema = z.object({
  format: z.literal(1),
  runId: z.string(),
  createdAt: z.iso.datetime(),
  mode: z.enum(['live', 'fixture', 'replay']),
  packageVersion: z.string(),
  recipe: z.string(),
  recipeFingerprint: z.string(),
  datasetFingerprint: z.string(),
  inputFingerprint: z.string(),
  answerKeyFingerprint: z.string(),
  split: z.enum(['development', 'held-out']),
  requestedModel: z.string(),
  policy: evaluationPolicySchema,
  price: priceSchema.optional(),
  cases: z.array(evaluationCaseSchema).min(1),
  rows: z.array(
    z
      .object({
        id: z.string(),
        expected: z.record(z.string(), z.unknown()),
        contested: z.boolean(),
        adversarial: z.boolean(),
        actual: z.record(z.string(), z.unknown()).optional(),
        result: z.unknown().optional(),
        error: z.string().optional(),
        confidence: z.number().min(0).max(1).optional(),
        model: z.string().optional(),
        correct: z.boolean(),
        ready: z.boolean(),
        durationMs: z.number().nonnegative(),
        decisions: z.array(
          z.object({
            minConfidence: z.number().min(0).max(1),
            ready: z.boolean(),
            correct: z.boolean(),
          }),
        ),
        exchanges: z.array(
          z.object({
            request: z.record(z.string(), z.unknown()),
            response: z.unknown().optional(),
            error: z.string().optional(),
            durationMs: z.number().nonnegative(),
          }),
        ),
      })
      .passthrough(),
  ),
  thresholds: z.array(z.number()),
  sourceRun: z.string().optional(),
  report: z.record(z.string(), z.unknown()),
});

export interface EvaluationRun extends Omit<z.infer<typeof archiveSchema>, 'rows' | 'report'> {
  rows: EvaluationRow[];
  report: ReturnType<typeof buildReport>;
}

export async function evaluate(
  name: string,
  values: unknown[],
  options: EvaluationOptions & {
    out?: string;
    client?: DecisionClient;
    mode?: 'live' | 'fixture';
  } = {},
): Promise<EvaluationRun> {
  const settings = evaluationOptionsSchema.parse(options);
  const recipe = await loadEvaluationRecipe(name);
  const allCases = validateCases(recipe, values);
  const cases = allCases.filter((entry) => entry.split === settings.split);
  if (!cases.length) throw new Error(`No ${settings.split} cases in the dataset.`);
  if (cases.length > settings.maxCases)
    throw new Error(
      `${cases.length} cases exceed maxCases=${settings.maxCases}. Set an explicit larger limit.`,
    );
  const sourceFingerprint = await recipeFingerprint(recipe.id);
  if (settings.split === 'held-out') {
    const chosen = settings.policy.selectedOn;
    if (!chosen)
      throw new Error('Held-out evaluation requires a policy frozen on a development run.');
    if (
      chosen.recipeFingerprint !== sourceFingerprint ||
      chosen.model !== (settings.model ?? 'provider-default')
    )
      throw new Error(
        'The frozen policy belongs to a different recipe version or requested model.',
      );
  }
  const manifest = JSON.parse(
    await readFile(new URL('../../package.json', import.meta.url), 'utf8'),
  ) as { version: string };
  const metadata = {
    format: 1 as const,
    runId: randomUUID(),
    createdAt: new Date().toISOString(),
    mode: options.mode ?? ('live' as 'live' | 'fixture'),
    packageVersion: manifest.version,
    recipe: recipe.id,
    recipeFingerprint: sourceFingerprint,
    ...datasetFingerprints(cases),
    split: settings.split,
    requestedModel: settings.model ?? 'provider-default',
    policy: settings.policy,
    ...(settings.price ? { price: settings.price } : {}),
    cases,
    thresholds:
      settings.split === 'development' && Object.hasOwn(recipe.inputSchema.shape, 'minConfidence')
        ? confidenceThresholds
        : [],
  };
  if (
    settings.policy.minConfidence !== undefined &&
    !Object.hasOwn(recipe.inputSchema.shape, 'minConfidence')
  )
    throw new Error('This recipe has no minConfidence policy.');
  if (options.out) await startArchive(options.out, metadata);
  const rows = await evaluateCases(recipe, applyPolicy(cases, settings.policy), {
    concurrency: settings.concurrency,
    maxRequests: settings.maxRequests,
    thresholds: metadata.thresholds,
    ...(options.client ? { client: options.client } : {}),
    ...(settings.model ? { model: settings.model } : {}),
    ...(options.out
      ? {
          onCase: (row: EvaluationRow, index: number) =>
            writeJson(join(options.out!, 'cases', `${String(index).padStart(6, '0')}.json`), row),
        }
      : {}),
  });
  const run: EvaluationRun = {
    ...metadata,
    rows,
    report: buildReport(
      recipe.id,
      rows,
      metadata.thresholds,
      settings.price,
      reportEvidence(metadata),
    ),
  };
  if (options.out) await finishArchive(options.out, run);
  return run;
}

export async function replay(
  run: EvaluationRun,
  policy: EvaluationPolicy = run.policy,
  out?: string,
): Promise<EvaluationRun> {
  const settings = evaluationPolicySchema.parse(policy);
  const recipe = await loadEvaluationRecipe(run.recipe);
  if ((await recipeFingerprint(run.recipe)) !== run.recipeFingerprint)
    throw new Error(
      'The installed recipe differs from this archive. Replay requires the recorded recipe version.',
    );
  if (run.split === 'held-out' && fingerprint(settings) !== fingerprint(run.policy))
    throw new Error(
      'Do not tune a policy on held-out data. Replay a development run to choose a policy.',
    );
  if (
    settings.minConfidence !== undefined &&
    !Object.hasOwn(recipe.inputSchema.shape, 'minConfidence')
  )
    throw new Error('This recipe has no minConfidence policy.');
  const cases = validateCases(recipe, run.cases);
  const metadata = {
    ...run,
    runId: randomUUID(),
    createdAt: new Date().toISOString(),
    mode: 'replay' as const,
    sourceRun: run.runId,
    policy: settings,
  };
  if (out) await startArchive(out, { ...metadata, rows: undefined, report: undefined });
  const rows = await evaluateCases(recipe, applyPolicy(cases, settings), {
    recorded: run.rows,
    thresholds: run.thresholds,
    ...(run.requestedModel === 'provider-default' ? {} : { model: run.requestedModel }),
  });
  const result = {
    ...metadata,
    rows,
    report: buildReport(run.recipe, rows, run.thresholds, run.price, reportEvidence(metadata)),
  };
  if (out) await finishArchive(out, result);
  return result;
}

export async function readRun(directory: string): Promise<EvaluationRun> {
  const content = await readFile(join(directory, 'run.json'), 'utf8').catch(
    async (error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') throw error;
      return gunzipSync(await readFile(join(directory, 'run.json.gz'))).toString('utf8');
    },
  );
  const parsed = archiveSchema.parse(JSON.parse(content));
  const run = parsed as unknown as EvaluationRun;
  const hashes = datasetFingerprints(run.cases);
  if (Object.entries(hashes).some(([key, hash]) => run[key as keyof typeof hashes] !== hash))
    throw new Error('Archive dataset fingerprints do not match its cases.');
  if (
    run.rows.length !== run.cases.length ||
    new Set(run.rows.map((row) => row.id)).size !== run.cases.length ||
    run.cases.some(
      (entry) =>
        !run.rows.some(
          (row) => row.id === entry.id && fingerprint(row.expected) === fingerprint(entry.expected),
        ),
    )
  )
    throw new Error('Archive case records are incomplete.');
  return {
    ...run,
    report: buildReport(run.recipe, run.rows, run.thresholds, run.price, reportEvidence(run)),
  };
}

export function freezePolicy(run: EvaluationRun): EvaluationPolicy {
  if (run.split !== 'development') throw new Error('Choose the policy on a development run.');
  return {
    ...run.policy,
    selectedOn: {
      runId: run.runId,
      datasetFingerprint: run.datasetFingerprint,
      recipeFingerprint: run.recipeFingerprint,
      model: run.requestedModel,
      split: 'development',
    },
  };
}

function reportEvidence(run: Omit<EvaluationRun, 'rows' | 'report'>) {
  const provenance = new Map<
    string,
    {
      method: EvaluationRun['cases'][number]['provenance']['method'];
      source: string;
      cases: number;
    }
  >();
  for (const entry of run.cases) {
    const key = JSON.stringify(entry.provenance);
    const counted = provenance.get(key) ?? { ...entry.provenance, cases: 0 };
    counted.cases++;
    provenance.set(key, counted);
  }
  return {
    runId: run.runId,
    evaluatedAt: run.createdAt,
    packageVersion: run.packageVersion,
    recipeFingerprint: run.recipeFingerprint,
    datasetFingerprint: run.datasetFingerprint,
    split: run.split,
    mode: run.mode,
    policy: run.policy,
    provenance: [...provenance.values()],
  };
}

export function compare(baseline: EvaluationRun, candidate: EvaluationRun) {
  if (
    baseline.recipe !== candidate.recipe ||
    baseline.inputFingerprint !== candidate.inputFingerprint ||
    baseline.answerKeyFingerprint !== candidate.answerKeyFingerprint
  )
    throw new Error(
      'Comparison requires the same recipe, case IDs, inputs, split, and answer key.',
    );
  const delta = (first: number | null, second: number | null) =>
    first === null || second === null ? null : Number((second - first).toFixed(6));
  const describe = (run: EvaluationRun) => ({
    runId: run.runId,
    packageVersion: run.packageVersion,
    recipeFingerprint: run.recipeFingerprint,
    requestedModel: run.requestedModel,
    models: run.report.models,
    policy: run.policy,
    mode: run.mode,
    report: run.report,
  });
  return {
    recipe: baseline.recipe,
    cases: baseline.cases.length,
    split: baseline.split,
    baseline: describe(baseline),
    candidate: describe(candidate),
    delta: {
      accuracy: delta(baseline.report.accuracy, candidate.report.accuracy),
      readyAccuracy: delta(baseline.report.readyAccuracy, candidate.report.readyAccuracy),
      review: candidate.report.review - baseline.report.review,
      failed: candidate.report.failed - baseline.report.failed,
    },
    changed: candidate.rows.flatMap((row) => {
      const before = baseline.rows.find((entry) => entry.id === row.id)!;
      return before.correct !== row.correct ||
        before.ready !== row.ready ||
        before.error !== row.error
        ? [
            {
              id: row.id,
              before: { correct: before.correct, ready: before.ready, error: before.error },
              after: { correct: row.correct, ready: row.ready, error: row.error },
            },
          ]
        : [];
    }),
  };
}

function applyPolicy(cases: EvaluationRun['cases'], policy: EvaluationPolicy) {
  return cases.map((entry) => ({
    ...entry,
    input: {
      ...entry.input,
      ...(policy.minConfidence === undefined ? {} : { minConfidence: policy.minConfidence }),
    },
  }));
}

async function startArchive(directory: string, metadata: unknown): Promise<void> {
  await mkdir(dirname(directory), { recursive: true });
  await mkdir(directory, { mode: 0o700 });
  await mkdir(join(directory, 'cases'), { mode: 0o700 });
  await writeJson(join(directory, 'manifest.json'), { status: 'running', metadata });
}

async function finishArchive(directory: string, run: EvaluationRun): Promise<void> {
  await writeJson(join(directory, 'run.json'), run);
  await writeJson(join(directory, 'report.json'), run.report);
  await writeJson(
    join(directory, 'policy.json'),
    run.split === 'development' ? freezePolicy(run) : run.policy,
  );
  await writeFile(
    join(directory, 'manifest.json'),
    JSON.stringify({ status: 'complete', runId: run.runId }, null, 2) + '\n',
    { mode: 0o600 },
  );
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await writeFile(path, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
}
