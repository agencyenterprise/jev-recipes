import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { compare, evaluate, freezePolicy, readRun, replay } from '../../dist/evaluation/index.js';
import { replayResponses } from '../../dist/evaluation/engine.js';

const fixture = JSON.parse(
  await readFile(new URL('../../recipes/route/demo.json', import.meta.url), 'utf8'),
);
const entry = {
  id: 'billing',
  input: fixture.input,
  expected: { suggestedRoute: 'billing' },
  rationale: 'The request asks about an invoice.',
};
const client = { systemOne: async () => structuredClone(fixture.response) };

test('archives preserve responses, replay policies offline, and never overwrite a run', async () => {
  const root = await mkdtemp(join(tmpdir(), 'jev-archive-'));
  try {
    const out = join(root, 'first');
    const run = await evaluate('route', [entry], { client, out, mode: 'fixture' });
    assert.equal(run.report.correct, 1);
    assert.equal(run.rows[0].exchanges.length, 1);
    assert.deepEqual(run.rows[0].exchanges[0].response, fixture.response);
    assert.equal((await stat(out)).mode & 0o777, 0o700);
    const saved = await readRun(out);
    const replayed = await replay(saved, { minConfidence: 1 }, join(root, 'second'));
    assert.equal(replayed.report.review, 1);
    assert.equal(replayed.report.failed, 0);
    assert.deepEqual(replayed.report.usage, run.report.usage);
    assert.equal(compare(run, replayed).delta.review, 1);
    let calls = 0;
    await assert.rejects(
      evaluate('route', [entry], {
        out,
        client: {
          systemOne() {
            calls++;
            throw new Error('Must not call');
          },
        },
      }),
      /EEXIST/,
    );
    assert.equal(calls, 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('the entire dataset is validated before calls, including cases outside the selected split', async () => {
  let calls = 0;
  const never = {
    systemOne() {
      calls++;
      throw new Error('Must not call');
    },
  };
  for (const bad of [
    { ...entry, id: 'invalid', input: { ...entry.input, request: '' } },
    { ...entry, id: 'invalid', expected: { 'unknown.field': true } },
    { ...entry, id: 'invalid', expected: { confidence: 1 } },
    { ...entry, id: 'invalid', expected: { suggestedRoute: false } },
    { ...entry, id: 'invalid', expected: {} },
    entry,
  ])
    await assert.rejects(
      evaluate('route', [entry, { ...bad, split: 'held-out' }], { client: never }),
    );
  assert.equal(calls, 0);
  await assert.rejects(evaluate('route', [entry], { client: never, concurrency: 0 }));
  await assert.rejects(evaluate('route', [entry], { client: never, maxCases: 0 }));
});

test('provider failure, wrong answer, and mandatory review are separate outcomes', async () => {
  const run = await evaluate(
    'route',
    [
      entry,
      { ...entry, id: 'wrong', input: { ...entry.input, request: 'Wrong' } },
      {
        ...entry,
        id: 'review',
        input: { ...entry.input, request: 'Review' },
        expected: { suggestedRoute: null },
      },
      { ...entry, id: 'failure', input: { ...entry.input, request: 'Failure' } },
    ],
    {
      client: {
        async systemOne(request) {
          if (request.state.request === 'Failure') throw new Error('Unavailable');
          const response = structuredClone(fixture.response);
          response.answers.route.choice =
            request.state.request === 'Review'
              ? '__review__'
              : request.state.request === 'Wrong'
                ? 'technical'
                : 'billing';
          response.answers.route.probabilities = Object.fromEntries(
            Object.keys(request.questions.route.criteria).map((key) => [
              key,
              key === response.answers.route.choice ? 1 : 0,
            ]),
          );
          return response;
        },
      },
    },
  );
  assert.equal(run.report.completed, 3);
  assert.equal(run.report.correct, 2);
  assert.equal(run.report.wrong, 1);
  assert.equal(run.report.failed, 1);
  assert.equal(run.report.review, 1);
  assert.equal(run.report.accuracy, 0.5);
  assert.equal(run.report.readyAccuracy, 0.5);
  assert.equal(run.report.usage.failedRequests, 1);
  assert.equal(run.report.cost, null);
  assert.equal((await replay(run)).report.failed, 1);
});

test('request limits cap actual calls and credential-bearing errors are redacted', async () => {
  let calls = 0;
  const run = await evaluate('route', [entry, { ...entry, id: 'second' }], {
    maxRequests: 1,
    client: {
      async systemOne() {
        calls++;
        throw new Error('HTTP Bearer confidential-key rejected');
      },
    },
  });
  assert.equal(calls, 1);
  assert.equal(run.report.failed, 2);
  assert.doesNotMatch(JSON.stringify(run), /confidential-key/);
});

test('held-out runs require a development policy and cannot tune thresholds', async () => {
  const development = await evaluate('route', [entry], { client });
  const heldOut = [{ ...entry, id: 'held-out', split: 'held-out' }];
  await assert.rejects(evaluate('route', heldOut, { client, split: 'held-out' }), /frozen/);
  const run = await evaluate('route', heldOut, {
    client,
    split: 'held-out',
    policy: freezePolicy(development),
  });
  assert.deepEqual(run.thresholds, []);
  assert.equal(run.report.suggestedMinConfidence, null);
  await assert.rejects(replay(run, { minConfidence: 0.5 }), /held-out/);
  assert.equal((await replay(run)).report.correct, 1);
});

test('comparison rejects changed inputs or answer keys and replay rejects changed recipes', async () => {
  const run = await evaluate('route', [entry], { client });
  const changedInput = await evaluate(
    'route',
    [{ ...entry, input: { ...entry.input, request: 'Other' } }],
    { client },
  );
  const changedLabel = await evaluate('route', [{ ...entry, expected: { suggestedRoute: null } }], {
    client,
  });
  assert.throws(() => compare(run, changedInput), /same recipe/);
  assert.throws(() => compare(run, changedLabel), /answer key/);
  await assert.rejects(replay({ ...run, recipeFingerprint: 'different' }), /differs/);
  const playback = replayResponses(run.rows[0].exchanges);
  await assert.rejects(playback.client.systemOne({ state: {}, questions: {} }), /unrecorded/);
  assert.throws(playback.assertComplete, /every recorded/);
});

test('archives detect edits to their dataset instead of trusting stored fingerprints', async () => {
  const root = await mkdtemp(join(tmpdir(), 'jev-archive-edit-'));
  try {
    const out = join(root, 'run');
    const run = await evaluate('route', [entry], { client, out });
    run.cases[0].expected.suggestedRoute = 'technical';
    await writeFile(join(out, 'run.json'), JSON.stringify(run));
    await assert.rejects(readRun(out), /fingerprints/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('archive reports are rebuilt from validated case records', async () => {
  const root = await mkdtemp(join(tmpdir(), 'jev-archive-report-'));
  try {
    const out = join(root, 'run');
    const run = await evaluate('route', [entry], { client, out });
    run.report.correct = 999;
    await writeFile(join(out, 'run.json'), JSON.stringify(run));
    assert.equal((await readRun(out)).report.correct, 1);
    delete run.rows[0].ready;
    await writeFile(join(out, 'run.json'), JSON.stringify(run));
    await assert.rejects(readRun(out), /ready/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('expected fields can traverse a union result schema', async () => {
  const game = JSON.parse(
    await readFile(new URL('../../recipes/game-action/demo.json', import.meta.url), 'utf8'),
  );
  const run = await evaluate(
    'game-action',
    [
      {
        id: 'move',
        input: game.input,
        expected: { selection: 'action_0' },
        rationale: 'Taking two points wins the game.',
      },
    ],
    { client: { systemOne: async () => game.response } },
  );
  assert.equal(run.report.correct, 1);
  await assert.rejects(
    evaluate('game-action', [{ ...entry, input: game.input, expected: { missing: true } }], {
      client,
    }),
    /unknown result field/,
  );
});
