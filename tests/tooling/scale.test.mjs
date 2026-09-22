import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, writeFile, readFile, cp, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';
import ts from 'typescript';
import { renderCode, renderExports, writeOutputs } from '../../scripts/lib/generate.mjs';
import { validateRecipeGraph, projectRoot } from '../../scripts/lib/recipes.mjs';
import { searchRecipes } from '../../dist/catalog/search.js';
import { run } from '../../scripts/lib/process.mjs';

test(
  'generation, discovery, and selective execution work with 1,000 temporary entries',
  { timeout: 120_000 },
  async (context) => {
    const temporary = await mkdtemp(join(tmpdir(), 'jev-catalog-scale-'));
    try {
      const records = Array.from({ length: 1000 }, (_, index) => {
        const id = `synthetic-${String(index).padStart(4, '0')}`;
        return {
          id,
          functionName: `synthetic${index}`,
          inputName: `synthetic${index}InputSchema`,
          resultName: `synthetic${index}ResultSchema`,
          values: [
            `synthetic${index}`,
            `synthetic${index}InputSchema`,
            `synthetic${index}ResultSchema`,
          ],
          types: [],
          dependencies: [],
          metadata: {
            id,
            title: `Synthetic decision ${index}`,
            description: 'A temporary catalog capacity fixture.',
            category: 'workflow',
            tags: ['synthetic', `task${index}`],
            useWhen: `You need synthetic task${index}.`,
            related: [],
            limitations: ['Only a tooling fixture.'],
          },
          inputSchema: {
            type: 'object',
            properties: { text: { type: 'string' } },
            required: ['text'],
          },
          resultSchema: { type: 'object', properties: { model: { type: 'string' } } },
        };
      });
      validateRecipeGraph(records);
      const started = performance.now();
      const files = renderCode(records);
      await writeFile(
        join(temporary, 'package.json'),
        JSON.stringify({ type: 'module', version: '0.0.0', exports: renderExports(records) }),
      );
      await symlink(join(projectRoot, 'node_modules'), join(temporary, 'node_modules'), 'dir');
      await writeOutputs(temporary, files);
      const generationMs = performance.now() - started;
      assert.equal((await writeOutputs(temporary, files, true)).length, 0);
      assert.equal(Object.keys(renderExports(records)).length, 1003);

      for (const name of [
        'catalog/index.js',
        'catalog/schema.js',
        'catalog/search.js',
        'catalog/runner.js',
        'src/schema.js',
        'cli/index.js',
        'cli/schema.js',
      ]) {
        await mkdir(dirname(join(temporary, 'dist', name)), { recursive: true });
        await cp(join(projectRoot, 'dist', name), join(temporary, 'dist', name));
      }
      for (const [path, source] of files) {
        if (!path.startsWith('catalog/')) continue;
        const target = join(temporary, 'dist', path.replace(/\.ts$/, '.js'));
        await mkdir(dirname(target), { recursive: true });
        const output = path.endsWith('.ts')
          ? ts.transpileModule(source, {
              compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
            }).outputText
          : source;
        await writeFile(target, output);
      }
      const startedSearch = performance.now();
      assert.equal(
        searchRecipes(
          records.map((record) => record.metadata),
          { query: 'synthetic-0999', limit: 1 },
        )[0].id,
        'synthetic-0999',
      );
      const searchMs = performance.now() - startedSearch;
      assert.ok(searchMs < 1000, `Search took ${searchMs.toFixed(1)}ms for 1,000 records.`);
      const catalog = await import(pathToFileURL(join(temporary, 'dist/catalog/index.js')));
      assert.equal(catalog.listRecipes().length, 1000);
      assert.equal(catalog.describeRecipe('synthetic-0999').inputSchema.type, 'object');
      const cli = join(temporary, 'dist/cli/index.js');
      const listed = JSON.parse(
        await run(process.execPath, [cli, 'list', '--limit', '7'], {
          cwd: temporary,
          stdio: ['ignore', 'pipe', 'inherit'],
        }),
      );
      assert.equal(listed.length, 7);
      await mkdir(join(temporary, 'dist/recipes/synthetic-0999'), { recursive: true });
      await writeFile(
        join(temporary, 'dist/recipes/synthetic-0999/demo.json'),
        JSON.stringify({
          input: { text: 'fixture' },
          response: {
            model: 'demo-fixture',
            answers: {},
            usage: { input_tokens: 0, output_tokens: 0 },
          },
        }),
      );
      const described = JSON.parse(
        await run(process.execPath, [cli, 'describe', 'synthetic-0999'], {
          cwd: temporary,
          stdio: ['ignore', 'pipe', 'inherit'],
        }),
      );
      assert.equal(described.id, 'synthetic-0999');
      // Only this synthetic implementation exists: discovery must not load the other 999.
      await mkdir(join(temporary, 'dist/recipes/synthetic-0999'), { recursive: true });
      await writeFile(
        join(temporary, 'dist/recipes/synthetic-0999/index.js'),
        'export const synthetic999InputSchema = { parse: (input) => input };\nexport async function synthetic999(input, options) { return options.client.systemOne({ state: input }); }\n',
      );
      const demo = JSON.parse(
        await run(process.execPath, [cli, 'demo', 'synthetic-0999'], {
          cwd: temporary,
          stdio: ['ignore', 'pipe', 'inherit'],
        }),
      );
      assert.equal(demo.result.model, 'demo-fixture');
      assert.equal(
        (
          (await readFile(join(temporary, 'src/index.ts'), 'utf8')).match(
            /from ['"]\.\.\/recipes\//g,
          ) ?? []
        ).length,
        1000,
      );
      context.diagnostic(
        `1,000 entries: generated in ${generationMs.toFixed(0)}ms; ranked search in ${searchMs.toFixed(1)}ms. No real recipes or live calls added.`,
      );
    } finally {
      await rm(temporary, { recursive: true, force: true });
    }
  },
);
