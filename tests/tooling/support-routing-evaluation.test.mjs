import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, readFile, writeFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  benchmarkRouting,
  replayWorkflow,
  compareWorkflowRuns,
} from '../../evals/support-routing/benchmark.mjs';
import { readWorkflowArchive } from '../../evals/support-routing/archive.mjs';
import { validateWorkflowCases } from '../../evals/support-routing/schema.mjs';
import { fallbackRequest } from '../../examples/support-routing/fallback.mjs';
import { fixture } from '../../examples/shared/fixtures.mjs';

const policy = JSON.parse(
  await readFile(new URL('../../evals/support-routing/policy.json', import.meta.url), 'utf8'),
);
const cases = ['ready', 'rescued', 'ambiguous', 'unsafe', 'outage', 'fallback-outage'].map(
  (id) => ({
    id,
    family: id,
    group: 'test',
    split: 'development',
    input: { request: id, routes: { billing: 'Invoices', account: 'Access' } },
    expectedRoute: ['ambiguous', 'unsafe'].includes(id) ? null : 'billing',
    rationale: 'Authored behavior test.',
    provenance: { method: 'author-synthetic', source: 'Test fixture.' },
  }),
);

function providers() {
  return {
    client: {
      systemOne: async (request) => {
        const id = request.state.request;
        if (id === 'outage') throw new Error('Primary unavailable.');
        return fixture(
          { route: id === 'ambiguous' ? '__review__' : 'billing' },
          id === 'ready' ? 0.95 : 0.5,
        )(request);
      },
    },
    fallbackFactory: (onExchange) => async (input) => {
      const exchange = { request: fallbackRequest(input, policy.fallbackModel), durationMs: 12 };
      if (input.request === 'fallback-outage') {
        exchange.error = 'Fallback unavailable.';
        await onExchange(exchange);
        throw new Error(exchange.error);
      }
      const result = { status: 'ready', route: 'billing' };
      exchange.response = JSON.stringify({
        model: 'fallback-fixture',
        usage: { prompt_tokens: 10, completion_tokens: 3 },
        choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(result) } }],
      });
      await onExchange(exchange);
      return { ...result, model: 'fallback-fixture' };
    },
  };
}

test('workflow reports errors, coverage, unsafe routing, raw fallback evidence and exact replay', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'routing-evaluation-'));
  const out = join(directory, 'development');
  const run = await benchmarkRouting({ values: cases, policy, out, ...providers() });
  const result = run.report.strategies.cascade;
  assert.equal(result.cases, 6);
  assert.equal(result.ready, 3);
  assert.equal(result.correctReady, 2);
  assert.equal(result.wrongReady, 1);
  assert.equal(result.correctReview, 1);
  assert.equal(result.review, 3);
  assert.equal(result.failed, 2);
  assert.equal(result.inappropriateRouting, 1);
  assert.equal(result.fallbackCalls, 3);
  assert.equal(result.fallbackFailures, 1);
  assert.equal(result.coverage, 0.5);
  assert.equal(result.readyAccuracy, 2 / 3);
  assert.equal(result.usage, null);
  assert.equal(result.cost, null);
  assert.equal(run.report.strategies.primary.ready, 1);
  const played = await replayWorkflow(out);
  assert.deepEqual(played.report.strategies, run.report.strategies);
  await assert.rejects(
    replayWorkflow(out, { ...policy, minConfidence: 0.99 }),
    /unrecorded fallback/,
  );
  await assert.rejects(
    replayWorkflow(out, { ...policy, fallbackModel: 'different/model' }),
    /unrecorded fallback/,
  );
  assert.throws(
    () => compareWorkflowRuns(run, { ...run, policy: { ...policy, minConfidence: 0.9 } }),
    /identical/,
  );
  if (process.platform !== 'win32')
    assert.equal((await stat(join(out, 'workflow.json'))).mode & 0o777, 0o600);
  const raw = JSON.parse(await readFile(join(out, 'workflow.json')));
  raw.rows[0].expectedRoute = 'account';
  await writeFile(join(out, 'workflow.json'), JSON.stringify(raw));
  await assert.rejects(readWorkflowArchive(out), /integrity/);
});

test('held-out evaluation requires unchanged development policy and dataset before calls', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'routing-held-out-'));
  const heldOut = {
    ...cases[0],
    id: 'held',
    family: 'held',
    split: 'held-out',
    input: { ...cases[0].input, request: 'reserved request' },
  };
  const values = [...cases, heldOut];
  const development = join(directory, 'development');
  await benchmarkRouting({ values, policy, out: development, ...providers() });
  let calls = 0;
  const client = {
    systemOne: async () => {
      calls++;
      throw new Error('Must not call.');
    },
  };
  await assert.rejects(
    benchmarkRouting({
      values,
      policy,
      split: 'held-out',
      out: join(directory, 'missing'),
      client,
    }),
    /frozen development/,
  );
  await assert.rejects(
    benchmarkRouting({
      values,
      policy: { ...policy, minConfidence: 0.9 },
      split: 'held-out',
      development,
      out: join(directory, 'changed'),
      client,
    }),
    /changed/,
  );
  assert.equal(calls, 0);
  const held = await benchmarkRouting({
    values,
    policy,
    split: 'held-out',
    development,
    out: join(directory, 'held'),
    ...providers(),
  });
  assert.equal(held.rows.length, 1);
  await assert.rejects(
    replayWorkflow(join(directory, 'held'), { ...policy, minConfidence: 0.9 }),
    /held-out/,
  );
});

test('case validation rejects duplicate requests and families crossing splits', () => {
  assert.throws(
    () => validateWorkflowCases([...cases, { ...cases[0], id: 'different' }]),
    /Duplicate workflow request/,
  );
  assert.throws(
    () =>
      validateWorkflowCases([
        ...cases,
        {
          ...cases[0],
          id: 'different',
          split: 'held-out',
          input: { ...cases[0].input, request: 'different' },
        },
      ]),
    /crosses splits/,
  );
});
