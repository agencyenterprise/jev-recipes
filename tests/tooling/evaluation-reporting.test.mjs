import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createClient } from '../../dist/src/client.js';
import { evaluate, replay } from '../../dist/evaluation/index.js';
import { meetsReadyAccuracy } from '../../evals/lib/acceptance.mjs';

const fixture = JSON.parse(
  await readFile(new URL('../../recipes/route/demo.json', import.meta.url), 'utf8'),
);
const invoiceCase = {
  id: 'invoice',
  input: fixture.input,
  expected: { suggestedRoute: 'billing' },
  rationale: 'The request asks about an invoice.',
};
const price = {
  model: fixture.response.model,
  inputPerMillion: 1,
  outputPerMillion: 2,
  currency: 'USD',
  date: '2026-10-03',
  source: 'Offline test rate',
};

test('invalid token counts remain unknown and cannot produce a cost estimate', async () => {
  for (const field of ['input_tokens', 'output_tokens']) {
    for (const count of [-100, 0.5, null, '100', Number.MAX_SAFE_INTEGER + 1]) {
      const response = structuredClone(fixture.response);
      response.usage = { input_tokens: 100, output_tokens: 20, [field]: count };
      const run = await evaluate('route', [invoiceCase], {
        mode: 'fixture',
        price,
        client: clientReturning(response),
      });
      assert.equal(run.report.failed, 1);
      assert.equal(run.report.usage.input_tokens, 0);
      assert.equal(run.report.usage.output_tokens, 0);
      assert.equal(run.report.usage.unknownResponses, 1);
      assert.equal(run.report.cost, null);
      assert.deepEqual((await replay(run)).report.usage, run.report.usage);
    }
  }
});

test('unknown model identity prevents pricing while preserving valid token counts', async () => {
  for (const model of [undefined, '', '   ']) {
    const response = {
      ...fixture.response,
      model,
      usage: { input_tokens: 100, output_tokens: 20 },
    };
    const run = await evaluate('route', [invoiceCase], {
      mode: 'fixture',
      price,
      client: clientReturning(response),
    });
    assert.equal(run.report.failed, 1);
    assert.equal(run.report.usage.input_tokens, 100);
    assert.equal(run.report.usage.output_tokens, 20);
    assert.equal(run.report.usage.unknownResponses, 1);
    assert.deepEqual(run.report.usage.models, []);
    assert.equal(run.report.cost, null);
  }
});

test('one known model does not hide another response with unknown model identity', async () => {
  const responses = [structuredClone(fixture.response), structuredClone(fixture.response)];
  delete responses[1].model;
  const run = await evaluate('route', [invoiceCase, { ...invoiceCase, id: 'second-invoice' }], {
    mode: 'fixture',
    price,
    client: { systemOne: async () => responses.shift() },
  });
  assert.equal(run.report.failed, 1);
  assert.deepEqual(run.report.usage.models, [price.model]);
  assert.equal(run.report.usage.unknownResponses, 1);
  assert.equal(run.report.cost, null);
});

test('valid metadata remains billable even when the provider answer is rejected', async () => {
  for (const answers of [fixture.response.answers, {}]) {
    const response = {
      ...fixture.response,
      answers,
      usage: { input_tokens: 100, output_tokens: 20 },
    };
    const run = await evaluate('route', [invoiceCase], {
      mode: 'fixture',
      price,
      client: clientReturning(response),
    });
    assert.equal(run.report.failed, answers === fixture.response.answers ? 0 : 1);
    assert.equal(run.report.usage.unknownResponses, 0);
    assert.equal(run.report.cost.estimated, 0.00014);
  }
});

test('known usage from a different model cannot use the supplied price', async () => {
  const run = await evaluate('route', [invoiceCase], {
    mode: 'fixture',
    price,
    client: clientReturning({ ...fixture.response, model: 'another-model' }),
  });
  assert.equal(run.report.failed, 0);
  assert.equal(run.report.usage.unknownResponses, 0);
  assert.equal(run.report.cost, null);
});

test('does not recommend a threshold below the accuracy target despite display rounding', async () => {
  const run = await evaluateAccuracy(113, 119);
  assert.equal(run.report.correct, 113);
  assert.equal(run.report.readyAccuracy, 0.95);
  assert.equal(run.report.suggestedMinConfidence, null);
  assert.equal((await replay(run)).report.suggestedMinConfidence, null);
  assert.equal(meetsReadyAccuracy(run.rows, 0.95), false);
});

test('recommends a threshold that reaches the accuracy target exactly', async () => {
  const run = await evaluateAccuracy(19, 20);
  assert.equal(run.report.readyAccuracy, 0.95);
  assert.equal(run.report.suggestedMinConfidence, 0.5);
  assert.equal(meetsReadyAccuracy(run.rows, 0.95), true);
});

test('thresholds without ready results never qualify for a recommendation', async () => {
  const response = structuredClone(fixture.response);
  response.answers.route.choice = '__review__';
  response.answers.route.probabilities = { billing: 0, technical: 0, __review__: 1 };
  const run = await evaluate('route', [{ ...invoiceCase, expected: { suggestedRoute: null } }], {
    mode: 'fixture',
    client: clientReturning(response),
  });
  assert.equal(run.report.correct, 1);
  assert.ok(run.report.thresholds.every((threshold) => threshold.readyCases === 0));
  assert.equal(run.report.suggestedMinConfidence, null);
  assert.equal(meetsReadyAccuracy(run.rows, 0), false);
});

test('acceptance accuracy excludes correct review outcomes and failed cases', () => {
  assert.equal(
    meetsReadyAccuracy(
      [
        { ready: true, correct: false },
        { ready: false, correct: true },
        { ready: false, correct: false, error: 'Provider unavailable' },
      ],
      0.5,
    ),
    false,
  );
});

function clientReturning(response) {
  return createClient({
    apiKey: 'offline-test',
    baseURL: 'https://offline.invalid',
    retry: { maxRetries: 0 },
    fetch: async () =>
      new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
  });
}

function evaluateAccuracy(correctCases, totalCases) {
  const cases = Array.from({ length: totalCases }, (_, index) => ({
    ...invoiceCase,
    id: String(index),
    expected: { suggestedRoute: index < correctCases ? 'billing' : 'technical' },
  }));
  return evaluate('route', cases, { mode: 'fixture', client: clientReturning(fixture.response) });
}
