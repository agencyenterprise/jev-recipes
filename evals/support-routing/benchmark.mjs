import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import { evaluate, freezePolicy, replay } from 'jev-recipes/evaluation';
import {
  resolveRoutingDecision,
  primaryFailure,
} from '../../examples/support-routing/workflow.mjs';
import { fallbackRequest } from '../../examples/support-routing/fallback.mjs';
import { policySchema, validateWorkflowCases, rowSchema, runSchema } from './schema.mjs';
import { routeWithRules } from './rules.mjs';
import { buildWorkflowReport } from './report.mjs';
import {
  hash,
  workflowHash,
  startArchive,
  finishArchive,
  writeJson,
  readWorkflowArchive,
} from './archive.mjs';

export async function benchmarkRouting({
  values,
  policy: settings,
  split = 'development',
  mode = 'fixture',
  client,
  fallbackFactory,
  out,
  development,
}) {
  const cases = validateWorkflowCases(values);
  const policy = policySchema.parse(settings);
  if (!['fixture', 'live'].includes(mode)) throw new Error('Choose fixture or live mode.');
  if (!['development', 'held-out'].includes(split)) throw new Error('Unknown split.');
  const fingerprint = await workflowHash();
  let frozen;
  if (development) {
    frozen = await readWorkflowArchive(development);
    if (
      frozen.run.split !== 'development' ||
      frozen.run.sourceMode !== mode ||
      hash(frozen.run.policy) !== hash(policy) ||
      frozen.run.datasetHash !== hash(cases) ||
      frozen.run.workflowHash !== fingerprint
    )
      throw new Error('Development policy, dataset, mode, or workflow changed.');
  }
  if (split === 'held-out' && !frozen)
    throw new Error('Held-out evaluation requires a frozen development archive.');
  if (!cases.some((entry) => entry.split === split))
    throw new Error('No cases in the requested split.');
  await startArchive(out);
  const primary = await evaluate(
    'route',
    cases.map((entry) => ({
      id: entry.id,
      family: entry.family,
      split: entry.split,
      input: entry.input,
      expected: { suggestedRoute: entry.expectedRoute },
      rationale: entry.rationale,
      provenance: entry.provenance,
    })),
    {
      client,
      model: policy.primaryModel,
      split,
      mode,
      out: join(out, 'primary'),
      policy: frozen ? freezePolicy(frozen.primary) : { minConfidence: policy.minConfidence },
      concurrency: 2,
      maxCases: 200,
      maxRequests: 200,
    },
  );
  const run = {
    format: 1,
    createdAt: new Date().toISOString(),
    mode,
    sourceMode: mode,
    split,
    policy,
    datasetHash: hash(cases),
    workflowHash: fingerprint,
    primaryRunId: primary.runId,
    primaryArchiveHash: hash(JSON.parse(await readFile(join(out, 'primary', 'run.json'), 'utf8'))),
    cases,
    rows: [],
    report: {},
  };
  for (const [index, entry] of cases.filter((entry) => entry.split === split).entries()) {
    const saved = primary.rows.find((row) => row.id === entry.id);
    let exchange = null;
    const fallback = fallbackFactory(async (record) => {
      if (exchange) throw new Error('Only one fallback exchange is permitted per case.');
      exchange = record;
      await writeJson(join(out, 'fallback', `${index}.json`), record);
    });
    const input = { ...entry.input, minConfidence: policy.minConfidence };
    const direct =
      saved.error !== undefined
        ? primaryFailure(saved.error)
        : await resolveRoutingDecision(input, saved.result);
    const cascade =
      saved.error !== undefined
        ? direct
        : await resolveRoutingDecision(input, saved.result, { fallback });
    if ((cascade.source === 'fallback') !== Boolean(exchange))
      throw new Error('An attempted fallback must retain exactly one exchange.');
    const row = rowSchema.parse({
      id: entry.id,
      group: entry.group,
      family: entry.family,
      expectedRoute: entry.expectedRoute,
      rules: routeWithRules(input, policy.rules),
      primary: direct,
      cascade,
      primaryDurationMs: saved.durationMs,
      fallbackExchange: exchange,
    });
    run.rows.push(row);
    await writeJson(join(out, 'rows', `${index}.json`), row);
  }
  run.report = buildWorkflowReport(run, primary.rows);
  runSchema.parse(run);
  await finishArchive(out, run);
  return run;
}

export async function replayWorkflow(directory, settings) {
  const { run, primary } = await readWorkflowArchive(directory);
  if (run.workflowHash !== (await workflowHash()))
    throw new Error('Workflow code changed since recording.');
  const policy = policySchema.parse(settings ?? run.policy);
  if (run.split === 'held-out' && hash(policy) !== hash(run.policy))
    throw new Error('Do not tune held-out policies.');
  if (policy.primaryModel !== run.policy.primaryModel) throw new Error('Primary model changed.');
  const replayed = await replay(primary, {
    ...primary.policy,
    minConfidence: policy.minConfidence,
  });
  const result = { ...run, mode: 'replay', policy, rows: [], report: {} };
  for (const entry of run.cases.filter((value) => value.split === run.split)) {
    const saved = replayed.rows.find((row) => row.id === entry.id);
    const previous = run.rows.find((row) => row.id === entry.id);
    const input = { ...entry.input, minConfidence: policy.minConfidence };
    const needsFallback = saved.result?.status === 'review' && saved.result.suggestedRoute !== null;
    if (
      needsFallback &&
      (!previous.fallbackExchange ||
        hash(previous.fallbackExchange.request) !==
          hash(fallbackRequest(input, policy.fallbackModel)))
    )
      throw new Error('Replay needs an unrecorded fallback response.');
    const direct =
      saved.error !== undefined
        ? primaryFailure(saved.error)
        : await resolveRoutingDecision(input, saved.result);
    const cascade =
      saved.error !== undefined
        ? direct
        : await resolveRoutingDecision(input, saved.result, {
            fallback: async () => {
              const exchange = previous.fallbackExchange;
              if (exchange.error !== undefined) throw new Error(exchange.error);
              const response = JSON.parse(exchange.response);
              return { ...JSON.parse(response.choices[0].message.content), model: response.model };
            },
          });
    result.rows.push({
      ...previous,
      rules: routeWithRules(input, policy.rules),
      primary: direct,
      cascade,
      fallbackExchange: needsFallback ? previous.fallbackExchange : null,
    });
  }
  result.report = buildWorkflowReport(result, replayed.rows);
  return result;
}

export function compareWorkflowRuns(first, second) {
  if (
    first.datasetHash !== second.datasetHash ||
    first.split !== second.split ||
    first.workflowHash !== second.workflowHash ||
    hash(first.policy) !== hash(second.policy)
  )
    throw new Error('Comparison requires identical cases, split, workflow, and policy.');
  return { first: first.report, second: second.report };
}
