import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkPackageContents, parsePackedArchive } from '../../scripts/lib/package.mjs';

test('package checks read both legacy and npm 12 archive reports, including scoped dependencies', () => {
  for (const name of ['jev-recipes', '@typesafe-ai/sdk']) {
    const report = { name, filename: 'archive.tgz', files: [{ path: 'package.json' }] };
    for (const output of [[report], { [name]: report }]) {
      assert.deepEqual(parsePackedArchive(JSON.stringify(output), name), report);
    }
  }
});

test('package checks reject empty, ambiguous, incomplete, and wrong-package archive reports', () => {
  const report = { name: 'jev-recipes', filename: 'archive.tgz', files: [] };
  for (const output of [
    null,
    [],
    {},
    [report, report],
    { first: report, second: report },
    [{ ...report, name: 'another-package' }],
    [{ ...report, filename: '' }],
    [{ ...report, filename: undefined }],
    [{ ...report, files: undefined }],
  ]) {
    assert.throws(
      () => parsePackedArchive(JSON.stringify(output), 'jev-recipes'),
      /Expected one npm pack report for jev-recipes/,
    );
  }
});

const exports = {
  '.': { import: './dist/src/index.js', types: './dist/src/index.d.ts' },
  './route': { import: './dist/recipes/route/index.js', types: './dist/recipes/route/index.d.ts' },
};
const files = [
  'package.json',
  'README.md',
  'LICENSE',
  'CHANGELOG.md',
  'dist/cli/index.js',
  'dist/src/index.js',
  'dist/src/index.d.ts',
  'dist/recipes/route/index.js',
  'dist/recipes/route/index.d.ts',
  'dist/recipes/route/demo.json',
  'dist/catalog/generated/details/route.json',
];

test('package checks accept required files and reject development files anywhere in the archive', () => {
  assert.doesNotThrow(() => checkPackageContents(files, ['route'], exports));
  for (const leaked of [
    'tests/recipe/route.test.ts',
    'dist/recipes/route/index.test.js',
    'dist/recipes/route/tests/helper.js',
    '.env',
    '.env.local',
    'coverage/summary.json',
    'scripts/generate.mjs',
    'Makefile',
    'recipes/route/README.md',
    'examples/support/demo.json',
    'dist/recipes/route/metadata.js',
    'dist/catalog/generated/details/unknown.json',
  ]) {
    assert.throws(
      () => checkPackageContents([...files, leaked], ['route'], exports),
      undefined,
      leaked,
    );
  }
});

test('package checks detect stripped declarations, demos, and descriptions', () => {
  for (const missing of [
    'dist/src/index.d.ts',
    'dist/recipes/route/index.js',
    'dist/recipes/route/demo.json',
    'dist/catalog/generated/details/route.json',
  ]) {
    assert.throws(
      () =>
        checkPackageContents(
          files.filter((path) => path !== missing),
          ['route'],
          exports,
        ),
      /Required file missing/,
    );
  }
});
