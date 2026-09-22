import { npm, run } from './lib/process.mjs';

try {
  for (const task of ['generate:check', 'format:check', 'typecheck', 'test:coverage', 'build']) {
    await npm(['run', task]);
  }
  await run(process.execPath, ['scripts/test-tooling.mjs']);
  await run(process.execPath, ['scripts/pack-check.mjs', '--built']);
  console.log('All checks passed. No live Jev calls were made.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
