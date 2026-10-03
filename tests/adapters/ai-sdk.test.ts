import { describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { generateText, jsonSchema, stepCountIs, tool } from 'ai';
import type { ToolSet } from 'ai';
import { MockLanguageModelV3 } from 'ai/test';
import type { LanguageModelV3GenerateResult } from '@ai-sdk/provider';
import {
  completionCheck,
  guardTools,
  recipeTool,
  recipeTools,
  routeModelStep,
} from '../../adapters/ai-sdk/index.js';
import { createJevClient, responseMetadata } from '../recipe/helpers/jev.js';
import { completionAnswers, gateAnswers, routeAnswers, routeRecipeAnswers } from './helpers.js';

const executionOptions = {
  toolCallId: 'call-1',
  messages: [{ role: 'user' as const, content: 'Fix the failing test and report back.' }],
  context: {},
};

function scriptedModel(modelId: string, script: () => LanguageModelV3GenerateResult['content']) {
  const usage = {
    inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
    outputTokens: { total: 1, text: 1, reasoning: 0 },
    raw: {},
  };
  return new MockLanguageModelV3({
    modelId,
    doGenerate: async () => {
      const content = script();
      const finished = content.every((part) => part.type !== 'tool-call');
      return {
        content,
        finishReason: finished
          ? { unified: 'stop', raw: 'stop' }
          : { unified: 'tool-calls', raw: 'tool_calls' },
        usage,
        warnings: [],
      };
    },
  });
}

function toolCall(toolCallId: string, toolName: string, input: unknown) {
  return { type: 'tool-call' as const, toolCallId, toolName, input: JSON.stringify(input) };
}

describe('recipeTool', () => {
  it('exposes a recipe with its catalog description and JSON input schema', async () => {
    const client = createJevClient(routeRecipeAnswers(['billing', 'technical'], 'billing'));
    const route = recipeTool('route', { client });
    expect(route.description).toContain('Choose a named handler');
    expect(route.description).toContain('Use when:');
    expect(route.inputSchema).toMatchObject({
      jsonSchema: { type: 'object', required: ['request', 'routes'] },
    });
    const signal = new AbortController().signal;
    const result = await route.execute!(
      { request: 'I was charged twice.', routes: { billing: 'Invoices', technical: 'Errors' } },
      { ...executionOptions, abortSignal: signal },
    );
    expect(result).toMatchObject({ ...responseMetadata, status: 'ready', route: 'billing' });
    expect(client.systemOne).toHaveBeenCalledWith(expect.anything(), { signal });
  });

  it('prefers an explicit description and recipe-level signal', async () => {
    const client = createJevClient(routeRecipeAnswers(['billing'], 'billing'));
    const signal = new AbortController().signal;
    const route = recipeTool('route', { client, description: 'Send tickets to a queue.', signal });
    expect(route.description).toBe('Send tickets to a queue.');
    await route.execute!(
      { request: 'Invoice question.', routes: { billing: 'Invoices' } },
      { ...executionOptions, abortSignal: new AbortController().signal },
    );
    expect(client.systemOne).toHaveBeenCalledWith(expect.anything(), { signal });
  });

  it('rejects invalid recipe input before calling Jev and rejects unknown recipes', async () => {
    const client = createJevClient();
    const route = recipeTool('route', { client });
    await expect(route.execute!({ request: '' }, executionOptions)).rejects.toBeInstanceOf(
      ZodError,
    );
    expect(client.systemOne).not.toHaveBeenCalled();
    expect(() => recipeTool('not-a-recipe' as never)).toThrow();
  });

  it('builds a tool set keyed by recipe id', () => {
    const tools = recipeTools(['route', 'rerank']);
    expect(Object.keys(tools)).toEqual(['route', 'rerank']);
    expect(tools.rerank!.description).toContain('passages');
  });
});

describe('guardTools', () => {
  const execute = vi.fn(async (input?: { pattern: string }) => ({
    passed: true,
    pattern: input?.pattern,
  }));
  const runTests = tool({
    description: 'Run the test suite.',
    inputSchema: jsonSchema<{ pattern: string } | undefined>({ type: 'object' }),
    execute,
  });

  it('runs an allowed call unchanged and derives the request from the last user message', async () => {
    execute.mockClear();
    const client = createJevClient(gateAnswers('allow'));
    const seen: unknown[] = [];
    const guarded = guardTools(
      { run_tests: runTests },
      { client, policy: 'Local tests are allowed.', onDecision: (event) => seen.push(event) },
    );
    const output = await lastToolOutput(
      guarded.run_tests!.execute!({ pattern: 'account' }, executionOptions),
    );
    expect(output).toEqual({ passed: true, pattern: 'account' });
    expect(execute).toHaveBeenCalledWith({ pattern: 'account' }, executionOptions);
    expect(client.systemOne.mock.calls[0]?.[0].state).toEqual({
      request: 'Fix the failing test and report back.',
      toolCall: 'run_tests({"pattern":"account"})',
      policy: 'Local tests are allowed.',
    });
    expect(seen).toEqual([
      {
        toolName: 'run_tests',
        input: { pattern: 'account' },
        decision: expect.objectContaining({ action: 'allow' }),
      },
    ]);
    expect(guarded.run_tests!.description).toBe('Run the test suite.');
  });

  it.each([
    { verdict: 'ask' as const, confidence: 0.9, action: 'ask', phrase: 'confirm it first' },
    { verdict: 'deny' as const, confidence: 0.9, action: 'deny', phrase: 'refused by policy' },
    { verdict: 'allow' as const, confidence: 0.5, action: 'ask', phrase: 'confirm it first' },
    { verdict: 'unclear' as const, confidence: 0.9, action: 'ask', phrase: 'confirm it first' },
  ])(
    'returns a blocked output for $verdict at confidence $confidence instead of running',
    async ({ verdict, confidence, action, phrase }) => {
      execute.mockClear();
      const client = createJevClient(gateAnswers(verdict, confidence, { irreversible: 0.95 }));
      const guarded = guardTools({ run_tests: runTests }, { client, request: 'Ship it.' });
      const output = await lastToolOutput(
        guarded.run_tests!.execute!({ pattern: 'x' }, executionOptions),
      );
      expect(output).toMatchObject({
        blocked: true,
        action,
        verdict,
        detected: ['irreversible'],
        message: expect.stringContaining(phrase),
      });
      expect((output as unknown as { message: string }).message).toContain('irreversible');
      expect(execute).not.toHaveBeenCalled();
      expect(client.systemOne.mock.calls[0]?.[0].state).toMatchObject({ request: 'Ship it.' });
    },
  );

  it('forwards context, threshold, and the abort signal to the gate', async () => {
    const client = createJevClient(gateAnswers('allow', 0.9));
    const guarded = guardTools(
      { run_tests: runTests },
      { client, request: 'Ship it.', context: 'On a feature branch.', minConfidence: 0.95 },
    );
    const signal = new AbortController().signal;
    const output = await lastToolOutput(
      guarded.run_tests!.execute!({ pattern: 'x' }, { ...executionOptions, abortSignal: signal }),
    );
    expect(output).toMatchObject({ blocked: true, action: 'ask', status: 'review' });
    expect(client.systemOne).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ context: 'On a feature branch.' }),
      }),
      { signal },
    );
  });

  it('fails closed when the request cannot be derived or the provider fails', async () => {
    execute.mockClear();
    const client = createJevClient(gateAnswers('allow'));
    const guarded = guardTools({ run_tests: runTests }, { client });
    await expect(
      lastToolOutput(
        guarded.run_tests!.execute!({ pattern: 'x' }, { ...executionOptions, messages: [] }),
      ),
    ).rejects.toThrow(/Cannot derive request/);
    client.systemOne.mockRejectedValue(new Error('Provider unavailable'));
    await expect(
      lastToolOutput(guarded.run_tests!.execute!({ pattern: 'x' }, executionOptions)),
    ).rejects.toThrow('Provider unavailable');
    expect(execute).not.toHaveBeenCalled();
  });

  it('reads the request from text parts and ignores non-text parts', async () => {
    const client = createJevClient(gateAnswers('allow'));
    const guarded = guardTools({ run_tests: runTests }, { client });
    await lastToolOutput(
      guarded.run_tests!.execute!(undefined, {
        ...executionOptions,
        messages: [
          { role: 'assistant', content: 'Working on it.' },
          {
            role: 'user',
            content: [
              { type: 'file', data: 'x' },
              { type: 'text', text: 'Run it.' },
            ],
          },
          { role: 'user', content: [{ type: 'image', image: 'y' }] },
        ] as never,
      }),
    );
    expect(client.systemOne.mock.calls[0]?.[0].state).toEqual({
      request: 'Run it.',
      toolCall: 'run_tests()',
    });
  });

  it('leaves tools without an execute function untouched', () => {
    const clientSide = { description: 'Rendered by the client.', inputSchema: jsonSchema({}) };
    const guarded = guardTools({ show: clientSide } as ToolSet, { request: 'Show it.' });
    expect(guarded.show).toBe(clientSide);
  });
});

