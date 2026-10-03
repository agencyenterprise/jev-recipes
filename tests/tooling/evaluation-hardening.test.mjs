import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { evaluate, readRun, replay } from '../../dist/evaluation/index.js';
import { summarizeEvidence } from '../../scripts/lib/evidence.mjs';
import { comparableDecision } from '../../evals/lib/harness.mjs';
import { evaluateInBatches } from '../../dist/src/batch.js';

function response(request, choice, tokens = 0) {
  return {
    model: 'author-synthetic-fixture',
    usage: { input_tokens: tokens, output_tokens: 0 },
    answers: Object.fromEntries(
      Object.entries(request.questions).map(([key, question]) => [
        key,
        {
          type: 'choice',
          choice,
          confidence: 1,
          probabilities: Object.fromEntries(
            Object.keys(question.criteria).map((label) => [label, Number(label === choice)]),
          ),
        },
      ]),
    ),
  };
}

const routeCase = {
  id: 'invoice',
  input: { request: 'Invoice question', routes: { billing: 'Invoices' } },
  expected: { suggestedRoute: 'billing' },
  rationale: 'Offline archive regression.',
  provenance: {
    method: 'author-synthetic',
    source: 'Regression fixture, not a model measurement.',
  },
};
const client = { systemOne: async (request) => response(request, 'billing') };

test('caller payload metadata names remain decisions in scoring, per-field metrics and replay', async () => {
  const action = {
    status: 'active',
    score: 10,
    model: 'board',
    confidence: 0.2,
    probability: 0.3,
    probabilities: { a: 1 },
    usage: { count: 2 },
  };
  for (const field of Object.keys(action)) {
    const wrong = { ...action, [field]: 'different' };
    for (const actual of [action, wrong, { ...action, nested: [{ status: 'changed' }] }]) {
      const run = await evaluate(
        'game-action',
        [
          {
            ...routeCase,
            input: { gameState: {}, playerState: {}, legalActions: [actual] },
            expected: { action, selection: 'action_0' },
          },
        ],
        {
          mode: 'fixture',
          client: { systemOne: async (request) => response(request, 'action_0') },
        },
      );
      const correct = actual === action;
      assert.equal(run.report.correct, Number(correct), field);
      assert.equal(run.report.correctItems, correct ? 2 : 1, field);
      assert.equal((await replay(run)).report.correct, Number(correct), field);
      assert.deepEqual(comparableDecision({ action: actual, confidence: 1 }, 'game-action'), {
        action: actual,
      });
    }
  }
  const nested = { steps: [{ status: 'active', score: 10 }] };
  const run = await evaluate(
    'game-action',
    [
      {
        ...routeCase,
        input: { gameState: {}, playerState: {}, legalActions: [nested] },
        expected: { 'action.steps.0.status': 'active', 'action.steps.0.score': 11 },
      },
    ],
    { mode: 'fixture', client: { systemOne: async (request) => response(request, 'action_0') } },
  );
  assert.equal(run.report.correct, 0);
  assert.equal(run.report.correctItems, 1);
  await assert.rejects(
    evaluate('route', [{ ...routeCase, expected: { confidence: 1 } }], { client }),
    /ungated decision/,
  );
});

test('action payload status does not change readiness in evaluation or replay', async () => {
  for (const action of [
    { status: 'pending' },
    { status: 'review' },
    { steps: [{ status: 'review' }] },
  ]) {
    const run = await evaluate(
      'game-action',
      [
        {
          ...routeCase,
          input: { gameState: {}, playerState: {}, legalActions: [action] },
          expected: { action },
        },
      ],
      { mode: 'fixture', client: { systemOne: async (request) => response(request, 'action_0') } },
    );
    for (const result of [run, await replay(run)]) {
      assert.equal(result.report.correct, 1);
      assert.equal(result.report.ready, 1);
      assert.equal(result.report.review, 0);
      assert.equal(result.report.readyAccuracy, 1);
    }
  }
});

test('compound checks still ignore actual recipe metadata', async () => {
  const demo = JSON.parse(
    await readFile(new URL('../../recipes/verify/demo.json', import.meta.url), 'utf8'),
  );
  const expected = {
    checks: Object.entries(demo.response.answers).map(([name, answer], index) => ({
      id: demo.input.claims[index].id,
      verdict: answer.choice,
    })),
  };
  const run = await evaluate('verify', [{ ...routeCase, input: demo.input, expected }], {
    mode: 'fixture',
    client: { systemOne: async () => structuredClone(demo.response) },
  });
  assert.equal(run.report.correct, 1);
  assert.equal(run.report.ready, 1);
  for (const answer of Object.values(demo.response.answers)) {
    answer.confidence = 0.5;
    const labels = Object.keys(answer.probabilities);
    answer.probabilities = Object.fromEntries(
      labels.map((label) => [label, label === answer.choice ? 0.5 : 0.5 / (labels.length - 1)]),
    );
  }
  const uncertain = await evaluate('verify', [{ ...routeCase, input: demo.input, expected }], {
    mode: 'fixture',
    client: { systemOne: async () => structuredClone(demo.response) },
  });
  assert.equal(uncertain.report.ready, 0);
  assert.equal(uncertain.report.review, 1);
  assert.equal(uncertain.rows[0].decisions.find((row) => row.minConfidence === 0.5).ready, true);
  assert.equal(uncertain.rows[0].decisions.find((row) => row.minConfidence === 0.8).ready, false);
  assert.equal((await replay(uncertain)).report.review, 1);
});

