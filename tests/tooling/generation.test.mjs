import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile, rm, cp, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  validateRecipeGraph,
  readRecipes,
  projectRoot,
  inspectImports,
} from '../../scripts/lib/recipes.mjs';
import ts from 'typescript';
import { replaceSection, writeOutputs, renderExports } from '../../scripts/lib/generate.mjs';
import { scaffoldRecipe } from '../../scripts/new-recipe.mjs';
import { renderDocs } from '../../scripts/lib/docs.mjs';

const recipe = (id, uses = [], related = []) => ({
  id,
  metadata: { uses, related },
  dependencies: uses,
});

test('dependency checks distinguish navigation links from execution and reject invalid graphs', () => {
  assert.doesNotThrow(() =>
    validateRecipeGraph([
      recipe('one', [], [{ id: 'two', reason: 'Alternative.' }]),
      recipe('two', [], [{ id: 'one', reason: 'Alternative.' }]),
    ]),
  );
  assert.throws(() => validateRecipeGraph([recipe('one'), recipe('one')]), /Duplicate/);
  assert.throws(
    () => validateRecipeGraph([recipe('one', ['missing'])]),
    /Invalid recipe reference/,
  );
  assert.throws(() => validateRecipeGraph([recipe('one', ['one'])]), /Invalid recipe reference/);
  assert.throws(
    () => validateRecipeGraph([recipe('one', ['two']), recipe('two', ['one'])]),
    /Circular/,
  );
  assert.throws(
    () => validateRecipeGraph([{ ...recipe('one'), dependencies: ['two'] }, recipe('two')]),
    /must match/,
  );
  assert.throws(
    () => validateRecipeGraph([recipe('one', [], [{ id: 'missing', reason: 'Typo.' }])]),
    /Invalid recipe reference/,
  );
});

test('documentation generation preserves authored prose and refuses ambiguous markers', () => {
  const original =
    'Keep before.\n<!-- BEGIN GENERATED: test -->\nOld.\n<!-- END GENERATED: test -->\nKeep after.';
  const updated = replaceSection(original, 'test', 'New.');
  assert.ok(updated.startsWith('Keep before.\n'));
  assert.ok(updated.endsWith('\nKeep after.'));
  assert.equal(replaceSection(updated, 'test', 'New.'), updated);
  assert.throws(() => replaceSection('No markers.', 'test', 'New.'));
  assert.throws(() => replaceSection(original + original, 'test', 'New.'));
});

