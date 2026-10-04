import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { projectRoot } from '../../scripts/lib/recipes.mjs';
import { run } from '../../scripts/lib/process.mjs';

test('the client entry point loads without importing any recipe or the catalog', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'jev-client-entry-'));
  try {
    const loader = join(temporary, 'loader.mjs');
    const register = join(temporary, 'register.mjs');
    await writeFile(
      loader,
      `
export async function load(url, context, nextLoad) {
  if (url.includes('/dist/recipes/') || url.includes('/dist/catalog/'))
    throw new Error('The client entry imported recipe code: ' + url);
  return nextLoad(url, context);
}
`,
    );
    await writeFile(
      register,
      `import { register } from 'node:module';\nregister(${JSON.stringify(pathToFileURL(loader).href)}, import.meta.url);\n`,
    );
    const entry = join(projectRoot, 'dist/src/create-client.js');
    const output = await run(
      process.execPath,
      [
        '--import',
        register,
        '--input-type=module',
        '-e',
        `const { createClient } = await import(${JSON.stringify(pathToFileURL(entry).href)});\nconsole.log(typeof createClient({ apiKey: 'offline-check' }).systemOne);`,
      ],
      { stdio: ['ignore', 'pipe', 'inherit'] },
    );
    assert.equal(output.trim(), 'function');
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
