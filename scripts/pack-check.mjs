import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { projectRoot } from './lib/recipes.mjs';
import { npm, run } from './lib/process.mjs';
import { checkPackageContents } from './lib/package.mjs';

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
    .filter((path) => !['.', './catalog', './package.json'].includes(path))
    .map((path) => path.slice(2));
  const packed = JSON.parse(
    await npm(['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], {
      ...options,
      cwd: projectRoot,
      stdio: ['ignore', 'pipe', 'inherit'],
    }),
  )[0];
  checkPackageContents(packed.files, ids, manifest.exports);

  // Install real archives in an unrelated directory. Local dependency archives keep this offline.
  const archives = [join(temporary, packed.filename)];
  for (const name of Object.keys(manifest.dependencies)) {
    const dependency = JSON.parse(
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
    )[0];
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
  await writeFile(
    join(consumer, 'types.ts'),
    ids
      .map(
        (id, index) => `import * as recipe${index} from 'jev-recipes/${id}';\nvoid recipe${index};`,
      )
      .join('\n') +
      `\nimport { describeRecipe, listRecipes } from 'jev-recipes/catalog';\nconst description = describeRecipe('route');\nlistRecipes({ limit: 3 });\nvoid description.inputSchema;\n`,
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
