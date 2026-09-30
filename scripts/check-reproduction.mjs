import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { npm, run } from './lib/process.mjs';

const example = fileURLToPath(new URL('../examples/reproduction/', import.meta.url));
let temporary;
try {
  const args = process.argv.slice(2);
  if (args.length !== 1 || !['pinned', 'latest'].includes(args[0]))
    throw new Error('Usage: npm run check:reproduction -- <pinned|latest>');
  const mode = args[0];
  temporary = await mkdtemp(join(tmpdir(), 'jev reproduction '));
  // Copy only shareable source; never pick up node_modules, .env, or local logs.
  for (const name of ['package.json', 'package-lock.json', 'run.mjs', 'fixture.json'])
    await cp(join(example, name), join(temporary, name));
  const env = { ...process.env, npm_config_cache: join(temporary, 'cache') };
  delete env.TYPESAFE_API_KEY;
  delete env.NODE_OPTIONS;
  const options = { cwd: temporary, env };
  await npm(
    mode === 'pinned'
      ? ['ci', '--ignore-scripts', '--no-audit', '--no-fund']
      : [
          'install',
          '--ignore-scripts',
          '--no-audit',
          '--no-fund',
          '--no-save',
          '--package-lock=false',
          'jev-recipes@latest',
        ],
    options,
  );
  const { version } = JSON.parse(
    await readFile(join(temporary, 'node_modules/jev-recipes/package.json'), 'utf8'),
  );
  if (mode === 'pinned') {
    const manifest = JSON.parse(await readFile(join(temporary, 'package.json'), 'utf8'));
    assert.equal(version, manifest.dependencies['jev-recipes']);
  }
  const output = await run(process.execPath, ['run.mjs'], {
    ...options,
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  const newline = output.indexOf('\n');
  const metadata = JSON.parse(output.slice(0, newline));
  const { result } = JSON.parse(output.slice(newline + 1));
  assert.equal(metadata.version, version);
  assert.equal(metadata.mode, 'fixture');
  assert.equal(result.status, 'ready');
  assert.equal(result.route, 'billing');
  assert.equal(result.model, 'saved-reproduction');
  console.log(
    `Standalone reproduction passed (${mode}): jev-recipes ${version}, ${process.version}.`,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (temporary) await rm(temporary, { recursive: true, force: true });
}
