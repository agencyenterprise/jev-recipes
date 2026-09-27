import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { readDevelopmentBaseline } from '../../evals/lib/baselines.mjs';
import { validateCases, loadEvaluationRecipe, fingerprint } from '../../dist/evaluation/dataset.js';

test('all featured datasets have distinct cases, family-separated holdouts, and explicit label provenance', async () => {
  const collections = JSON.parse(
    await readFile(new URL('../../evals/featured.json', import.meta.url), 'utf8'),
  );
  const ids = Object.values(collections).flat();
  assert.equal(new Set(ids).size, 20);
  for (const id of ids) {
    const values = (
      await readFile(new URL(`../../evals/${id}/cases.jsonl`, import.meta.url), 'utf8')
    )
      .trim()
      .split('\n')
      .map(JSON.parse);
    const cases = validateCases(await loadEvaluationRecipe(id), values);
    const baseline = await readDevelopmentBaseline(id, cases);
    assert.equal(baseline.evidence.split, 'development', id);
    const metadata = JSON.parse(
      await readFile(new URL(`../../evals/${id}/dataset.json`, import.meta.url), 'utf8'),
    );
    assert.ok(cases.length >= 100, id);
    assert.equal(metadata.cases, cases.length, id);
    assert.equal(metadata.heldOut, cases.filter((entry) => entry.split === 'held-out').length, id);
    assert.equal(
      metadata.development,
      cases.filter((entry) => entry.split === 'development').length,
      id,
    );
    assert.ok(metadata.heldOut >= 20, id);
    assert.ok(
      cases.every((entry) => entry.provenance.source && entry.family),
      id,
    );
    assert.equal(
      new Set(cases.map((entry) => fingerprint(entry.input))).size,
      cases.length,
      `${id}: duplicate input`,
    );
    assert.ok(
      cases.some((entry) => entry.split === 'development') &&
        cases.some((entry) => entry.split === 'held-out'),
    );
  }
});
