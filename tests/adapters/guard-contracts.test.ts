import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { z } from 'zod';
import { tool as langchainTool } from '@langchain/core/tools';
import { ToolMessage } from '@langchain/core/messages';
import {
  asSchema,
  convertToModelMessages,
  generateText,
  jsonSchema,
  streamText,
  tool as aiTool,
  validateUIMessages,
} from 'ai';
import { convertArrayToReadableStream, MockLanguageModelV3 } from 'ai/test';
import type { ToolExecutionOptions } from 'ai';
import { validate } from '@cfworker/json-schema';
import { guardTools as guardLangchain } from '../../adapters/langchain/index.js';
import { guardTools as guardAi } from '../../adapters/ai-sdk/index.js';
import type { BlockedToolOutput } from '../../adapters/shared.js';
import { createJevClient } from '../recipe/helpers/jev.js';
import { gateAnswers } from './helpers.js';

describe('LangChain guarded invocation', () => {
  it('transforms the supplied arguments exactly once after approval', async () => {
    const transform = vi.fn((seconds: number) => seconds * 1000);
    const execute = vi.fn(async (input: { duration: number }) => input);
    const original = langchainTool(execute, {
      name: 'duration',
      description: 'Convert seconds to milliseconds.',
      schema: z.object({ duration: z.number().transform(transform) }),
    });
    const client = createJevClient(gateAnswers('allow'));
    const [guarded] = guardLangchain([original], { request: 'Process this duration.', client });

    expect(await guarded!.invoke({ duration: 2 })).toEqual({ duration: 2000 });
    expect(transform).toHaveBeenCalledExactlyOnceWith(2, expect.anything());
    expect(execute).toHaveBeenCalledTimes(1);
    expect(client.systemOne.mock.calls[0]?.[0].state).toMatchObject({
      toolCall: 'duration({"duration":2})',
    });
  });

  it('preserves async transformations that change the input type', async () => {
    const transform = vi.fn(async (value: string) => Number(value));
    const original = langchainTool(async ({ count }) => count + 1, {
      name: 'increment',
      schema: z.object({ count: z.string().transform(transform) }),
    });
    const [guarded] = guardLangchain([original], {
      request: 'Increment.',
      client: createJevClient(gateAnswers('allow')),
    });
    expect(await guarded!.invoke({ count: '2' })).toBe(3);
    expect(transform).toHaveBeenCalledTimes(1);
    await expect(guarded!.invoke({ count: false })).rejects.toThrow(/did not match/);
  });

  it('preserves the artifact, call envelope, configuration, and callbacks', async () => {
    const artifact = { filename: 'report.csv' };
    const handleToolStart = vi.fn();
    const handleToolEnd = vi.fn();
    const original = langchainTool(async () => ['Report ready', artifact], {
      name: 'report',
      schema: z.object({}),
      responseFormat: 'content_and_artifact',
      returnDirect: true,
    });
    const invoke = vi.spyOn(original, 'invoke');
    const request = vi.fn(() => 'Create the report.');
    const [guarded] = guardLangchain([original], {
      request,
      client: createJevClient(gateAnswers('allow')),
    });
    const call = { type: 'tool_call' as const, id: 'report-1', name: 'report', args: {} };
    const config = {
      tags: ['reporting'],
      metadata: { account: 'example' },
      callbacks: [{ handleToolStart, handleToolEnd }],
      signal: new AbortController().signal,
    };
    const result = await guarded!.invoke(call, config);

    expect(result).toBeInstanceOf(ToolMessage);
    expect(result).toMatchObject({ content: 'Report ready', artifact, tool_call_id: 'report-1' });
    expect(invoke).toHaveBeenCalledExactlyOnceWith(call, config);
    expect(handleToolStart).toHaveBeenCalledTimes(1);
    expect(handleToolEnd).toHaveBeenCalledExactlyOnceWith(result, expect.anything(), undefined, [
      'reporting',
    ]);
    expect(request).toHaveBeenCalledWith(call.args, { ...config, toolCall: call });
    expect(guarded!.returnDirect).toBe(true);
  });

  it('returns blocked tool messages without validating or executing artifact tools', async () => {
    const transform = vi.fn((value: string) => value.toUpperCase());
    const execute = vi.fn(async () => ['Report ready', { filename: 'report.csv' }]);
    const original = langchainTool(execute, {
      name: 'report',
      schema: z.object({ format: z.string().transform(transform) }),
      responseFormat: 'content_and_artifact',
    });
    const [guarded] = guardLangchain([original], {
      request: 'Create the report.',
      client: createJevClient(gateAnswers('deny')),
    });
    const input = { format: 'csv' };
    const call = { type: 'tool_call' as const, name: 'report', id: 'report-2', args: input };
    for (const result of [
      await guarded!.invoke(call),
      await guarded!.invoke(input, { toolCall: call }),
    ]) {
      expect(result).toBeInstanceOf(ToolMessage);
      expect(result.tool_call_id).toBe('report-2');
      expect(JSON.parse(result.content)).toMatchObject({ blocked: true, action: 'deny' });
    }
    expect(transform).not.toHaveBeenCalled();
    expect(execute).not.toHaveBeenCalled();
  });

  it('guards call, batch, stream, and bound configuration entry points', async () => {
    const invoke = vi.fn(async (input: unknown) => input);
    const [guarded] = guardLangchain(
      [{ name: 'echo', description: 'Echo.', schema: { type: 'object' }, invoke }],
      { request: 'Echo.', client: createJevClient(gateAnswers('deny')) },
    );
    const outputs = [
      await guarded!.call({ value: 1 }),
      await guarded!.call({ value: 2 }, {}, ['legacy']),
      await guarded!.call({ value: 3 }, { tags: ['configured'] }, ['legacy']),
      ...(await guarded!.batch([{ value: 4 }, { value: 5 }])),
      ...(await collect(await guarded!.stream({ value: 6 }))),
      await guarded!.withConfig({ tags: ['bound'] }).invoke({ value: 7 }),
      await guarded!.func({ value: 8 }),
    ];
    expect(outputs).toHaveLength(8);
    for (const output of outputs) expect(output).toMatchObject({ blocked: true });
    expect(invoke).not.toHaveBeenCalled();
  });

  it.each(['before', 'during'] as const)('stops a cancelled call %s review', async (when) => {
    const controller = new AbortController();
    const invoke = vi.fn(async () => 'executed');
    const client = createJevClient(gateAnswers('allow'));
    const [guarded] = guardLangchain(
      [{ name: 'echo', description: 'Echo.', schema: { type: 'object' }, invoke }],
      {
        request: 'Echo.',
        client,
        onDecision: () => controller.abort(new Error('Cancelled')),
      },
    );
    if (when === 'before') controller.abort(new Error('Cancelled'));
    await expect(guarded!.invoke({}, { signal: controller.signal })).rejects.toThrow('Cancelled');
    expect(invoke).not.toHaveBeenCalled();
    expect(client.systemOne).toHaveBeenCalledTimes(when === 'before' ? 0 : 1);
  });
});

