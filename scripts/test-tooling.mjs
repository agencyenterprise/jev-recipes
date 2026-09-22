import { readdir } from 'node:fs/promises';
import { run } from './lib/process.mjs';

try {
  const files = (await readdir('tests/tooling'))
    .filter((name) => name.endsWith('.test.mjs'))
    .sort();
  if (!files.length) throw new Error('No tooling tests found.');
  await run(process.execPath, ['--test', ...files.map((name) => `tests/tooling/${name}`)]);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
