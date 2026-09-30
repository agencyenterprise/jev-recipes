import assert from 'node:assert/strict';
import { test } from 'node:test';
import { run } from '../../scripts/lib/process.mjs';

test('the AI SDK agent example routes once, blocks publishing, and stops on an accepted completion', async () => {
  const output = JSON.parse(
    await run(process.execPath, ['examples/ai-sdk-agent/run.mjs'], {
      stdio: ['ignore', 'pipe', 'inherit'],
    }),
  );
  assert.equal(output.mode, 'fixture');
  assert.deepEqual(
    output.steps.map((step) => [step.model, ...step.calls]),
    [
      ['fast-model', 'run_tests'],
      ['fast-model', 'publish_release'],
      ['fast-model', 'report_completion'],
      ['fast-model', 'report_completion'],
    ],
  );
  assert.deepEqual(output.steps[0].outputs, [{ pattern: 'account', passed: 12, failed: 0 }]);
  assert.equal(output.steps[1].outputs[0].blocked, true);
  assert.equal(output.steps[1].outputs[0].action, 'ask');
  assert.equal(output.steps[2].outputs[0].accepted, false);
  assert.equal(output.steps[3].outputs[0].accepted, true);
  assert.deepEqual(output.trace, [
    { route: 'fast' },
    { gate: 'run_tests', action: 'allow' },
    { gate: 'publish_release', action: 'ask' },
    { completion: 'unverified' },
    { completion: 'complete' },
  ]);
});

test('the LangChain example routes, guards, and checks completion through structured tools', async () => {
  const output = JSON.parse(
    await run(process.execPath, ['examples/langchain-tools/run.mjs'], {
      stdio: ['ignore', 'pipe', 'inherit'],
    }),
  );
  assert.equal(output.results.route.route, 'billing');
  assert.deepEqual(output.results.run_tests, { pattern: 'account', passed: 12 });
  assert.equal(output.results.drop_table.action, 'deny');
  assert.deepEqual(output.results.drop_table.detected, ['irreversible', 'destructive']);
  assert.equal(output.results.report_completion.accepted, true);
});
