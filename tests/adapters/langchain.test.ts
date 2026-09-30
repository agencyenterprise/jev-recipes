import { describe, expect, it, vi } from 'vitest';
import { tool } from '@langchain/core/tools';
import { ToolMessage } from '@langchain/core/messages';
import { ZodError } from 'zod';
import {
  completionTool,
  guardTools,
  recipeTool,
  recipeTools,
} from '../../adapters/langchain/index.js';
import { createJevClient, responseMetadata } from '../recipe/helpers/jev.js';
import { completionAnswers, gateAnswers, routeRecipeAnswers } from './helpers.js';

const runTests = vi.fn(async (input: { pattern: string }) => ({
  passed: true,
  pattern: input.pattern,
}));
const runTestsSchema = {
  type: 'object',
  properties: { pattern: { type: 'string' } },
  required: ['pattern'],
} as const;
const runTestsTool = tool(runTests, {
  name: 'run_tests',
  description: 'Run the test suite.',
  schema: runTestsSchema,
});

describe('recipeTool', () => {
  it('exposes a recipe as a structured tool with its JSON schema', async () => {
    const client = createJevClient(routeRecipeAnswers(['billing', 'technical'], 'billing'));
    const route = recipeTool('route', { client });
    expect(route.name).toBe('route');
    expect(route.description).toContain('Use when:');
    expect(route.schema).toMatchObject({ type: 'object', required: ['request', 'routes'] });
    const result = await route.invoke({
      request: 'I was charged twice.',
      routes: { billing: 'Invoices', technical: 'Errors' },
    });
    expect(result).toMatchObject({ ...responseMetadata, status: 'ready', route: 'billing' });
  });

  it('returns a tool message when invoked with a tool call and honors the config signal', async () => {
    const client = createJevClient(routeRecipeAnswers(['billing'], 'billing'));
    const route = recipeTool('route', { client, description: 'Pick a queue.' });
    expect(route.description).toBe('Pick a queue.');
    const signal = new AbortController().signal;
    const message = await route.invoke(
      {
        type: 'tool_call',
        id: 'call-1',
        name: 'route',
        args: { request: 'Invoice question.', routes: { billing: 'Invoices' } },
      },
      { signal },
    );
    expect(message).toBeInstanceOf(ToolMessage);
    expect(JSON.parse(String((message as ToolMessage).content))).toMatchObject({
      route: 'billing',
    });
    expect(client.systemOne).toHaveBeenCalledWith(expect.anything(), { signal });
  });

  it('rejects invalid input before calling Jev and rejects unknown recipes', async () => {
    const client = createJevClient();
    const route = recipeTool('route', { client });
    await expect(route.invoke({ request: 5 } as never)).rejects.toThrow(/did not match/);
    await expect(route.invoke({ request: ' ', routes: {} } as never)).rejects.toBeInstanceOf(
      ZodError,
    );
    expect(client.systemOne).not.toHaveBeenCalled();
    expect(() => recipeTool('not-a-recipe' as never)).toThrow();
  });

  it('builds tools in catalog order', () => {
    expect(recipeTools(['rerank', 'route']).map((item) => item.name)).toEqual(['rerank', 'route']);
  });
});

