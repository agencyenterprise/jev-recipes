import assert from 'node:assert/strict';
import { test } from 'node:test';
import { summarizeEvidence } from '../../scripts/lib/evidence.mjs';
import { listRecipes } from '../../dist/catalog/index.js';
import { recipeFingerprint } from '../../dist/evaluation/dataset.js';
import { readFile } from 'node:fs/promises';

const report = {
  model: 'fixture-model',
  cases: 40,
  ready: 30,
  reviewRate: 0.25,
  readyAccuracy: 0.9,
  failed: 0,
  evidence: {
    mode: 'live',
    recipeFingerprint: 'current',
    evaluatedAt: '2026-09-27',
    split: 'held-out',
    provenance: [{ method: 'author-synthetic', source: 'Synthetic labels', cases: 40 }],
  },
  acceptance: { met: false },
};

test('evidence separates measurement provenance, source freshness, and acceptance', () => {
  assert.equal(summarizeEvidence(null, 'current').kind, 'fixture');
  assert.equal(
    summarizeEvidence({ ...report, evidence: { ...report.evidence, mode: 'fixture' } }, 'current')
      .measurement,
    null,
  );
  assert.equal(summarizeEvidence(report, 'changed').kind, 'earlier');
  assert.equal(summarizeEvidence(report, 'current').kind, 'synthetic');
  assert.equal(summarizeEvidence(report, 'current').experimental, true);
  const publicReport = {
    ...report,
    acceptance: { met: true },
    evidence: {
      ...report.evidence,
      provenance: [
        {
          method: 'public-dataset',
          source: 'Labels derived from source markup, not independent review.',
          cases: 40,
        },
      ],
    },
  };
  assert.equal(summarizeEvidence(publicReport, 'current').kind, 'public-dataset');
  assert.equal(summarizeEvidence(publicReport, 'current').experimental, false);
  assert.equal(summarizeEvidence(publicReport, 'changed').experimental, true);
});

test('catalog evidence agrees with the installed evaluator fingerprint and recorded reports', async () => {
  for (const recipe of listRecipes()) {
    const saved = await readFile(
      new URL(`../../evals/results/${recipe.id}.json`, import.meta.url),
      'utf8',
    )
      .then(JSON.parse)
      .catch((error) => {
        if (error.code === 'ENOENT') return null;
        throw error;
      });
    assert.deepEqual(
      recipe.evidence,
      summarizeEvidence(saved, await recipeFingerprint(recipe.id)),
      recipe.id,
    );
  }
});
