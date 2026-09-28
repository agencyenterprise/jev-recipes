import assert from 'node:assert/strict';
import { test } from 'node:test';
import { proposeSupportNextStep } from '../conversation.mjs';
import { supportConfig } from '../config.mjs';
import { scenarios, scenarioOptions } from '../scenarios.mjs';
import { conversationOutcomeSchema } from '../conversation-schema.mjs';

// Authored provider responses verify application behavior, not semantic accuracy.
function provider({ checks = ['present'], route = 'billing', confidence = 0.98, failAt } = {}) {
  const requests = [];
  return {
    requests,
    client: {
      systemOne: async (request) => {
        requests.push(request);
        const stage = Object.hasOwn(request.questions, 'route') ? 'route' : 'clarify';
        if (stage === failAt) throw new Error('private provider error');
        return {
          model: 'authored-fixture',
          usage: { input_tokens: 0, output_tokens: 0 },
          answers: Object.fromEntries(
            Object.entries(request.questions).map(([name, question], index) => {
              const choice = stage === 'route' ? route : checks[index];
              assert.ok(Object.hasOwn(question.criteria, choice));
              return [
                name,
                {
                  type: 'choice',
                  choice,
                  confidence,
                  probabilities: Object.fromEntries(
                    Object.keys(question.criteria).map((key) => [key, key === choice ? 1 : 0]),
                  ),
                },
              ];
            }),
          ),
        };
      },
    },
  };
}

test('missing information asks once, then routes the combined conversation', async () => {
  const input = { request: 'Something is wrong.' };
  const first = provider({ checks: ['missing'] });
  const question = await proposeSupportNextStep(input, supportConfig, first);
  assert.equal(question.action, 'propose_question');
  assert.equal(question.question, supportConfig.requirements[0].question);
  assert.equal(first.requests.length, 1);
  const second = provider({ route: 'technical' });
  const result = await proposeSupportNextStep(
    { ...input, answers: [{ requirementId: question.requirementId, text: 'Exports crash.' }] },
    supportConfig,
    second,
  );
  assert.equal(result.action, 'propose_route');
  assert.equal(result.route, 'technical');
  assert.equal(result.question, null);
  assert.equal(second.requests.length, 2);
  const expected = {
    request: input.request,
    followups: [{ question: question.question, answer: 'Exports crash.' }],
  };
  for (const request of second.requests)
    assert.deepEqual(JSON.parse(request.state.request), expected);
});

test('information already in the original request skips questions', async () => {
  const options = provider();
  const result = await proposeSupportNextStep(
    { request: 'Please explain my duplicate invoice charge.' },
    supportConfig,
    options,
  );
  assert.equal(result.action, 'propose_route');
  assert.equal(result.route, 'billing');
  assert.equal(result.question, null);
});

for (const verdict of ['missing', 'ambiguous'])
  test(`an answer still judged ${verdict} goes to review without another question or route`, async () => {
    const options = provider({ checks: [verdict] });
    const result = await proposeSupportNextStep(
      {
        request: 'Something is wrong.',
        answers: [
          { requirementId: 'issue', text: 'It works and does not work. I cannot explain.' },
        ],
      },
      supportConfig,
      options,
    );
    assert.equal(result.action, 'review');
    assert.equal(result.reason, 'unresolved-answer');
    assert.equal(result.question, null);
    assert.equal(options.requests.length, 1);
  });

