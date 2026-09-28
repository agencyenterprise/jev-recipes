import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { readRun, replay } from '../../dist/evaluation/index.js';
import { recipeFingerprint } from '../../dist/evaluation/dataset.js';
import { summarizeEvidence } from './evidence.mjs';

export async function auditEvidence({ archivesDirectory, reportsDirectory, replayCurrent = true }) {
  const archives = [];
  const reports = [];
  const errors = [];
  const byId = new Map();
  for (const path of await archivePaths(archivesDirectory)) {
    try {
      const bytes = await readFile(path);
      const saved = JSON.parse(
        path.endsWith('.gz') ? gunzipSync(bytes).toString('utf8') : bytes.toString('utf8'),
      );
      if (saved.format === 1) {
        archives.push({
          path,
          format: saved.format,
          status: 'historical',
          replay: 'not-supported',
        });
        continue;
      }
      const run = await readRun(dirname(path));
      if (byId.has(run.runId)) throw new Error(`Duplicate run ID ${run.runId}.`);
      byId.set(run.runId, run);
      const current = run.recipeFingerprint === (await recipeFingerprint(run.recipe));
      const entry = {
        path,
        runId: run.runId,
        recipe: run.recipe,
        cases: run.cases.length,
        status: current ? 'current' : 'stale',
        replay: 'not-requested',
      };
      if (current && replayCurrent) {
        const updated = await replay(run);
        const changed = ['correct', 'ready', 'failed', 'correctItems'].filter(
          (field) => updated.report[field] !== run.report[field],
        );
        if (changed.length) throw new Error(`Replay changed ${changed.join(', ')}.`);
        entry.replay = 'matched';
      }
      archives.push(entry);
    } catch (error) {
      errors.push({ path, message: error.message });
    }
  }
  if (reportsDirectory) {
    for (const file of (await readdir(reportsDirectory))
      .filter((name) => name.endsWith('.json'))
      .sort()) {
      const path = join(reportsDirectory, file);
      try {
        const report = JSON.parse(await readFile(path, 'utf8'));
        const evidence = summarizeEvidence(report, await recipeFingerprint(report.recipe));
        const source = byId.get(report.evidence?.runId);
        if (source || report.evidence?.scoringRevision === 2) {
          if (!source)
            throw new Error('Current report has no retained source archive with its run ID.');
          for (const field of [
            'recipe',
            'cases',
            'correct',
            'ready',
            'failed',
            'accuracy',
            'readyAccuracy',
          ])
            if (report[field] !== source.report[field])
              throw new Error(`Report ${field} disagrees with its source archive.`);
          for (const field of [
            'recipeFingerprint',
            'datasetFingerprint',
            'split',
            'sourceMode',
            'evaluatedAt',
            'scoringRevision',
          ])
            if (report.evidence[field] !== source.report.evidence[field])
              throw new Error(`Report ${field} disagrees with its source archive.`);
        }
        reports.push({
          path,
          recipe: report.recipe,
          kind: evidence.kind,
          experimental: evidence.experimental,
          status: report.evidence?.scoringRevision === 2 ? 'checked' : 'historical',
        });
      } catch (error) {
        errors.push({ path, message: error.message });
      }
    }
  }
  return {
    archives,
    reports,
    errors,
    summary: {
      archives: archives.length,
      reports: reports.length,
      errors: errors.length,
      historicalArchives: archives.filter((run) => run.status === 'historical').length,
      historicalReports: reports.filter((report) => report.status === 'historical').length,
      current: archives.filter((run) => run.status === 'current').length,
      stale: archives.filter((run) => run.status === 'stale').length,
      replayed: archives.filter((run) => run.replay === 'matched').length,
    },
  };
}

async function archivePaths(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const own =
    entries.find((entry) => entry.isFile() && entry.name === 'run.json') ??
    entries.find((entry) => entry.isFile() && entry.name === 'run.json.gz');
  if (own) return [join(directory, own.name)];
  const paths = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name)))
    if (entry.isDirectory()) paths.push(...(await archivePaths(join(directory, entry.name))));
  return paths;
}
