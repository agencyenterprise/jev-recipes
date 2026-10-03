import { asSchema, jsonSchema, tool } from 'ai';
import type {
  FlexibleSchema,
  LanguageModel,
  PrepareStepFunction,
  StopCondition,
  Tool,
  ToolSet,
} from 'ai';
import { z } from 'zod';
import type { RecipeName } from '../../catalog/schema.js';
import { modelRoute } from '../../recipes/model-route/index.js';
import type { ModelRouteResult } from '../../recipes/model-route/index.js';
import type { RecipeOptions } from '../../src/schema.js';
import { toolCallGateResultSchema } from '../../recipes/tool-call-gate/index.js';
import {
  BLOCKED_TOOL_OUTPUT_KIND,
  COMPLETION_TOOL_DESCRIPTION,
  COMPLETION_TOOL_INPUT_SCHEMA,
  DEFAULT_COMPLETION_TOOL_NAME,
  blockedOutput,
  defineRecipeTool,
  messageText,
  requireText,
  reviewCompletion,
  reviewToolCall,
} from '../shared.js';
import type {
  BlockedToolOutput,
  CompletionOptions,
  CompletionToolOutput,
  GuardOptions,
  RecipeToolOptions,
} from '../shared.js';

export type {
  BlockedToolOutput,
  CompletionEvent,
  CompletionOptions,
  CompletionToolOutput,
  GuardEvent,
  GuardOptions,
  RecipeToolOptions,
} from '../shared.js';

export type RecipeTool = Tool<Record<string, unknown>, Record<string, unknown>>;

export function recipeTool(name: RecipeName, options: RecipeToolOptions = {}): RecipeTool {
  const definition = defineRecipeTool(name, options);
  return tool({
    description: definition.description,
    inputSchema: jsonSchema<Record<string, unknown>>(
      definition.inputSchema as Parameters<typeof jsonSchema>[0],
    ),
    execute: async (input, executionOptions) =>
      definition.execute(input, executionOptions.abortSignal),
  });
}

export function recipeTools(
  names: readonly RecipeName[],
  options: RecipeToolOptions = {},
): Record<string, RecipeTool> {
  return Object.fromEntries(names.map((name) => [name, recipeTool(name, options)]));
}

export type GuardToolsOptions = GuardOptions & { request?: string };

type ToolExecution<DEFINITION extends ToolSet[string]> = NonNullable<DEFINITION['execute']>;
type ToolOutput<RESULT> = RESULT extends AsyncIterable<infer OUTPUT> ? OUTPUT : Awaited<RESULT>;
type GuardedOutput<DEFINITION extends ToolSet[string]> =
  ToolOutput<ReturnType<ToolExecution<DEFINITION>>> | BlockedToolOutput;
type GuardedExecution<DEFINITION extends ToolSet[string]> = {
  [KEY in keyof Pick<DEFINITION, 'execute'>]: (
    ...args: Parameters<ToolExecution<DEFINITION>>
  ) => AsyncGenerator<GuardedOutput<DEFINITION>>;
};

type GuardedTool<DEFINITION extends ToolSet[string]> = DEFINITION extends unknown
  ? Omit<DEFINITION, 'execute' | 'toModelOutput' | 'outputSchema'> &
      GuardedExecution<DEFINITION> & {
        outputSchema?: FlexibleSchema<GuardedOutput<DEFINITION>>;
        toModelOutput?: NonNullable<
          Tool<Parameters<ToolExecution<DEFINITION>>[0], GuardedOutput<DEFINITION>>['toModelOutput']
        >;
      }
  : never;

export type GuardedTools<TOOLS extends ToolSet> = {
  [NAME in keyof TOOLS]: 'execute' extends keyof TOOLS[NAME]
    ? ToolExecution<TOOLS[NAME]> extends never
      ? TOOLS[NAME]
      : GuardedTool<TOOLS[NAME]>
    : TOOLS[NAME];
};

export function guardTools<TOOLS extends ToolSet>(
  tools: TOOLS,
  options: GuardToolsOptions = {},
): GuardedTools<TOOLS> {
  return Object.fromEntries(
    Object.entries(tools).map(([name, definition]) => [name, guardTool(name, definition, options)]),
  ) as GuardedTools<TOOLS>;
}