describe('guardTools', () => {
  it('delegates an allowed call to the original tool with the same name and schema', async () => {
    runTests.mockClear();
    const client = createJevClient(gateAnswers('allow'));
    const seen: unknown[] = [];
    const [guarded] = guardTools([runTestsTool], {
      client,
      request: 'Fix the failing test.',
      policy: 'Local tests are allowed.',
      onDecision: (event) => seen.push(event.toolName),
    });
    expect(guarded!.name).toBe('run_tests');
    expect(guarded!.description).toBe('Run the test suite.');
    expect(guarded!.schema).toBe(runTestsTool.schema);
    const output = await guarded!.invoke({ pattern: 'account' });
    expect(output).toEqual({ passed: true, pattern: 'account' });
    expect(runTests).toHaveBeenCalledTimes(1);
    expect(client.systemOne.mock.calls[0]?.[0].state).toEqual({
      request: 'Fix the failing test.',
      toolCall: 'run_tests({"pattern":"account"})',
      policy: 'Local tests are allowed.',
    });
    expect(seen).toEqual(['run_tests']);
  });

  it('returns one tool message for a delegated tool call', async () => {
    const client = createJevClient(gateAnswers('allow'));
    const [guarded] = guardTools([runTestsTool], { client, request: 'Fix it.' });
    const message = await guarded!.invoke({
      type: 'tool_call',
      id: 'call-7',
      name: 'run_tests',
      args: { pattern: 'fee' },
    });
    expect(message).toBeInstanceOf(ToolMessage);
    expect((message as ToolMessage).tool_call_id).toBe('call-7');
    expect(JSON.parse(String((message as ToolMessage).content))).toEqual({
      passed: true,
      pattern: 'fee',
    });
  });

  it.each([
    { verdict: 'ask' as const, confidence: 0.9, action: 'ask' },
    { verdict: 'deny' as const, confidence: 0.9, action: 'deny' },
    { verdict: 'allow' as const, confidence: 0.6, action: 'ask' },
  ])(
    'blocks a $verdict decision at confidence $confidence',
    async ({ verdict, confidence, action }) => {
      runTests.mockClear();
      const client = createJevClient(gateAnswers(verdict, confidence, { destructive: 0.9 }));
      const [guarded] = guardTools([runTestsTool], {
        client,
        request: (input) => `Run ${(input as { pattern: string }).pattern}.`,
        context: 'Main branch.',
        minConfidence: 0.8,
      });
      const output = await guarded!.invoke({ pattern: 'all' });
      expect(output).toMatchObject({ blocked: true, action, verdict, detected: ['destructive'] });
      expect(runTests).not.toHaveBeenCalled();
      expect(client.systemOne.mock.calls[0]?.[0].state).toEqual({
        request: 'Run all.',
        toolCall: 'run_tests({"pattern":"all"})',
        context: 'Main branch.',
        minConfidence: undefined,
      });
    },
  );

  it('guards any object with a name, schema, and invoke method', async () => {
    const client = createJevClient(gateAnswers('allow'));
    const plain = {
      name: 'echo',
      description: 'Echo the input.',
      schema: { type: 'object' },
      invoke: async (input: unknown) => ({ echoed: input }),
    };
    const [guarded] = guardTools([plain], { client, request: 'Echo it.' });
    expect(guarded!.returnDirect).toBe(false);
    expect(await guarded!.invoke({ text: 'hi' })).toEqual({ echoed: { text: 'hi' } });
  });

  it('preserves returnDirect and fails closed on provider failure', async () => {
    runTests.mockClear();
    const direct = tool(runTests, {
      name: 'run_tests',
      schema: runTestsSchema,
      returnDirect: true,
    });
    const client = createJevClient();
    client.systemOne.mockRejectedValue(new Error('Provider unavailable'));
    const [guarded] = guardTools([direct], { client, request: 'Fix it.' });
    expect(guarded!.returnDirect).toBe(true);
    await expect(guarded!.invoke({ pattern: 'x' })).rejects.toThrow('Provider unavailable');
    expect(runTests).not.toHaveBeenCalled();
  });
});

describe('completionTool', () => {
  it('accepts a demonstrated completion and reports rejected claims', async () => {
    const client = createJevClient(completionAnswers('complete'));
    const seen: unknown[] = [];
    const report = completionTool({
      client,
      task: 'Fix the fee.',
      onDecision: (event) => seen.push(event.decision.verdict),
    });
    expect(report.name).toBe('report_completion');
    const accepted = await report.invoke({ report: 'Fixed.', evidence: 'Tests pass.' });
    expect(accepted).toMatchObject({ accepted: true, verdict: 'complete' });
    expect(client.systemOne.mock.calls[0]?.[0].state).toEqual({
      task: 'Fix the fee.',
      report: 'Fixed.',
      evidence: 'Tests pass.',
    });
    client.systemOne.mockResolvedValue({
      ...responseMetadata,
      answers: completionAnswers('unverified', 0.9, { claimsWithoutEvidence: 0.95 }),
    });
    const rejected = await completionTool({
      client,
      task: 'Fix the fee.',
      toolName: 'done',
    }).invoke({
      report: 'Fixed.',
    });
    expect(rejected).toMatchObject({
      accepted: false,
      verdict: 'unverified',
      detected: ['claimsWithoutEvidence'],
      message: expect.stringContaining('not accepted'),
    });
    expect(seen).toEqual(['complete']);
  });

  it('validates the report input and fails closed without a task', async () => {
    const report = completionTool({ client: createJevClient(), task: 'Fix the fee.' });
    await expect(report.invoke({} as never)).rejects.toThrow(/did not match/);
    await expect(
      completionTool({ client: createJevClient(), task: '' }).invoke({ report: 'Done.' }),
    ).rejects.toThrow(/Cannot derive task/);
  });
});