describe('routeModelStep', () => {
  const fast = new MockLanguageModelV3({ modelId: 'fast-model' });
  const careful = new MockLanguageModelV3({ modelId: 'careful-model' });
  const candidates = [
    { id: 'fast', text: 'Small edits.', model: fast },
    { id: 'careful', text: 'Hard debugging.', model: careful },
  ];
  const messages = [{ role: 'user' as const, content: 'Rename a variable.' }];
  const stepOptions = (initialMessages: typeof messages) =>
    ({ initialMessages, stepNumber: 0, steps: [], messages: initialMessages }) as never;

  it('routes once per call and reuses the selected model for later steps', async () => {
    const client = createJevClient(routeAnswers('candidate_1', 2));
    const seen: unknown[] = [];
    const prepareStep = routeModelStep({
      candidates,
      client,
      onDecision: (event) => seen.push(event.model),
    });
    const first = await prepareStep(stepOptions(messages));
    const second = await prepareStep(stepOptions(messages));
    expect(first).toEqual({ model: careful });
    expect(second).toEqual({ model: careful });
    expect(client.systemOne).toHaveBeenCalledTimes(1);
    expect(client.systemOne.mock.calls[0]?.[0].state).toEqual({
      request: 'Rename a variable.',
      models: [
        { id: 'fast', text: 'Small edits.' },
        { id: 'careful', text: 'Hard debugging.' },
      ],
    });
    expect(seen).toEqual([careful]);
    await prepareStep(stepOptions([...messages]));
    expect(client.systemOne).toHaveBeenCalledTimes(2);
  });

  it('uses the fallback for an uncertain decision, or keeps the caller model', async () => {
    const client = createJevClient(routeAnswers('ambiguous', 2));
    const withFallback = routeModelStep({ candidates, client, fallback: fast, request: 'Hi.' });
    expect(await withFallback(stepOptions(messages))).toEqual({ model: fast });
    const without = routeModelStep({
      candidates,
      client,
      context: 'Batch job.',
      minConfidence: 0.5,
    });
    expect(await without(stepOptions(messages))).toEqual({});
    expect(client.systemOne.mock.calls[1]?.[0].state).toMatchObject({ context: 'Batch job.' });
  });

  it('rejects an empty candidate list and a call without a user message', async () => {
    expect(() => routeModelStep({ candidates: [] })).toThrow(/at least one/);
    const prepareStep = routeModelStep({ candidates, client: createJevClient() });
    await expect(prepareStep(stepOptions([]))).rejects.toThrow(/Cannot derive request/);
  });
});

