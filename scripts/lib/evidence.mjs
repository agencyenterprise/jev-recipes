import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function readRecipeEvidence(root, compiledRoot, id) {
  const report = await readFile(join(root, 'evals/results', `${id}.json`), 'utf8')
    .then(JSON.parse)
    .catch((error) => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
  const fingerprint = await fingerprintRecipe(compiledRoot, id);
  return summarizeEvidence(report, fingerprint);
}

export function summarizeEvidence(report, fingerprint) {
  if (!report || report.evidence?.mode === 'fixture')
    return { kind: 'fixture', label: 'Fixture only', experimental: true, measurement: null };
  const current = report.evidence?.recipeFingerprint === fingerprint;
  const provenance = report.evidence?.provenance ?? [];
  const methods = new Set(provenance.map((entry) => entry.method));
  const method = methods.size > 1 ? 'mixed' : ([...methods][0] ?? 'unspecified');
  const kind = !current ? 'earlier' : method === 'author-synthetic' ? 'synthetic' : method;
  const labels = {
    earlier: 'Earlier-version measurement',
    synthetic: 'Current synthetic measurement',
    'public-dataset': 'Current public-dataset measurement',
    'human-reviewed': 'Current human-reviewed measurement',
    mixed: 'Current mixed-source measurement',
    unspecified: 'Current measurement; labels unspecified',
  };
  return {
    kind,
    label: labels[kind] ?? labels.unspecified,
    experimental: !current || report.acceptance?.met !== true,
    measurement: {
      model: report.model,
      date: report.evidence?.evaluatedAt ?? null,
      split: report.evidence?.split ?? null,
      cases: report.cases,
      ready: report.ready ?? null,
      reviewRate: report.reviewRate ?? null,
      readyAccuracy: report.readyAccuracy ?? null,
      failed: report.failed ?? null,
      provenance,
      acceptanceMet: report.acceptance?.met ?? null,
    },
  };
}

async function fingerprintRecipe(compiledRoot, id) {
  const root = pathToFileURL(compiledRoot + '/');
  const sources = new Map();
  async function visit(url) {
    if (sources.has(url.href)) return;
    const source = await readFile(url, 'utf8');
    sources.set(url.href, source);
    for (const match of source.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g))
      if (match[1].startsWith('.')) await visit(new URL(match[1], url));
  }
  await visit(new URL(`recipes/${id}/index.js`, root));
  const ordered = Object.fromEntries(
    [...sources]
      .map(([url, source]) => [url.slice(root.href.length), source])
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  );
  return createHash('sha256').update(JSON.stringify(ordered)).digest('hex');
}
