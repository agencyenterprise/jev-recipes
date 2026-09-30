import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/recipe/**/*.test.ts', 'tests/adapters/**/*.test.ts'],
    setupFiles: ['tests/recipe/helpers/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['recipes/*/index.ts', 'recipes/*/schema.ts', 'adapters/**/*.ts'],
      exclude: ['catalog/**'],
      reporter: ['text-summary', 'html', 'json-summary'],
      reportsDirectory: 'coverage',
      thresholds: { lines: 95, statements: 95, functions: 95, branches: 90, perFile: true },
    },
  },
});