describe('completionCheck', () => {
  it('accepts a demonstrated completion and stops the loop', async () => {
    const client = createJevClient(completionAnswers('complete'));
    const seen: unknown[] = [];
    const check = completionCheck({ client, onDecision: (event) => seen.push(event) });
    const report = check.tools.report_completion!;
    const output = await report.execute!(
      { report: 'Fixed the fee and reran the tests.', evidence: 'account-total: 1 passed.' },
      executionOptions,
    );
    expect(output).toMatchObject({ accepted: true, verdict: 'complete', status: 'ready' });
    expect(client.systemOne.mock.calls[0]?.[0].state).toEqual({
      task: 'Fix the failing test and report back.',
      report: 'Fixed the fee and reran the tests.',
      evidence: 'account-total: 1 passed.',
    });
    expect(seen).toHaveLength(1);
    const step = { toolResults: [{ toolName: 'report_completion', output }] };
    expect(await check.stopWhen({ steps: [step] } as never)).toBe(true);
    expect(await check.stopWhen({ steps: [] } as never)).toBe(false);
    expect(
      await check.stopWhen({
        steps: [{ toolResults: [{ toolName: 'report_completion', output: 'done' }] }],
      } as never),
    ).toBe(false);
  });

  it.each([
    { verdict: 'unverified' as const, confidence: 0.9, phrase: 'was not accepted' },
    { verdict: 'incomplete' as const, confidence: 0.9, phrase: 'was not accepted' },
    { verdict: 'complete' as const, confidence: 0.5, phrase: 'could not be judged' },
  ])('rejects $verdict at confidence $confidence and keeps the loop going', async (scenario) => {
    const client = createJevClient(
      completionAnswers(scenario.verdict, scenario.confidence, { claimsWithoutEvidence: 0.9 }),
    );
    const check = completionCheck({
      client,
      task: 'Fix the fee.',
      evidence: 'CI log: 3 passed.',
      toolName: 'done',
      minConfidence: 0.8,
    });
    const output = await check.tools.done!.execute!({ report: 'All done.' }, executionOptions);
    expect(output).toMatchObject({
      accepted: false,
      verdict: scenario.verdict,
      detected: ['claimsWithoutEvidence'],
      message: expect.stringContaining(scenario.phrase),
    });
    expect((output as { message: string }).message).toContain('claimsWithoutEvidence');
    expect(client.systemOne.mock.calls[0]?.[0].state).toEqual({
      task: 'Fix the fee.',
      report: 'All done.',
      evidence: 'CI log: 3 passed.',
    });
    const step = { toolResults: [{ toolName: 'done', output }] };
    expect(await check.stopWhen({ steps: [step] } as never)).toBe(false);
  });

  it('derives the task from the first user message and fails closed without one', async () => {
    const check = completionCheck({ client: createJevClient(completionAnswers('complete')) });
    await expect(
      check.tools.report_completion!.execute!(
        { report: 'Done.' },
        { ...executionOptions, messages: [] },
      ),
    ).rejects.toThrow(/Cannot derive task/);
  });
});

