import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkPackageContents } from '../../scripts/lib/package.mjs';

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