test('failed batches retain delayed successes and failures on disk without extra calls', async () => {
  const root = await mkdtemp(join(tmpdir(), 'jev-batch-recording-'));
  try {
    for (const failSecond of [false, true]) {
      const second = Promise.withResolvers();
      const started = Promise.withResolvers();
      let calls = 0;
      const out = join(root, String(failSecond));
      const pending = evaluate(
        'route-many',
        [
          {
            ...routeCase,
            input: {
              requests: [
                { id: 'a', text: 'Invoice' },
                { id: 'b', text: 'Invoice' },
              ],
              routes: { billing: 'Invoices' },
              batchSize: 1,
            },
            expected: { 'items.0.suggestedRoute': 'billing' },
          },
        ],
        {
          mode: 'fixture',
          out,
          client: {
            async systemOne(request) {
              calls++;
              if (request.state.requests[0].id === 'a') throw new Error('First unavailable');
              started.resolve();
              await second.promise;
              if (failSecond) throw new Error('Second unavailable');
              return response(request, 'billing', 100);
            },
          },
        },
      );
      await started.promise;
      // Advance through finalization opportunities while the second call is pending.
      await new Promise((resolve) => setImmediate(resolve));
      second.resolve();
      const run = await pending;
      const saved = await readRun(out);
      assert.equal(calls, 2);
      assert.equal(saved.report.failed, 1);
      assert.equal(saved.report.usage.input_tokens, failSecond ? 0 : 100);
      assert.equal(saved.report.usage.unknownResponses, 0);
      assert.equal(saved.rows[0].error, 'First unavailable');
      assert.deepEqual(saved.rows[0].exchanges, run.rows[0].exchanges);
      assert.equal(
        Object.hasOwn(saved.rows[0].exchanges[1], failSecond ? 'error' : 'response'),
        true,
      );
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('batch cancellation settles cooperative siblings and successful order stays stable', async () => {
  const controller = new AbortController();
  let aborted = false;
  const pending = evaluateInBatches([0, 1], 1, async ([item]) => {
    if (item === 0) {
      await Promise.resolve();
      controller.abort();
      throw new Error('First failed');
    }
    await new Promise((resolve) =>
      controller.signal.addEventListener('abort', resolve, { once: true }),
    );
    aborted = true;
    throw new Error('Aborted');
  });
  await assert.rejects(pending, /First failed/);
  assert.equal(aborted, true);
  const first = Promise.withResolvers();
  const success = evaluateInBatches([0, 1], 1, async ([item]) => {
    if (item === 0) await first.promise;
    else first.resolve();
    return {
      items: [item],
      model: `model-${item}`,
      usage: { input_tokens: item + 1, output_tokens: 0 },
    };
  });
  assert.deepEqual(await success, {
    items: [0, 1],
    model: 'model-0',
    usage: { input_tokens: 3, output_tokens: 0 },
  });
});

test('repeated replay preserves fixture/live origin and original dates across disk round trips', async () => {
  const root = await mkdtemp(join(tmpdir(), 'jev-origin-'));
  try {
    for (const mode of ['fixture', 'live']) {
      // "live" is a schema/provenance test only; the client is always an offline fixture.
      const source = await evaluate('route', [routeCase], { mode, client });
      source.createdAt = source.evaluatedAt = '2020-01-01T00:00:00.000Z';
      const first = await replay(source, source.policy, join(root, `${mode}-first`));
      const second = await replay(
        await readRun(join(root, `${mode}-first`)),
        first.policy,
        join(root, `${mode}-second`),
      );
      const saved = await readRun(join(root, `${mode}-second`));
      assert.equal(saved.sourceMode, mode);
      assert.equal(saved.evaluatedAt, source.evaluatedAt);
      assert.notEqual(saved.createdAt, source.createdAt);
      assert.equal(saved.scoringRevision, 2);
      assert.equal(saved.sourceRun, first.runId);
      const evidence = summarizeEvidence(saved.report, saved.recipeFingerprint);
      assert.equal(evidence.kind, mode === 'fixture' ? 'fixture' : 'synthetic');
      if (mode === 'fixture') assert.equal(evidence.measurement, null);
      else {
        assert.equal(evidence.measurement.date, source.evaluatedAt);
        assert.equal(evidence.measurement.replayedAt, saved.createdAt);
      }
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('current archives require explicit origin and complete response records', async () => {
  const root = await mkdtemp(join(tmpdir(), 'jev-origin-validation-'));
  try {
    const source = await evaluate('route', [routeCase], { mode: 'fixture', client });
    for (const field of ['sourceMode', 'evaluatedAt', 'scoringRevision']) {
      const incomplete = structuredClone(source);
      delete incomplete[field];
      await writeFile(join(root, 'run.json'), JSON.stringify(incomplete));
      await assert.rejects(readRun(root), new RegExp(field));
    }
    await writeFile(join(root, 'run.json'), JSON.stringify({ ...source, format: 1 }));
    await assert.rejects(readRun(root), /Unsupported archive format/);
    const incomplete = structuredClone(source);
    delete incomplete.rows[0].exchanges[0].response;
    await writeFile(join(root, 'run.json'), JSON.stringify(incomplete));
    await assert.rejects(readRun(root), /exactly one response or error/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