function guardTool(
  toolName: string,
  definition: ToolSet[string],
  options: GuardToolsOptions,
): ToolSet[string] {
  const execute = definition.execute;
  if (typeof execute !== 'function') return definition;
  const { request, ...guardOptions } = options;
  const toModelOutput = definition.toModelOutput;
  return {
    ...definition,
    execute: async function* (input, executionOptions) {
      guardOptions.signal?.throwIfAborted();
      executionOptions.abortSignal?.throwIfAborted();
      const decision = await reviewToolCall(
        {
          toolName,
          input,
          request: request ?? requireText(lastUserText(executionOptions.messages), 'request'),
        },
        guardOptions,
        executionOptions.abortSignal,
      );
      guardOptions.signal?.throwIfAborted();
      executionOptions.abortSignal?.throwIfAborted();
      if (decision.action !== 'allow') {
        yield blockedOutput(toolName, decision);
        return;
      }
      const output = execute(input, executionOptions);
      if (isAsyncIterable(output)) yield* output;
      else yield await output;
    },
    ...(toModelOutput === undefined
      ? {}
      : {
          toModelOutput: (result: Parameters<NonNullable<Tool['toModelOutput']>>[0]) =>
            blockedToolOutputSchema.safeParse(result.output).success
              ? { type: 'json' as const, value: result.output }
              : toModelOutput(result),
        }),
    ...(definition.outputSchema === undefined
      ? {}
      : { outputSchema: includeBlockedOutput(definition.outputSchema) }),
  };
}

function isAsyncIterable(value: unknown): value is AsyncIterable<unknown> {
  return (
    typeof (value as AsyncIterable<unknown> | null | undefined)?.[Symbol.asyncIterator] ===
    'function'
  );
}

const blockedToolOutputSchema = toolCallGateResultSchema
  .pick({ verdict: true, status: true, detected: true, confidence: true })
  .extend({
    kind: z.literal(BLOCKED_TOOL_OUTPUT_KIND),
    blocked: z.literal(true),
    action: z.enum(['ask', 'deny']),
    message: z.string(),
  });

function includeBlockedOutput(outputSchema: FlexibleSchema): FlexibleSchema {
  const original = asSchema(outputSchema);
  return jsonSchema(
    async () => ({
      anyOf: [
        { $id: 'urn:jev-recipes:tool-output', ...(await original.jsonSchema) },
        z.toJSONSchema(blockedToolOutputSchema),
      ],
    }),
    {
      validate: async (value) => {
        const blocked = blockedToolOutputSchema.safeParse(value);
        if (blocked.success) return { success: true, value: blocked.data };
        return original.validate ? original.validate(value) : { success: true, value };
      },
    },
  );
}

export type ModelCandidate = { id: string; text: string; model: LanguageModel };

export type RouteModelStepOptions = RecipeOptions & {
  candidates: readonly ModelCandidate[];
  request?: string;
  context?: string;
  minConfidence?: number;
  fallback?: LanguageModel;
  onDecision?: (event: { decision: ModelRouteResult; model: LanguageModel | undefined }) => void;
};

export function routeModelStep(options: RouteModelStepOptions): PrepareStepFunction<any, any> {
  const { candidates, request, context, minConfidence, fallback, onDecision, ...recipeOptions } =
    options;
  if (!candidates.length) throw new Error('Supply at least one model candidate.');
  const decisions = new WeakMap<object, LanguageModel | undefined>();
  return async ({ initialMessages, steps }) => {
    // The SDK owns one steps array per generation, even when callers reuse messages.
    if (!decisions.has(steps)) {
      const decision = await modelRoute(
        {
          request: request ?? requireText(firstUserText(initialMessages), 'request'),
          models: candidates.map(({ id, text }) => ({ id, text })),
          ...(context === undefined ? {} : { context }),
          ...(minConfidence === undefined ? {} : { minConfidence }),
        },
        recipeOptions,
      );
      const selected =
        decision.status === 'ready' && decision.selection !== null
          ? candidates.find((candidate) => candidate.id === decision.selection)?.model
          : fallback;
      onDecision?.({ decision, model: selected });
      decisions.set(steps, selected);
    }
    const model = decisions.get(steps);
    return model === undefined ? {} : { model };
  };
}

export type CompletionCheck = {
  tools: Record<string, Tool<{ report: string; evidence?: string }, CompletionToolOutput>>;
  stopWhen: StopCondition<any, any>;
};

export function completionCheck(options: CompletionOptions = {}): CompletionCheck {
  const toolName = options.toolName ?? DEFAULT_COMPLETION_TOOL_NAME;
  const report = tool({
    description: COMPLETION_TOOL_DESCRIPTION,
    inputSchema: jsonSchema<{ report: string; evidence?: string }>(COMPLETION_TOOL_INPUT_SCHEMA),
    execute: async (input, executionOptions) =>
      reviewCompletion(
        {
          task: options.task ?? requireText(firstUserText(executionOptions.messages), 'task'),
          report: input.report,
          evidence: input.evidence,
        },
        options,
        executionOptions.abortSignal,
      ),
  });
  return {
    tools: { [toolName]: report },
    stopWhen: ({ steps }) => {
      const last = steps.at(-1);
      return (
        last?.toolResults.some(
          (result) =>
            result.toolName === toolName &&
            typeof result.output === 'object' &&
            result.output !== null &&
            (result.output as CompletionToolOutput).accepted === true,
        ) ?? false
      );
    },
  };
}

function lastUserText(messages: readonly { role: string; content: unknown }[]) {
  return messageText(messages, 'user', 'last');
}

function firstUserText(messages: readonly { role: string; content: unknown }[]) {
  return messageText(messages, 'user', 'first');
}
