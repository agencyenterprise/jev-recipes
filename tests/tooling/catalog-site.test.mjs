import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { listRecipes } from '../../dist/catalog/index.js';
import { run } from '../../scripts/lib/process.mjs';

test('the static catalog contains valid source entries, executable fixtures, and related contracts', async () => {
  await run(process.execPath, ['site/build.mjs'], { stdio: ['ignore', 'pipe', 'pipe'] });
  const catalog = JSON.parse(await readFile('site/dist/catalog.json', 'utf8'));
  assert.equal(catalog.recipes.length, listRecipes().length);
  for (const entry of catalog.recipes) {
    const detail = JSON.parse(await readFile(`site/dist/recipes/${entry.id}.json`, 'utf8'));
    assert.equal(detail.id, entry.id);
    assert.ok(detail.functionName);
    assert.ok(detail.inputSchema.properties);
    assert.ok(detail.resultSchema.properties || detail.resultSchema.anyOf, entry.id);
    assert.equal(detail.fixture.result.model, 'demo-fixture');
    for (const related of detail.related)
      assert.ok(catalog.recipes.some((recipe) => recipe.id === related.id));
  }
  const route = JSON.parse(await readFile('site/dist/recipes/route.json', 'utf8'));
  assert.equal(route.fixture.policies['1'].status, 'review');
  const first = await readFile('site/dist/catalog.json', 'utf8');
  await run(process.execPath, ['site/build.mjs'], { stdio: ['ignore', 'pipe', 'pipe'] });
  assert.equal(await readFile('site/dist/catalog.json', 'utf8'), first);
});