test('questions follow configured priority, skip supplied details, and stop at the limit', async () => {
  const config = {
    ...supportConfig,
    maxQuestions: 1,
    requirements: [
      { id: 'issue', description: 'Problem described', question: 'What happened?' },
      { id: 'product', description: 'Affected product supplied', question: 'Which product?' },
      { id: 'version', description: 'Product version supplied', question: 'Which version?' },
    ],
  };
  const question = await proposeSupportNextStep(
    { request: 'Exports crash.' },
    config,
    provider({ checks: ['present', 'missing', 'missing'] }),
  );
  assert.equal(question.requirementId, 'product');
  const options = provider({ checks: ['present', 'present', 'missing'] });
  const result = await proposeSupportNextStep(
    { request: 'Exports crash.', answers: [{ requirementId: 'product', text: 'Desktop app' }] },
    config,
    options,
  );
  assert.equal(result.reason, 'question-limit');
  assert.equal(options.requests.length, 1);
  const complete = await proposeSupportNextStep(
    { request: 'Exports crash.', answers: [{ requirementId: 'product', text: 'Desktop app v2' }] },
    config,
    provider({ checks: ['present', 'present', 'present'] }),
  );
  assert.equal(complete.action, 'propose_route');
});

test('uncertain information never triggers a question, route, or fallback', async () => {
  const options = provider({ checks: ['missing'], confidence: 0.4 });
  const result = await proposeSupportNextStep({ request: 'Help.' }, supportConfig, {
    ...options,
    fallback: () => {
      throw new Error('Must not run fallback.');
    },
  });
  assert.equal(result.action, 'review');
  assert.equal(result.reason, 'clarification-uncertain');
  assert.equal(options.requests.length, 1);
});

test('empty requirements skip the information call and zero question allowance sends missing details to review', async () => {
  const options = provider();
  const result = await proposeSupportNextStep(
    { request: 'Invoice help.' },
    { ...supportConfig, requirements: [] },
    options,
  );
  assert.equal(result.action, 'propose_route');
  assert.equal(options.requests.length, 1);
  assert.ok(options.requests[0].questions.route);
  const missing = await proposeSupportNextStep(
    { request: 'Help.' },
    { ...supportConfig, maxQuestions: 0 },
    provider({ checks: ['missing'] }),
  );
  assert.equal(missing.reason, 'question-limit');
});

test('explicit no-fit stays review while a low-confidence suggestion may get one fallback', async () => {
  for (const [route, expectedCalls, expectedAction] of [
    ['__review__', 0, 'review'],
    ['billing', 1, 'propose_route'],
  ]) {
    const options = provider({ route });
    const base = options.client.systemOne;
    options.client.systemOne = async (request) => {
      const response = await base(request);
      if (response.answers.route) response.answers.route.confidence = 0.5;
      return response;
    };
    let calls = 0;
    const result = await proposeSupportNextStep(
      { request: 'The paid plan is inactive.' },
      supportConfig,
      {
        ...options,
        fallback: async () => {
          calls++;
          return { status: 'ready', route: 'technical' };
        },
      },
    );
    assert.equal(result.action, expectedAction);
    assert.equal(calls, expectedCalls);
  }
});

test('provider failures return review without exposing provider text', async () => {
  for (const failAt of ['clarify', 'route']) {
    const options = provider({ failAt });
    const result = await proposeSupportNextStep(
      { request: 'Invoice help.' },
      supportConfig,
      options,
    );
    assert.equal(result.action, 'review');
    assert.equal(result.reason, failAt === 'clarify' ? 'clarification-failed' : 'primary-failed');
    assert.equal(JSON.stringify(result).includes('private provider error'), false);
    assert.equal(options.requests.length, failAt === 'clarify' ? 1 : 2);
  }
});

test('an empty provider error still returns review with a failed trace', async () => {
  const result = await proposeSupportNextStep(
    { request: 'Invoice help.' },
    { ...supportConfig, requirements: [] },
    {
      client: {
        systemOne: async () => {
          throw new Error();
        },
      },
    },
  );
  assert.equal(result.action, 'review');
  assert.equal(result.reason, 'primary-failed');
  assert.equal(result.trace[0].status, 'failed');
});

test('malformed responses and invented fallback queues remain review', async () => {
  const malformed = await proposeSupportNextStep({ request: 'Help.' }, supportConfig, {
    client: { systemOne: async () => ({}) },
  });
  assert.equal(malformed.reason, 'clarification-failed');
  const invalid = await proposeSupportNextStep(
    { request: 'Invoice help.' },
    { ...supportConfig, requirements: [] },
    {
      ...provider({ confidence: 0.5 }),
      fallback: async () => ({ status: 'ready', route: 'invented' }),
    },
  );
  assert.equal(invalid.reason, 'fallback-failed');
  assert.equal(invalid.route, null);
});

