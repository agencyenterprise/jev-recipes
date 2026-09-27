import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { projectRoot } from './lib/recipes.mjs';
import { npm, run } from './lib/process.mjs';
import { checkPackageContents, parsePackedArchive } from './lib/package.mjs';

let temporary;
try {
  if (process.argv.slice(2).some((arg) => arg !== '--built'))
    throw new Error('Usage: node scripts/pack-check.mjs [--built]');
  if (!process.argv.includes('--built')) {
    await npm(['run', 'generate:check']);
    await npm(['run', 'build']);
  }
  temporary = await mkdtemp(join(tmpdir(), 'jev-recipes-package-'));
  const options = { env: { ...process.env, npm_config_cache: join(temporary, 'cache') } };
  const manifest = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'));
  const ids = Object.keys(manifest.exports)
    .filter((path) => !['.', './catalog', './evaluation', './package.json'].includes(path))
    .map((path) => path.slice(2));
  const packed = parsePackedArchive(
    await npm(['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], {
      ...options,
      cwd: projectRoot,
      stdio: ['ignore', 'pipe', 'inherit'],
    }),
    manifest.name,
  );
  checkPackageContents(packed.files, ids, manifest.exports);

  // Install real archives in an unrelated directory. Local dependency archives keep this offline.
  const archives = [join(temporary, packed.filename)];
  for (const name of Object.keys(manifest.dependencies)) {
    const dependency = parsePackedArchive(
      await npm(
        [
          'pack',
          join(projectRoot, 'node_modules', name),
          '--ignore-scripts',
          '--json',
          '--pack-destination',
          temporary,
        ],
        { ...options, stdio: ['ignore', 'pipe', 'inherit'] },
      ),
      name,
    );
    archives.push(join(temporary, dependency.filename));
  }
  const consumer = join(temporary, 'consumer');
  await mkdir(consumer);
  await writeFile(
    join(consumer, 'package.json'),
    JSON.stringify({ name: 'jev-recipes-package-check', private: true, type: 'module' }),
  );
  await npm(
    [
      'install',
      '--offline',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      '--package-lock=false',
      ...archives,
    ],
    { ...options, cwd: consumer },
  );
  const packageRoot = join(consumer, 'node_modules', manifest.name);
  const fixtureScript = `
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { listRecipes, describeRecipe } from 'jev-recipes/catalog';
import * as root from 'jev-recipes';
globalThis.fetch = () => { throw new Error('Package checks must be offline.'); };
const ids = ${JSON.stringify(ids)};
assert.equal(listRecipes().length, ids.length);
for (const id of ids) {
  const module = await import('jev-recipes/' + id);
  const candidates = Object.entries(module).filter(([, value]) => typeof value === 'function');
  assert.equal(candidates.length, 1);
  const [name, recipe] = candidates[0];
  assert.equal(root[name], recipe);
  const fixture = JSON.parse(await readFile(new URL('./node_modules/jev-recipes/dist/recipes/' + id + '/demo.json', import.meta.url), 'utf8'));
  const result = await recipe(fixture.input, { client: { systemOne: async () => fixture.response } });
  assert.equal(result.model, fixture.response.model);
  assert.ok(describeRecipe(id).inputSchema.properties);
}
console.log('Verified ' + ids.length + ' installed recipe imports, root exports, schemas, and offline decisions.');
`;
  await writeFile(join(consumer, 'smoke.mjs'), fixtureScript);
  await run(process.execPath, ['smoke.mjs'], { cwd: consumer });
  const cli = join(packageRoot, 'dist/cli/index.js');
  for (const args of [
    ['--version'],
    ['list', 'evidence', '--limit', '3'],
    ['describe', 'route'],
    ['example', 'route'],
    ['demo', 'all'],
  ]) {
    const output = await run(process.execPath, [cli, ...args], {
      cwd: consumer,
      stdio: ['ignore', 'pipe', 'inherit'],
    });
    if (args[0] !== '--version') JSON.parse(output);
  }
  const routeFixture = JSON.parse(
    await readFile(join(packageRoot, 'dist/recipes/route/demo.json'), 'utf8'),
  );
  const cases = [
    {
      id: 'invoice',
      input: routeFixture.input,
      expected: { suggestedRoute: 'billing' },
      rationale: 'The customer asks about an invoice.',
    },
  ];
  await writeFile(
    join(consumer, 'cases.jsonl'),
    cases.map((entry) => JSON.stringify(entry)).join('\n') + '\n',
  );
  await writeFile(
    join(consumer, 'provider.mjs'),
    `
import assert from 'node:assert/strict';
const response = ${JSON.stringify(routeFixture.response)};
globalThis.fetch = async (url, options) => {
  assert.equal(new URL(url).hostname, 'api.typesafe.ai');
  assert.equal(JSON.parse(options.body).state.request, ${JSON.stringify(routeFixture.input.request)});
  return new Response(JSON.stringify(response), { headers: { 'content-type': 'application/json' } });
};
`,
  );
  await writeFile(
    join(consumer, 'offline.mjs'),
    `
globalThis.fetch = () => { throw new Error('Replay and compare must not contact a provider.'); };
delete process.env.TYPESAFE_API_KEY;
`,
  );
  const evaluateOutput = JSON.parse(
    await run(
      process.execPath,
      [
        '--import',
        './provider.mjs',
        cli,
        'evaluate',
        'route',
        '--cases',
        'cases.jsonl',
        '--out',
        'evaluation',
      ],
      {
        cwd: consumer,
        env: { ...process.env, TYPESAFE_API_KEY: 'package-check-fixture' },
        stdio: ['ignore', 'pipe', 'inherit'],
      },
    ),
  );
  if (evaluateOutput.report.correct !== 1 || evaluateOutput.report.failed !== 0)
    throw new Error('Installed evaluation did not use the saved provider fixture.');
  const replayOutput = JSON.parse(
    await run(
      process.execPath,
      [
        '--import',
        './offline.mjs',
        cli,
        'replay',
        'evaluation',
        '--min-confidence',
        '1',
        '--out',
        'replayed',
      ],
      {
        cwd: consumer,
        stdio: ['ignore', 'pipe', 'inherit'],
      },
    ),
  );
  if (replayOutput.report.review !== 1 || replayOutput.report.failed !== 0)
    throw new Error('Installed replay did not apply the changed review policy.');
  const comparison = JSON.parse(
    await run(
      process.execPath,
      ['--import', './offline.mjs', cli, 'compare', 'evaluation', 'replayed'],
      {
        cwd: consumer,
        stdio: ['ignore', 'pipe', 'inherit'],
      },
    ),
  );
  if (comparison.delta.review !== 1)
    throw new Error('Installed comparison lost the policy change.');
  await writeFile(
    join(consumer, 'evaluation-api.mjs'),
    `
import assert from 'node:assert/strict';
import { evaluate, replay, compare, readRun } from 'jev-recipes/evaluation';
const run = await readRun('evaluation');
assert.equal((await replay(run)).report.correct, 1);
assert.equal(compare(run, run).delta.accuracy, 0);
assert.equal(typeof evaluate, 'function');
`,
  );
  await run(process.execPath, ['--import', './offline.mjs', 'evaluation-api.mjs'], {
    cwd: consumer,
  });
  console.log(
    'Verified installed evaluation CLI and API, response archives, offline policy replay, and comparison without development dependencies.',
  );
  await writeFile(
    join(consumer, 'types.ts'),
    ids
      .map(
        (id, index) => `import * as recipe${index} from 'jev-recipes/${id}';\nvoid recipe${index};`,
      )
      .join('\n') +
      `\nimport { describeRecipe, listRecipes } from 'jev-recipes/catalog';\nconst description = describeRecipe('route');\nlistRecipes({ limit: 3 });\nvoid description.inputSchema;\nimport { evaluate, replay, compare, readRun } from 'jev-recipes/evaluation';\nvoid [evaluate, replay, compare, readRun];\n`,
  );
  await run(
    process.execPath,
    [
      join(projectRoot, 'node_modules/typescript/bin/tsc'),
      '--noEmit',
      '--strict',
      '--module',
      'NodeNext',
      '--moduleResolution',
      'NodeNext',
      '--target',
      'ES2022',
      'types.ts',
    ],
    { cwd: consumer },
  );
  console.log(
    `Package verified: ${packed.entryCount} files, ${packed.size} bytes compressed, ${packed.unpackedSize} bytes unpacked. Tests and development files are excluded.`,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (temporary) await rm(temporary, { recursive: true, force: true });
}