test('psychology documentation follows recipe tags without changing category membership or counts', async () => {
  const root = await mkdtemp(join(tmpdir(), 'jev-topic-docs-'));
  try {
    await mkdir(join(root, 'recipes'));
    await writeFile(
      join(root, 'README.md'),
      '<!-- BEGIN GENERATED: summary -->\n<!-- END GENERATED: summary -->',
    );
    await writeFile(
      join(root, 'recipes/README.md'),
      '<!-- BEGIN GENERATED: catalog -->\n<!-- END GENERATED: catalog -->',
    );
    const records = ['tagged-example', 'other-example'].map((id, index) => ({
      id,
      functionName: index === 0 ? 'taggedExample' : 'otherExample',
      metadata: {
        category: index === 0 ? 'support' : 'conversation',
        tags: index === 0 ? ['psychology'] : [],
        description: 'An example decision.',
        useWhen: 'You need an example.',
        related: [],
      },
      fixture: { input: { text: 'Example input.' } },
      result: {},
      inputSchema: { type: 'object', properties: { text: { type: 'string' } } },
    }));
    for (const { id } of records) {
      await mkdir(join(root, 'recipes', id));
      await writeFile(
        join(root, 'recipes', id, 'README.md'),
        '<!-- BEGIN GENERATED: usage -->\n<!-- END GENERATED: usage -->\n' +
          '<!-- BEGIN GENERATED: input -->\n<!-- END GENERATED: input -->',
      );
    }
    const files = await renderDocs(root, records);
    const catalog = files.get('recipes/README.md');
    const [categories, collection] = catalog.split('## Psychology & behavior');
    assert.match(files.get('README.md'), /2 focused recipes/);
    assert.match(categories, /2 recipes\./);
    assert.match(categories, /## Customer support[\s\S]*tagged-example/);
    assert.match(collection, /tagged-example/);
    assert.ok(!collection.includes('other-example'));

    records[0].metadata.tags = [];
    records[1].metadata.tags = ['psychology'];
    const moved = (await renderDocs(root, records))
      .get('recipes/README.md')
      .split('## Psychology & behavior')[1];
    assert.match(moved, /other-example/);
    assert.ok(!moved.includes('tagged-example'));
    records[1].metadata.tags = [];
    assert.ok(
      !(await renderDocs(root, records)).get('recipes/README.md').includes('## Psychology'),
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('check mode detects stale files without rewriting them, and generation is idempotent', async () => {
  const root = await mkdtemp(join(tmpdir(), 'jev-generated-check-'));
  try {
    await mkdir(join(root, 'catalog/generated/details'), { recursive: true });
    await writeFile(join(root, 'package.json'), '{}\n');
    const files = new Map([
      ['generated.ts', 'export const value = 1;\n'],
      ['catalog/generated/details/one.json', '{"type":"object"}'],
    ]);
    assert.equal((await writeOutputs(root, files)).length, 2);
    assert.equal((await writeOutputs(root, files)).length, 0);
    await writeFile(join(root, 'generated.ts'), 'export const value = 2;\n');
    await assert.rejects(writeOutputs(root, files, true), /Generated files are stale/);
    assert.equal(await readFile(join(root, 'generated.ts'), 'utf8'), 'export const value = 2;\n');
    await writeFile(join(root, 'catalog/generated/details/removed.json'), '{}\n');
    await assert.rejects(writeOutputs(root, files, true), /removed.json/);
    await writeOutputs(root, files);
    await assert.rejects(readFile(join(root, 'catalog/generated/details/removed.json')), {
      code: 'ENOENT',
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('scaffolding keeps tests separate and never overwrites an existing recipe', async () => {
  const root = await mkdtemp(join(tmpdir(), 'jev-scaffold-check-'));
  try {
    await scaffoldRecipe(root, 'sample-check');
    const source = await readFile(join(root, 'recipes/sample-check/index.ts'), 'utf8');
    assert.match(source, /export async function sampleCheck/);
    assert.match(
      await readFile(join(root, 'tests/recipe/sample-check.test.ts'), 'utf8'),
      /testClassification|createJevClient/,
    );
    await assert.rejects(scaffoldRecipe(root, 'sample-check'), /Already exists/);
    assert.equal(await readFile(join(root, 'recipes/sample-check/index.ts'), 'utf8'), source);
    await assert.rejects(scaffoldRecipe(root, '../escape'), /kebab-case/);
    await assert.rejects(scaffoldRecipe(root, 'default'), /valid TypeScript/);
    await assert.rejects(scaffoldRecipe(root, 'odd-kind', 'ranking'), /Unknown recipe kind/);
    await scaffoldRecipe(root, 'sample-score', 'score');
    assert.match(
      await readFile(join(root, 'recipes/sample-score/index.ts'), 'utf8'),
      /evaluateScore/,
    );
    assert.match(
      await readFile(join(root, 'tests/recipe/sample-score.test.ts'), 'utf8'),
      /testScore/,
    );
    await scaffoldRecipe(root, 'sample-gate', 'gate');
    assert.match(
      await readFile(join(root, 'recipes/sample-gate/index.ts'), 'utf8'),
      /evaluateGate/,
    );
    assert.match(
      await readFile(join(root, 'tests/recipe/sample-gate.test.ts'), 'utf8'),
      /testGate/,
    );
    await scaffoldRecipe(root, 'sample-compare', 'comparison');
    assert.match(
      await readFile(join(root, 'recipes/sample-compare/index.ts'), 'utf8'),
      /evaluateComparison/,
    );
    await scaffoldRecipe(root, 'sample-labels', 'labels');
    assert.match(
      await readFile(join(root, 'recipes/sample-labels/index.ts'), 'utf8'),
      /evaluateLabels/,
    );
    assert.match(
      await readFile(join(root, 'tests/recipe/sample-labels.test.ts'), 'utf8'),
      /testLabels/,
    );
    const exports = renderExports([{ id: 'sample-check' }]);
    assert.deepEqual(exports['./sample-check'], {
      types: './dist/recipes/sample-check/index.d.ts',
      import: './dist/recipes/sample-check/index.js',
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('a new recipe is discovered from source without a prior build or manual registration', async () => {
  const root = await mkdtemp(join(tmpdir(), 'jev-source-check-'));
  try {
    await cp(join(projectRoot, 'src'), join(root, 'src'), { recursive: true });
    await cp(join(projectRoot, 'tsconfig.json'), join(root, 'tsconfig.json'));
    await writeFile(join(root, 'package.json'), '{"type":"module"}');
    await symlink(join(projectRoot, 'node_modules'), join(root, 'node_modules'), 'dir');
    await scaffoldRecipe(root, 'fresh-decision');
    const records = await readRecipes(root);
    assert.equal(records.length, 1);
    assert.equal(records[0].functionName, 'freshDecision');
    assert.ok(records[0].types.includes('FreshDecisionInput'));
    assert.deepEqual(records[0].inputSchema.required, ['text', 'requirement']);
    assert.equal(records[0].result.verdict, 'matched');
    const metadataPath = join(root, 'recipes/fresh-decision/metadata.ts');
    const metadata = await readFile(metadataPath, 'utf8');
    await writeFile(metadataPath, metadata.replace("id: 'fresh-decision'", "id: 'wrong-id'"));
    await assert.rejects(readRecipes(root), /disagrees with metadata ID/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('import checks enforce public recipe boundaries and ignore type-only dependencies', () => {
  const root = '/tmp/jev-import-boundaries';
  const program = (source) => ({
    getSourceFiles: () => [
      ts.createSourceFile(join(root, 'recipes/one/index.ts'), source, ts.ScriptTarget.Latest, true),
    ],
  });
  assert.deepEqual(
    inspectImports(program("import { two } from '../two/index.js';"), root, ['one', 'two']).get(
      'one',
    ),
    ['two'],
  );
  assert.deepEqual(
    inspectImports(program("import { type TwoInput } from '../two/index.js';"), root, [
      'one',
      'two',
    ]).get('one'),
    [],
  );
  for (const source of [
    "import { two } from '../two/schema.js';",
    "import { listRecipes } from '../../catalog/index.js';",
    "import { two } from '../../src/index.js';",
    "import { two } from 'jev-recipes';",
  ]) {
    assert.throws(() => inspectImports(program(source), root, ['one', 'two']));
  }
});
