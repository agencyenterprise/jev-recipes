import assert from 'node:assert/strict';
import { test } from 'node:test';
import { evaluateRecipe } from '../../evals/lib/evaluate.mjs';
import { loadRecipe, readGoldenCases } from '../../evals/lib/harness.mjs';

test('the original 50 route cases report mandatory review without extra provider calls', async () => {
  const recipe = await loadRecipe('route');
  const cases = (await readGoldenCases('route')).filter(
    (entry) => !entry.id.startsWith('featured-'),
  );
  const expected = new Map(
    cases.map((entry) => [entry.input.request, entry.expected.suggestedRoute]),
  );
  let calls = 0;
  const client = {
    async systemOne(request) {
      calls++;
      return responseFor(request, expected.get(request.state.request) ?? '__review__');
    },
  };
  const report = await evaluateRecipe(recipe, cases, { client });
  assert.equal(calls, cases.length);
  assert.equal(report.accuracy, 1);
  assert.equal(report.thresholdEvaluation, 'recipe-replay');
  for (const threshold of report.thresholds) {
    assert.equal(threshold.deferRate, 0.12);
    assert.equal(threshold.readyAccuracy, 1);
  }
});

test('thresholds use replayed status instead of the original confidence gate', async () => {
  const recipe = await loadRecipe('route');
  const report = await evaluateRecipe(
    recipe,
    [
      {
        id: 'low-confidence',
        input: recipe.fixture.input,
        expected: { suggestedRoute: 'billing' },
      },
    ],
    { client: { systemOne: async (request) => responseFor(request, 'billing', 0.7) } },
  );
  assert.deepEqual(thresholdValues(report, 0.7), {
    minConfidence: 0.7,
    deferRate: 0,
    readyAccuracy: 1,
  });
  assert.deepEqual(thresholdValues(report, 0.8), {
    minConfidence: 0.8,
    deferRate: 1,
    readyAccuracy: null,
  });
});

test('ready accuracy excludes correct outcomes that always require review', async () => {
  const recipe = await loadRecipe('route');
  const cases = [
    {
      id: 'wrong-route',
      input: { ...recipe.fixture.input, request: 'First request' },
      expected: { suggestedRoute: 'billing' },
    },
    {
      id: 'mandatory-review',
      input: { ...recipe.fixture.input, request: 'Second request' },
      expected: { suggestedRoute: null },
    },
  ];
  const client = {
    systemOne: async (request) =>
      responseFor(request, request.state.request === 'First request' ? 'technical' : '__review__'),
  };
  const report = await evaluateRecipe(recipe, cases, { client });
  assert.equal(report.accuracy, 0.5);
  assert.equal(report.failures.length, 1);
  assert.equal(report.suggestedMinConfidence, null);
  for (const row of report.thresholds) {
    assert.equal(row.deferRate, 0.5);
    assert.equal(row.readyAccuracy, 0);
  }
});

test('ambiguous selections stay in review at every threshold', async () => {
  const recipe = await loadRecipe('reference-resolve');
  const report = await evaluateRecipe(
    recipe,
    [
      {
        id: 'ambiguous',
        input: recipe.fixture.input,
        expected: { verdict: 'ambiguous' },
      },
    ],
    { client: { systemOne: async (request) => responseFor(request, 'ambiguous') } },
  );
  assert.ok(report.thresholds.every((row) => row.deferRate === 1 && row.readyAccuracy === null));
});

test('mixed routing batches replay every recorded request and preserve whole-case review', async () => {
  const recipe = await loadRecipe('route-many');
  const input = { ...recipe.fixture.input, batchSize: 1 };
  let calls = 0;
  const client = {
    async systemOne(request) {
      calls++;
      return responseFor(
        request,
        request.state.requests[0].id === input.requests[0].id ? '__review__' : 'billing',
      );
    },
  };
  const report = await evaluateRecipe(
    recipe,
    [
      {
        id: 'mixed',
        input,
        expected: { 'items.0.suggestedRoute': null },
      },
    ],
    { client },
  );
  assert.equal(calls, input.requests.length);
  assert.ok(report.thresholds.every((row) => row.deferRate === 1));
});

test('a ready fan-out decision is not blocked by an independently uncertain signal', async () => {
  const recipe = await loadRecipe('completion-gate');
  const response = structuredClone(recipe.fixture.response);
  response.answers.decision.confidence = 1;
  response.answers.openQuestions = { type: 'noul', noul: 0.5 };
  const report = await evaluateRecipe(
    recipe,
    [
      {
        id: 'uncertain-signal',
        input: recipe.fixture.input,
        expected: { verdict: response.answers.decision.choice },
      },
    ],
    { client: { systemOne: async () => structuredClone(response) } },
  );
  assert.ok(report.thresholds.every((row) => row.deferRate === 0));
});

test('verification checks determine readiness when there is no top-level status', async () => {
  const recipe = await loadRecipe('verify');
  const response = structuredClone(recipe.fixture.response);
  for (const answer of Object.values(response.answers)) answer.confidence = 0.75;
  const report = await evaluateRecipe(
    recipe,
    [
      {
        id: 'claims',
        input: recipe.fixture.input,
        expected: {
          'checks.0.verdict': response.answers.claim_0.choice,
          'checks.1.verdict': response.answers.claim_1.choice,
        },
      },
    ],
    { client: { systemOne: async () => structuredClone(response) } },
  );
  assert.equal(report.thresholds.find((row) => row.minConfidence === 0.7).deferRate, 0);
  assert.equal(report.thresholds.find((row) => row.minConfidence === 0.8).deferRate, 1);
  assert.equal(report.itemAccuracy, 1);
});

test('recipes without minConfidence do not publish a confidence-threshold table', async () => {
  const recipe = await loadRecipe('rerank');
  const report = await evaluateRecipe(
    recipe,
    [
      {
        id: 'ranking',
        input: recipe.fixture.input,
        expected: { status: 'ready' },
      },
    ],
    { client: { systemOne: async () => structuredClone(recipe.fixture.response) } },
  );
  assert.equal(report.thresholdEvaluation, 'not-applicable');
  assert.deepEqual(report.thresholds, []);
  assert.equal(report.suggestedMinConfidence, null);
});

test('failed provider calls remain failures and never become ready during replay', async () => {
  const recipe = await loadRecipe('route');
  let calls = 0;
  const report = await evaluateRecipe(
    recipe,
    [
      {
        id: 'failure',
        input: recipe.fixture.input,
        expected: { suggestedRoute: 'billing' },
      },
    ],
    {
      client: {
        systemOne: async () => {
          calls++;
          throw new Error('Provider unavailable');
        },
      },
    },
  );
  assert.equal(calls, 1);
  assert.equal(report.accuracy, 0);
  assert.equal(report.failures[0].error, 'Provider unavailable');
  assert.ok(report.thresholds.every((row) => row.deferRate === null && row.failedCases === 1));
});

function responseFor(request, selected, confidence = 1) {
  return {
    model: 'offline-evaluation-test',
    usage: { input_tokens: 0, output_tokens: 0 },
    answers: Object.fromEntries(
      Object.entries(request.questions).map(([name, question]) => [
        name,
        {
          type: 'choice',
          choice: selected,
          confidence,
          probabilities: Object.fromEntries(
            Object.keys(question.criteria).map((key) => [key, key === selected ? 1 : 0]),
          ),
        },
      ]),
    ),
  };
}

function thresholdValues(report, value) {
  const { minConfidence, deferRate, readyAccuracy } = report.thresholds.find(
    (row) => row.minConfidence === value,
  );
  return { minConfidence, deferRate, readyAccuracy };
}
