import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { projectRoot, readRecipes } from './lib/recipes.mjs';
import { renderCode, renderExports, writeOutputs } from './lib/generate.mjs';
import { renderDocs } from './lib/docs.mjs';

try {
  const args = process.argv.slice(2);
  if (args.some((arg) => !['--check', '--docs'].includes(arg)))
    throw new Error('Usage: node scripts/generate.mjs [--docs] [--check]');
  const records = await readRecipes();
  const files = renderCode(records);
  const manifest = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'));
  manifest.exports = renderExports(records);
  files.set('package.json', JSON.stringify(manifest));
  if (args.includes('--docs') || args.includes('--check')) {
    for (const [path, content] of await renderDocs(projectRoot, records)) files.set(path, content);
  }
  const changed = await writeOutputs(projectRoot, files, args.includes('--check'));
  console.log(
    `${args.includes('--check') ? 'Checked' : 'Generated'} ${records.length} recipes; ${changed.length} file(s) ${args.includes('--check') ? 'out of date' : 'updated'}.`,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
