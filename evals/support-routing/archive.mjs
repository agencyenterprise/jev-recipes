import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { readRun } from 'jev-recipes/evaluation';
import { runSchema, validateWorkflowCases } from './schema.mjs';

export function hash(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

export async function workflowHash() {
  const paths = [
    '../../examples/support-routing/workflow.mjs',
    '../../examples/support-routing/schema.mjs',
    '../../examples/support-routing/fallback.mjs',
    './rules.mjs',
    './schema.mjs',
    './benchmark.mjs',
    './report.mjs',
    './archive.mjs',
  ];
  return hash(
    await Promise.all(
      paths.map(async (path) => [path, await readFile(new URL(path, import.meta.url), 'utf8')]),
    ),
  );
}

export async function startArchive(out) {
  await mkdir(dirname(out), { recursive: true });
  await mkdir(out, { mode: 0o700 });
  await mkdir(join(out, 'fallback'), { mode: 0o700 });
  await mkdir(join(out, 'rows'), { mode: 0o700 });
  await writeJson(join(out, 'manifest.json'), { status: 'running' });
}

export async function finishArchive(out, run) {
  await writeJson(join(out, 'workflow.json'), run);
  await writeJson(join(out, 'report.json'), run.report);
  await writeJson(join(out, 'integrity.json'), { workflow: hash(run) });
  await writeFile(join(out, 'manifest.json'), JSON.stringify({ status: 'complete' }) + '\n', {
    mode: 0o600,
  });
}

export async function writeJson(path, value) {
  await writeFile(path, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
}

export async function readWorkflowArchive(out) {
  const raw = JSON.parse(await readFile(join(out, 'workflow.json'), 'utf8'));
  const integrity = JSON.parse(await readFile(join(out, 'integrity.json'), 'utf8'));
  if (hash(raw) !== integrity.workflow) throw new Error('Workflow archive integrity mismatch.');
  const run = runSchema.parse(raw);
  validateWorkflowCases(run.cases);
  if (hash(run.cases) !== run.datasetHash) throw new Error('Workflow dataset changed.');
  if (
    run.rows.length !== run.cases.filter((entry) => entry.split === run.split).length ||
    new Set(run.rows.map((row) => row.id)).size !== run.rows.length
  )
    throw new Error('Workflow rows are incomplete.');
  for (const row of run.rows) {
    const entry = run.cases.find((value) => value.id === row.id && value.split === run.split);
    if (
      !entry ||
      row.expectedRoute !== entry.expectedRoute ||
      row.family !== entry.family ||
      row.group !== entry.group
    )
      throw new Error('Workflow row does not match its case.');
  }
  const primary = await readRun(join(out, 'primary'));
  const primaryContent = JSON.parse(await readFile(join(out, 'primary', 'run.json'), 'utf8'));
  if (hash(primaryContent) !== run.primaryArchiveHash || primary.runId !== run.primaryRunId)
    throw new Error('Primary archive changed.');
  return { run, primary };
}
