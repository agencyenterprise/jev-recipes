import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { format, resolveConfig } from 'prettier';
import { datasetFingerprints } from '../../dist/evaluation/dataset.js';
import { projectRoot } from './harness.mjs';

export async function readDevelopmentBaseline(id, cases, { expectedScoringRevision } = {}) {
  const path = join(projectRoot, 'evals/baselines', `${id}.json`);
  const baseline =
    (await readReport(path)) ??
    (await readReport(join(projectRoot, 'evals/results', `${id}.json`)));
  const development = cases.filter((entry) => entry.split === 'development');
  const { datasetFingerprint } = datasetFingerprints(development);
  if (
    !baseline ||
    baseline.recipe !== id ||
    baseline.evidence?.split !== 'development' ||
    baseline.evidence.datasetFingerprint !== datasetFingerprint ||
    baseline.cases !== development.length
  )
    throw new Error(
      `Cannot compare ${id}: the baseline uses a different dataset or split, or has no recorded dataset identity. Save a development baseline for these cases before using --check.`,
    );
  if (
    !Number.isFinite(baseline.accuracy) ||
    baseline.accuracy < 0 ||
    baseline.accuracy > 1 ||
    !baseline.model ||
    ['mixed', 'unknown'].includes(baseline.model)
  )
    throw new Error(
      `Cannot compare ${id}: the development baseline needs measured accuracy and one known model.`,
    );
  if (
    expectedScoringRevision !== undefined &&
    (baseline.evidence.scoringRevision ?? 1) !== expectedScoringRevision
  )
    throw new Error(
      `Cannot compare ${id}: the baseline uses a different scoring revision. Create a current development baseline before using --check.`,
    );
  return baseline;
}

export async function saveDevelopmentBaseline(report) {
  if (report.evidence?.split !== 'development')
    throw new Error('Only development reports can become regression baselines.');
  const directory = join(projectRoot, 'evals/baselines');
  await mkdir(directory, { recursive: true });
  const config = await resolveConfig(join(projectRoot, 'package.json'));
  await writeFile(
    join(directory, `${report.recipe}.json`),
    await format(JSON.stringify(report), { ...config, parser: 'json' }),
  );
}

async function readReport(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}
