import { generateText, jsonSchema, stepCountIs, tool } from 'ai';
import { MockLanguageModelV3 } from 'ai/test';
import { completionCheck, guardTools, routeModelStep } from 'jev-recipes/ai-sdk';
import { fixture } from '../shared/fixtures.mjs';

const live = process.argv.includes('--live');
if (process.argv.slice(2).some((arg) => arg !== '--live'))
  throw new Error('Usage: node examples/ai-sdk-agent/run.mjs [--live]');

const fixtures = {
  'model-route': fixture({ decision: 'candidate_0', effort: 0 }),
  allow: fixture({ decision: 'allow', default: 0.02 }),
  ask: fixture({ decision: 'ask', irreversible: 0.98, default: 0.02 }),
  unverified: fixture({ decision: 'unverified', claimsWithoutEvidence: 0.98, default: 0.02 }),
  complete: fixture({ decision: 'complete', default: 0.02 }),
};
const jev = live
  ? { model: 'jev-1.13.0' }
  : {
      client: {
        systemOne: async (request) => {
          const { questions, state } = request;
          const pick =
            'effort' in questions
              ? fixtures['model-route']
              : 'irreversible' in questions
                ? String(state.toolCall).startsWith('publish_release')
                  ? fixtures.ask
                  : fixtures.allow
                : state.evidence
                  ? fixtures.complete
                  : fixtures.unverified;
          return pick(request);
        },
      },
    };

const turns = [
  [{ type: 'tool-call', toolCallId: 'c1', toolName: 'run_tests', input: '{"pattern":"account"}' }],
  [
    {
      type: 'tool-call',
      toolCallId: 'c2',
      toolName: 'publish_release',
      input: '{"version":"1.2.0"}',
    },
  ],
  [
    {
      type: 'tool-call',
      toolCallId: 'c3',
      toolName: 'report_completion',
      input: '{"report":"Tests pass and the release is published."}',
    },
  ],
  [
    {
      type: 'tool-call',
      toolCallId: 'c4',
      toolName: 'report_completion',
      input:
        '{"report":"Tests pass. Publishing needs a person to confirm.","evidence":"run_tests: 12 passed, 0 failed."}',
    },
  ],
];
let turn = 0;
const usage = {
  inputTokens: { total: 0, noCache: 0, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 0, text: 0, reasoning: 0 },
  raw: {},
};
const scripted = (modelId) =>
  new MockLanguageModelV3({
    modelId,
    doGenerate: async () => ({
      content: turns[turn++] ?? [{ type: 'text', text: 'Stopping.' }],
      finishReason: { unified: turn <= turns.length ? 'tool-calls' : 'stop', raw: '' },
      usage,
      warnings: [],
    }),
  });

const trace = [];
const tools = guardTools(
  {
    run_tests: tool({
      description: 'Run the test suite for a file pattern.',
      inputSchema: jsonSchema({ type: 'object', properties: { pattern: { type: 'string' } } }),
      execute: async ({ pattern }) => ({ pattern, passed: 12, failed: 0 }),
    }),
    publish_release: tool({
      description: 'Publish a release to the public registry.',
      inputSchema: jsonSchema({ type: 'object', properties: { version: { type: 'string' } } }),
      execute: async ({ version }) => ({ published: version }),
    }),
  },
  {
    ...jev,
    policy: 'Local reads and tests are allowed. Ask before publishing or spending money.',
    onDecision: (event) => trace.push({ gate: event.toolName, action: event.decision.action }),
  },
);
const done = completionCheck({
  ...jev,
  onDecision: (event) => trace.push({ completion: event.decision.verdict }),
});

const result = await generateText({
  model: scripted('careful-model'),
  prompt: 'Run the account tests and publish release 1.2.0.',
  tools: { ...tools, ...done.tools },
  prepareStep: routeModelStep({
    ...jev,
    candidates: [
      {
        id: 'fast',
        text: 'Cheap and quick. Good for small edits and routine tool use.',
        model: scripted('fast-model'),
      },
      {
        id: 'careful',
        text: 'Expensive. Best for hard debugging and ambiguous changes.',
        model: scripted('careful-model'),
      },
    ],
    onDecision: (event) => trace.push({ route: event.decision.selection }),
  }),
  stopWhen: [stepCountIs(8), done.stopWhen],
});

console.log(
  JSON.stringify(
    {
      mode: live ? 'live-decisions' : 'fixture',
      note: 'The text model is scripted. Jev decisions come from fixtures unless --live is set. This demonstrates control flow, not accuracy.',
      steps: result.steps.map((step) => ({
        model: step.model.modelId,
        calls: step.toolCalls.map((call) => call.toolName),
        outputs: step.toolResults.map((item) => item.output),
      })),
      trace,
    },
    null,
    2,
  ),
);