describe('AI SDK guarded execution', () => {
  it.each(['done', 2, null, undefined])('retains default SDK formatting for %s', async (output) => {
    const original = { counter: aiTool({ inputSchema: z.object({}), execute: () => output }) };
    const unguarded = await generateText({
      model: toolCallingModel(),
      prompt: 'Count.',
      tools: original,
    });
    const guarded = await generateText({
      model: toolCallingModel(),
      prompt: 'Count.',
      tools: guardAi(original, { client: createJevClient(gateAnswers('allow')) }),
    });
    expect(guarded.response.messages.at(-1)).toEqual(unguarded.response.messages.at(-1));
  });

  it('preserves the type and identity of tools without local execution', () => {
    const clientOnly = { inputSchema: z.object({}), description: 'Render a counter.' };
    const tools = guardAi({ counter: clientOnly });
    expect(tools.counter).toBe(clientOnly);
    expectTypeOf(tools.counter).toEqualTypeOf<typeof clientOnly>();
    const optionalExecution: {
      inputSchema: typeof clientOnly.inputSchema;
      execute?: (
        input: Record<string, unknown>,
        options: ToolExecutionOptions<{}>,
      ) => Promise<number>;
    } = { inputSchema: clientOnly.inputSchema };
    const optionalTool = guardAi({ counter: optionalExecution }).counter;
    expect(optionalTool.execute).toBeUndefined();
    expectTypeOf(optionalTool.execute).extract<undefined>().toEqualTypeOf<undefined>();
  });

  it('executes an allowed streaming tool once and returns its final output', async () => {
    const execute = vi.fn(async function* () {
      yield { count: 1 };
      yield { count: 2 };
    });
    const result = await generateText({
      model: toolCallingModel(),
      prompt: 'Count.',
      tools: guardAi(
        { counter: aiTool({ inputSchema: z.object({}), execute }) },
        { client: createJevClient(gateAnswers('allow')) },
      ),
    });
    expect(execute).toHaveBeenCalledTimes(1);
    expect(result.toolResults.map((item) => item.output)).toEqual([{ count: 2 }]);
  });

  it('preserves preliminary results and the final result through streamText', async () => {
    const result = streamText({
      model: toolCallingModel(),
      prompt: 'Count.',
      tools: guardAi(
        {
          counter: aiTool({
            inputSchema: z.object({}),
            execute: async function* () {
              yield { count: 1 };
              yield { count: 2 };
            },
          }),
        },
        { client: createJevClient(gateAnswers('allow')) },
      ),
    });
    const events = await collect(result.fullStream);
    expect(events.filter((event) => event.type === 'tool-result')).toMatchObject([
      { preliminary: true, output: { count: 1 } },
      { preliminary: true, output: { count: 2 } },
      { output: { count: 2 } },
    ]);
    expect(events.filter((event) => event.type === 'error')).toEqual([]);
    expect((await result.toolResults).map((item) => item.output)).toEqual([{ count: 2 }]);
  });

  it.each(['generate', 'stream'] as const)(
    'serializes blocked results through %s without the original formatter',
    async (mode) => {
      const execute = vi.fn(async () => ({ counts: [1, 2] }));
      const toModelOutput = vi.fn(({ output }: { output: { counts: number[] } }) => ({
        type: 'text' as const,
        value: output.counts.join(','),
      }));
      const tools = guardAi(
        { counter: aiTool({ inputSchema: z.object({}), execute, toModelOutput }) },
        { client: createJevClient(gateAnswers('deny')) },
      );
      const options = { model: toolCallingModel(), prompt: 'Count.', tools };
      const result = mode === 'generate' ? await generateText(options) : streamText(options);
      if ('fullStream' in result) {
        expect(
          (await collect(result.fullStream)).filter((event) => event.type === 'error'),
        ).toEqual([]);
      }
      expect((await result.toolResults)[0]?.output).toMatchObject({ blocked: true });
      const message = (await result.response).messages.at(-1);
      expect(message).toMatchObject({
        role: 'tool',
        content: [{ output: { type: 'json', value: { blocked: true } } }],
      });
      expect(execute).not.toHaveBeenCalled();
      expect(toModelOutput).not.toHaveBeenCalled();
    },
  );

  it('keeps concurrent allowed and blocked results separate, even when allowed data says blocked', async () => {
    const client = createJevClient(gateAnswers('allow'));
    client.systemOne.mockResolvedValueOnce({
      model: 'fixture',
      usage: { input_tokens: 0, output_tokens: 0 },
      answers: gateAnswers('deny'),
    });
    const toModelOutput = vi.fn(
      ({ output }: { output: { blocked: boolean; counts: number[] } }) => ({
        type: 'text' as const,
        value: output.counts.join(','),
      }),
    );
    const original = aiTool({
      inputSchema: z.object({}),
      execute: () => ({ blocked: true, counts: [1, 2] }),
      toModelOutput,
    });
    const tools = guardAi({ counter: original }, { client, request: 'Count.' });
    const [denied, allowed] = await Promise.all([
      collect(tools.counter.execute({}, executionOptions('denied'))),
      collect(tools.counter.execute({}, executionOptions('allowed'))),
    ]);
    const blockedOutput = denied[0]!;
    const allowedOutput = allowed[0]!;
    expect(
      await tools.counter.toModelOutput!({
        toolCallId: 'denied',
        input: {},
        output: blockedOutput,
      }),
    ).toMatchObject({
      type: 'json',
      value: { blocked: true, action: 'deny' },
    });
    expect(
      await tools.counter.toModelOutput!({
        toolCallId: 'allowed',
        input: {},
        output: allowedOutput,
      }),
    ).toEqual({ type: 'text', value: '1,2' });
    expect(toModelOutput).toHaveBeenCalledTimes(1);
    expect(original.execute({}, executionOptions())).toEqual({ blocked: true, counts: [1, 2] });
    expectTypeOf(allowedOutput).toEqualTypeOf<
      { blocked: boolean; counts: number[] } | BlockedToolOutput
    >();
  });

  it('recognizes blocked output after saving, validating, and restoring a UI conversation', async () => {
    const toModelOutput = vi.fn(({ output }: { output: { count: number } }) => ({
      type: 'text' as const,
      value: output.count.toFixed(0),
    }));
    const tools = guardAi(
      {
        counter: aiTool({
          inputSchema: z.object({}),
          outputSchema: z.object({ count: z.number() }),
          execute: () => ({ count: 2 }),
          toModelOutput,
        }),
      },
      { request: 'Count.', client: createJevClient(gateAnswers('deny')) },
    );
    const blocked = (await collect(tools.counter.execute({}, executionOptions())))[0];
    const messages = await validateUIMessages({
      tools,
      messages: [
        {
          id: 'message-1',
          role: 'assistant',
          parts: [
            {
              type: 'tool-counter',
              toolCallId: 'call-1',
              state: 'output-available',
              input: {},
              output: JSON.parse(JSON.stringify(blocked)),
            },
          ],
        },
      ],
    });
    const restored = await convertToModelMessages(messages, { tools });
    expect(restored.at(-1)).toMatchObject({
      role: 'tool',
      content: [
        {
          output: {
            type: 'json',
            value: { kind: 'jev-recipes/blocked-tool-output', blocked: true },
          },
        },
      ],
    });
    expect(toModelOutput).not.toHaveBeenCalled();
  });

  it('validates blocked and successful outputs while retaining original schema references', async () => {
    const outputSchema = jsonSchema<{ count: number }>(
      {
        type: 'object',
        properties: { count: { $ref: '#/definitions/count' } },
        required: ['count'],
        definitions: { count: { type: 'number' } },
      },
      {
        validate: (value) => {
          const parsed = z.object({ count: z.number() }).safeParse(value);
          return parsed.success
            ? { success: true, value: parsed.data }
            : { success: false, error: parsed.error };
        },
      },
    );
    const tools = guardAi(
      {
        counter: aiTool({
          inputSchema: z.object({}),
          outputSchema,
          execute: () => ({ count: 2 }),
        }),
      },
      { request: 'Count.', client: createJevClient(gateAnswers('deny')) },
    );
    const blocked = (await collect(tools.counter.execute({}, executionOptions())))[0]!;
    const schema = asSchema(tools.counter.outputSchema);
    expect(await schema.validate!({ count: 2 })).toEqual({ success: true, value: { count: 2 } });
    expect(await schema.validate!({ count: 'wrong' })).toMatchObject({ success: false });
    expect(await schema.validate!(blocked)).toMatchObject({
      success: true,
      value: { blocked: true },
    });
    const json = await schema.jsonSchema;
    expect(validate({ count: 2 }, json).valid).toBe(true);
    expect(validate({ count: 'wrong' }, json).valid).toBe(false);
    expect(validate(blocked, json).valid).toBe(true);
  });

  it('retains output schemas that do not supply a runtime validator', async () => {
    const tools = guardAi(
      {
        counter: aiTool({
          inputSchema: z.object({}),
          outputSchema: jsonSchema({ type: 'number' }),
          execute: () => 2,
        }),
      },
      { request: 'Count.', client: createJevClient(gateAnswers('allow')) },
    );
    expect(await asSchema(tools.counter.outputSchema).validate!(2)).toEqual({
      success: true,
      value: 2,
    });
  });

  it.each(['before', 'during'] as const)('stops a cancelled call %s review', async (when) => {
    const controller = new AbortController();
    const execute = vi.fn(() => 2);
    const client = createJevClient(gateAnswers('allow'));
    const tools = guardAi(
      { counter: aiTool({ inputSchema: z.object({}), execute }) },
      {
        request: 'Count.',
        client,
        onDecision: () => controller.abort(new Error('Cancelled')),
      },
    );
    if (when === 'before') controller.abort(new Error('Cancelled'));
    await expect(
      collect(tools.counter.execute({}, { ...executionOptions(), abortSignal: controller.signal })),
    ).rejects.toThrow('Cancelled');
    expect(execute).not.toHaveBeenCalled();
    expect(client.systemOne).toHaveBeenCalledTimes(when === 'before' ? 0 : 1);
  });

  it('closes the original iterator when the consumer stops reading', async () => {
    const closed = vi.fn();
    const tools = guardAi(
      {
        counter: aiTool({
          inputSchema: z.object({}),
          execute: async function* () {
            try {
              yield 1;
              yield 2;
            } finally {
              closed();
            }
          },
        }),
      },
      { request: 'Count.', client: createJevClient(gateAnswers('allow')) },
    );
    const output = tools.counter.execute({}, executionOptions());
    expect(await output.next()).toMatchObject({ done: false, value: 1 });
    await output.return(undefined);
    expect(closed).toHaveBeenCalledTimes(1);
  });
});

function executionOptions(toolCallId = 'call-1') {
  return { toolCallId, messages: [], context: {} };
}

function toolCallingModel() {
  const call = {
    type: 'tool-call' as const,
    toolCallId: 'call-1',
    toolName: 'counter',
    input: '{}',
  };
  const usage = {
    inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
    outputTokens: { total: 1, text: 1, reasoning: 0 },
    raw: {},
  };
  const finishReason = { unified: 'tool-calls' as const, raw: 'tool_calls' };
  return new MockLanguageModelV3({
    doGenerate: async () => ({ content: [call], finishReason, usage, warnings: [] }),
    doStream: async () => ({
      stream: convertArrayToReadableStream([
        { type: 'stream-start', warnings: [] },
        call,
        { type: 'finish', finishReason, usage },
      ]),
    }),
  });
}

async function collect<OUTPUT>(outputs: AsyncIterable<OUTPUT>): Promise<OUTPUT[]> {
  const results: OUTPUT[] = [];
  for await (const output of outputs) results.push(output);
  return results;
}