for (const stage of ['before', 'clarify', 'route', 'fallback'])
  test(`cancellation at ${stage} stops the conversation`, async () => {
    const controller = new AbortController();
    const options = provider();
    const base = options.client.systemOne;
    options.client.systemOne = async (request, settings) => {
      assert.equal(settings.signal, controller.signal);
      const response = await base(request);
      const current = request.questions.route ? 'route' : 'clarify';
      if (current === stage) controller.abort();
      if (response.answers.route && stage === 'fallback') response.answers.route.confidence = 0.5;
      return response;
    };
    if (stage === 'before') controller.abort();
    await assert.rejects(
      proposeSupportNextStep({ request: 'Invoice help.' }, supportConfig, {
        ...options,
        signal: controller.signal,
        fallback: async (_, { signal }) => {
          assert.equal(signal, controller.signal);
          controller.abort();
        },
      }),
      { name: 'AbortError' },
    );
    assert.equal(options.requests.length, stage === 'before' ? 0 : stage === 'clarify' ? 1 : 2);
  });

test('invalid answers, oversized conversations, and invalid configuration fail before provider calls', async () => {
  const options = provider();
  const base = { request: 'Help.' };
  for (const input of [
    { ...base, answers: [{ requirementId: 'unknown', text: 'x' }] },
    {
      ...base,
      answers: [
        { requirementId: 'issue', text: 'x' },
        { requirementId: 'issue', text: 'y' },
      ],
    },
    { ...base, answers: [{ requirementId: 'issue', text: '' }] },
    { request: 'x'.repeat(12000), answers: [{ requirementId: 'issue', text: 'More detail.' }] },
  ])
    await assert.rejects(proposeSupportNextStep(input, supportConfig, options));
  for (const config of [
    { ...supportConfig, routes: { __review__: 'Invalid reserved route' } },
    {
      ...supportConfig,
      requirements: [...supportConfig.requirements, ...supportConfig.requirements],
    },
    { ...supportConfig, requirements: [{ ...supportConfig.requirements[0], question: '' }] },
    { ...supportConfig, maxQuestions: -1 },
  ])
    await assert.rejects(proposeSupportNextStep(base, config, options));
  await assert.rejects(
    proposeSupportNextStep(
      { ...base, answers: [{ requirementId: 'issue', text: 'Invoice help' }] },
      { ...supportConfig, maxQuestions: 0 },
      options,
    ),
  );
  assert.equal(options.requests.length, 0);
});

test('all saved scenarios exercise valid outcomes without network calls', async () => {
  const fetch = globalThis.fetch;
  globalThis.fetch = () => {
    throw new Error('Fixture tests must be offline.');
  };
  try {
    const expected = {
      ready: 'propose_route',
      escalation: 'propose_route',
      review: 'propose_question',
      unresolved: 'propose_question',
      conflict: 'propose_question',
      noFit: 'review',
      mixed: 'review',
      indirect: 'propose_route',
      failure: 'review',
    };
    for (const [name, scenario] of Object.entries(scenarios)) {
      const result = await proposeSupportNextStep(
        { request: scenario.request },
        supportConfig,
        scenarioOptions(name),
      );
      assert.equal(result.action, expected[name]);
      conversationOutcomeSchema.parse(result);
      if (scenario.reply) {
        const continued = await proposeSupportNextStep(
          {
            request: scenario.request,
            answers: [{ requirementId: result.requirementId, text: scenario.reply }],
          },
          supportConfig,
          scenarioOptions(name, true),
        );
        assert.equal(continued.action, name === 'review' ? 'propose_route' : 'review');
      }
    }
  } finally {
    globalThis.fetch = fetch;
  }
});