describe('generateText integration', () => {
  it('routes the model, blocks a risky call, rejects an unverified claim, then stops on acceptance', async () => {
    const jev = createJevClient();
    jev.systemOne.mockImplementation(async (request) => {
      const { questions, state } = request as {
        questions: Record<string, unknown>;
        state: Record<string, unknown>;
      };
      const answers =
        'effort' in questions
          ? routeAnswers('candidate_0', 2)
          : 'irreversible' in questions
            ? String(state.toolCall).startsWith('publish')
              ? gateAnswers('ask', 0.9, { irreversible: 0.9 })
              : gateAnswers('allow')
            : completionAnswers(state.evidence ? 'complete' : 'unverified', 0.9, {
                claimsWithoutEvidence: state.evidence ? 0.1 : 0.9,
              });
      return { ...responseMetadata, answers };
    });
    const turns = [
      [toolCall('c1', 'run_tests', { pattern: 'account' })],
      [toolCall('c2', 'publish_release', { version: '1.2.0' })],
      [toolCall('c3', 'report_completion', { report: 'Released.' })],
      [
        toolCall('c4', 'report_completion', {
          report: 'Tests pass; release blocked pending approval.',
          evidence: 'run_tests: passed.',
        }),
      ],
      [{ type: 'text' as const, text: 'Should not be reached.' }],
    ];
    let turn = 0;
    const script = () => turns[turn++]!;
    const fast = scriptedModel('fast-model', script);
    const careful = scriptedModel('careful-model', script);
    const executed: string[] = [];
    const tools = guardTools(
      {
        run_tests: tool({
          description: 'Run tests.',
          inputSchema: jsonSchema({ type: 'object' }),
          execute: async () => {
            executed.push('run_tests');
            return { passed: true };
          },
        }),
        publish_release: tool({
          description: 'Publish a release.',
          inputSchema: jsonSchema({ type: 'object' }),
          execute: async () => {
            executed.push('publish_release');
            return { published: true };
          },
        }),
      },
      { client: jev, policy: 'Ask before publishing.' },
    );
    const done = completionCheck({ client: jev });
    const result = await generateText({
      model: careful,
      prompt: 'Run the tests and publish the release.',
      tools: { ...tools, ...done.tools },
      prepareStep: routeModelStep({
        client: jev,
        candidates: [
          { id: 'fast', text: 'Small tasks.', model: fast },
          { id: 'careful', text: 'Hard tasks.', model: careful },
        ],
      }),
      stopWhen: [stepCountIs(6), done.stopWhen],
    });
    expect(result.steps.map((step) => step.model.modelId)).toEqual(Array(4).fill('fast-model'));
    expect(executed).toEqual(['run_tests']);
    const outputs = result.steps.map((step) => step.toolResults.map((item) => item.output));
    expect(outputs[0]).toEqual([{ passed: true }]);
    expect(outputs[1]).toEqual([expect.objectContaining({ blocked: true, action: 'ask' })]);
    expect(outputs[2]).toEqual([
      expect.objectContaining({ accepted: false, verdict: 'unverified' }),
    ]);
    expect(outputs[3]).toEqual([expect.objectContaining({ accepted: true })]);
    expect(result.steps).toHaveLength(4);
    const jevQuestions = jev.systemOne.mock.calls.map(([request]) =>
      Object.keys((request as { questions: Record<string, unknown> }).questions).at(-1),
    );
    expect(jevQuestions).toEqual([
      'effort',
      'injected',
      'injected',
      'unresolvedErrors',
      'unresolvedErrors',
    ]);
  });
});

async function lastToolOutput<OUTPUT>(outputs: AsyncIterable<OUTPUT>): Promise<OUTPUT | undefined> {
  let result: OUTPUT | undefined;
  for await (const output of outputs) result = output;
  return result;
}
