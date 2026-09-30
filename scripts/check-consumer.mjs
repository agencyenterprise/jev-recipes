import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { npm, run } from './lib/process.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
let temporary;
try {
  const args = process.argv.slice(2);
  if (args.length !== 1)
    throw new Error('Usage: npm run check:consumer -- <archive.tgz-or-directory>');
  let archive = resolve(args[0]);
  if ((await stat(archive)).isDirectory()) {
    const archives = (await readdir(archive)).filter((name) => name.endsWith('.tgz'));
    if (archives.length !== 1)
      throw new Error('Expected exactly one .tgz archive in the directory.');
    archive = join(archive, archives[0]);
  }
  if (!archive.endsWith('.tgz')) throw new Error('Supply an npm .tgz archive.');

  temporary = await mkdtemp(join(tmpdir(), 'jev consumer '));
  const env = { ...process.env, npm_config_cache: join(temporary, 'cache') };
  delete env.TYPESAFE_API_KEY;
  delete env.NODE_OPTIONS;
  const options = { cwd: temporary, env };
  await writeFile(
    join(temporary, 'package.json'),
    JSON.stringify({ name: 'jev-consumer-check', private: true, type: 'module' }),
  );
  // Resolve real runtime dependencies from npm; do not link the development checkout.
  await npm(['install', '--ignore-scripts', '--no-audit', '--no-fund', archive], options);
  const installed = join(temporary, 'node_modules/jev-recipes');
  const manifest = JSON.parse(await readFile(join(installed, 'package.json'), 'utf8'));
  assert.equal(manifest.name, 'jev-recipes');
  const cli = join(installed, manifest.bin['jev-recipes']);
  const captured = { ...options, stdio: ['ignore', 'pipe', 'inherit'] };
  assert.equal(
    (await run(process.execPath, [cli, '--version'], captured)).trim(),
    manifest.version,
  );
  const demo = JSON.parse(await run(process.execPath, [cli, 'demo', 'route'], captured));
  assert.equal(demo.mode, 'demo');
  assert.equal(demo.result.status, 'ready');
  assert.equal(demo.result.route, 'billing');

  // Run the exact reproduction files against this archive, without their pinned install.
  for (const name of ['run.mjs', 'fixture.json'])
    await cp(join(root, 'examples/reproduction', name), join(temporary, name));
  const replay = await run(process.execPath, ['run.mjs'], captured);
  const newline = replay.indexOf('\n');
  assert.equal(JSON.parse(replay.slice(0, newline)).version, manifest.version);
  const replayResult = JSON.parse(replay.slice(newline + 1)).result;
  assert.equal(replayResult.route, 'billing');
  assert.equal(replayResult.status, 'ready');

  const inputTest = join(temporary, 'cli-input.test.mjs');
  await cp(join(root, 'tests/tooling/cli-input.test.mjs'), inputTest);
  await run(process.execPath, ['--test', inputTest], {
    ...options,
    env: { ...env, JEV_CLI_TEST_PATH: cli },
  });
  console.log(
    `Consumer checks passed: jev-recipes ${manifest.version}, ${process.version}, ${process.platform}.`,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (temporary) await rm(temporary, { recursive: true, force: true });
}
