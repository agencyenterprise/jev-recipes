import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { listRecipes, describeRecipe } from '../../dist/catalog/index.js';
import { recipeNames } from '../../dist/catalog/generated/names.js';
import { commandArgumentsSchema } from '../../dist/cli/schema.js';
import { loadRecipe } from '../../dist/catalog/runner.js';
import { projectRoot } from '../../scripts/lib/recipes.mjs';
import { run } from '../../scripts/lib/process.mjs';

test('catalog descriptions remain synchronous and independent of mutations by callers', () => {
  const route = describeRecipe('route');
  assert.equal(route.id, 'route');
  assert.equal(typeof route.then, 'undefined');
  assert.deepEqual(route.inputSchema.required, ['request', 'routes']);
  route.tags.push('caller mutation');
  route.inputSchema.required.length = 0;
  assert.ok(!describeRecipe('route').tags.includes('caller mutation'));
  assert.deepEqual(describeRecipe('route').inputSchema.required, ['request', 'routes']);
  assert.equal(listRecipes().length, recipeNames.length);
  const recipes = listRecipes();
  recipes[0].related.length = 0;
  assert.ok(listRecipes()[0].related.length > 0);
});

test('search finds task wording and supports category and limit without truncating the default list', () => {
  assert.equal(listRecipes({ query: 'route', limit: 1 })[0].id, 'route');
  assert.equal(listRecipes({ query: 'enough evidence', limit: 1 })[0].id, 'answerability');
  assert.equal(listRecipes({ query: 'can I answer this?', limit: 1 })[0].id, 'answerability');
  assert.equal(listRecipes({ query: 'claim supported', limit: 1 })[0].id, 'verify');
  assert.equal(listRecipes({ query: 'stop pause', limit: 1 })[0].id, 'cancellation-check');
  assert.equal(listRecipes({ query: 'writing criteria', limit: 1 })[0].id, 'tone-check');
  assert.ok(listRecipes({ category: 'memory' }).every((recipe) => recipe.category === 'memory'));
  assert.equal(listRecipes({ limit: 3 }).length, 3);
  assert.equal(listRecipes({ query: 'doesnotexist' }).length, 0);
  assert.throws(() => listRecipes({ limit: 0 }));
  assert.throws(() => describeRecipe('../route'));
  assert.throws(() => loadRecipe('__proto__'));
});

test('CLI accepts old invocations and both orders of the new list flags', () => {
  for (const args of [
    [],
    ['list'],
    ['list', 'evidence'],
    ['list', '--category', 'memory'],
    ['list', 'evidence', '--category', 'retrieval'],
    ['list', '--limit', '3', '--category', 'memory'],
    ['list', 'evidence', '--category', 'retrieval', '--limit', '3'],
  ]) {
    if (args.length) assert.ok(commandArgumentsSchema.safeParse(args).success, args.join(' '));
  }
  for (const args of [
    ['list', '--limit', '0'],
    ['list', '--limit', '1.5'],
    ['list', '--limit'],
    ['list', '--category', 'unknown'],
    ['list', '--limit', '3', '--limit', '4'],
    ['list', 'one', 'two'],
    ['list', '--bad'],
  ]) {
    assert.ok(!commandArgumentsSchema.safeParse(args).success, args.join(' '));
  }
});

test('CLI discovery cannot load recipe code or the SDK; demos load only their declared recipes', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'jev-import-check-'));
  try {
    const loader = join(temporary, 'loader.mjs');
    const register = join(temporary, 'register.mjs');
    await writeFile(
      loader,
      `
export async function load(url, context, nextLoad) {
  const recipe = url.includes('/dist/recipes/') ? url.split('/dist/recipes/')[1].split('/')[0] : null;
  const allowed = (process.env.ALLOWED_RECIPES || '').split(',');
  if (recipe && !allowed.includes(recipe)) throw new Error('Unexpected recipe import: ' + url);
  if (process.env.BLOCK_SDK === '1' && url.includes('/node_modules/@typesafe-ai/sdk/')) throw new Error('Discovery imported the SDK.');
  return nextLoad(url, context);
}
`,
    );
    await writeFile(
      register,
      `import { register } from 'node:module';\nregister(${JSON.stringify(pathToFileURL(loader).href)}, import.meta.url);\nglobalThis.fetch = () => { throw new Error('CLI tests must be offline.'); };\n`,
    );
    const cli = join(projectRoot, 'dist/cli/index.js');
    for (const args of [
      ['list', '--limit', '2'],
      ['describe', 'route'],
      ['example', 'route'],
    ]) {
      const output = await run(process.execPath, ['--import', register, cli, ...args], {
        env: { ...process.env, BLOCK_SDK: '1', ALLOWED_RECIPES: '' },
        stdio: ['ignore', 'pipe', 'inherit'],
      });
      JSON.parse(output);
    }
    for (const [name, allowed] of [
      ['route', 'route'],
      ['citation-match', 'citation-match,verify'],
    ]) {
      const output = await run(process.execPath, ['--import', register, cli, 'demo', name], {
        env: { ...process.env, BLOCK_SDK: '0', ALLOWED_RECIPES: allowed },
        stdio: ['ignore', 'pipe', 'inherit'],
      });
      assert.equal(JSON.parse(output).recipe, name);
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('every lazy runner validates input and executes its saved fixture offline', async () => {
  for (const id of recipeNames) {
    const fixture = JSON.parse(
      await readFile(join(projectRoot, 'recipes', id, 'demo.json'), 'utf8'),
    );
    const runner = await loadRecipe(id);
    let calls = 0;
    const client = {
      systemOne: async () => {
        calls++;
        return fixture.response;
      },
    };
    const result = await runner(fixture.input, { client });
    assert.equal(result.model, 'demo-fixture');
    assert.equal(calls, 1, id);
    await assert.rejects(async () => runner({}, { client }));
    assert.equal(calls, 1, `${id} must reject invalid input before inference`);
  }
});
