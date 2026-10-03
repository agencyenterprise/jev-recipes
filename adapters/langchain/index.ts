import { DynamicStructuredTool, tool } from '@langchain/core/tools';
import type { ToolRunnableConfig } from '@langchain/core/tools';
import { ToolMessage } from '@langchain/core/messages';
import type { ToolCall } from '@langchain/core/messages';
import type { RecipeName } from '../../catalog/schema.js';
import {
  COMPLETION_TOOL_DESCRIPTION,
  COMPLETION_TOOL_INPUT_SCHEMA,
  DEFAULT_COMPLETION_TOOL_NAME,
  blockedOutput,
  defineRecipeTool,
  requireText,
  reviewCompletion,
  reviewToolCall,
} from '../shared.js';
import type {
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

type JsonSchema = Record<string, unknown>;

export type RecipeTool = DynamicStructuredTool<JsonSchema>;

export function recipeTool(name: RecipeName, options: RecipeToolOptions = {}): RecipeTool {
  const definition = defineRecipeTool(name, options);
  return tool(
    (input: unknown, config?: { signal?: AbortSignal }) =>
      definition.execute(input, config?.signal),
    {
      name: definition.name,
      description: definition.description,
      schema: definition.inputSchema as JsonSchema,
    },
  ) as RecipeTool;
}

export function recipeTools(
  names: readonly RecipeName[],
  options: RecipeToolOptions = {},
): RecipeTool[] {
  return names.map((name) => recipeTool(name, options));
}

export type GuardRequest = string | ((input: unknown, config: unknown) => string);

export type GuardToolsOptions = GuardOptions & { request: GuardRequest };

export type GuardableTool = {
  name: string;
  description: string;
  schema: unknown;
  returnDirect?: boolean;
  invoke(input: any, config?: any): Promise<unknown>;
};

export function guardTools(
  tools: readonly GuardableTool[],
  options: GuardToolsOptions,
): DynamicStructuredTool[] {
  return tools.map((original) => new GuardedTool(original, options));
}

class GuardedTool extends DynamicStructuredTool {
  constructor(
    private readonly original: GuardableTool,
    private readonly guardOptions: GuardToolsOptions,
  ) {
    super({
      name: original.name,
      description: original.description,
      schema: original.schema as JsonSchema,
      returnDirect: original.returnDirect ?? false,
      func: (input, _runManager, config) => this.invoke(input, config),
    });
  }

  override async invoke(input: unknown, config?: ToolRunnableConfig): Promise<any> {
    const { request, ...options } = this.guardOptions;
    const args = isToolCall(input) ? input.args : input;
    const requestConfig = isToolCall(input) ? { ...config, toolCall: input } : config;
    options.signal?.throwIfAborted();
    config?.signal?.throwIfAborted();
    const decision = await reviewToolCall(
      {
        toolName: this.name,
        input: args,
        request: typeof request === 'function' ? request(args, requestConfig) : request,
      },
      options,
      config?.signal,
    );
    options.signal?.throwIfAborted();
    config?.signal?.throwIfAborted();
    if (decision.action === 'allow') return this.original.invoke(input, config);

    const output = blockedOutput(this.name, decision);
    const toolCallId = requestConfig?.toolCall?.id;
    return toolCallId === undefined
      ? output
      : new ToolMessage({
          name: this.name,
          tool_call_id: toolCallId,
          content: JSON.stringify(output),
        });
  }

  override call(input: unknown, config?: ToolRunnableConfig, tags?: string[]): Promise<any> {
    return this.invoke(
      input,
      tags === undefined ? config : { ...config, tags: config?.tags ?? tags },
    );
  }
}

function isToolCall(input: unknown): input is ToolCall {
  return (
    typeof input === 'object' && input !== null && 'type' in input && input.type === 'tool_call'
  );
}

export function completionTool(
  options: CompletionOptions & { task: string },
): DynamicStructuredTool<typeof COMPLETION_TOOL_INPUT_SCHEMA> {
  return tool(
    (
      input: { report: string; evidence?: string },
      config?: { signal?: AbortSignal },
    ): Promise<CompletionToolOutput> =>
      reviewCompletion(
        { task: requireText(options.task, 'task'), report: input.report, evidence: input.evidence },
        options,
        config?.signal,
      ),
    {
      name: options.toolName ?? DEFAULT_COMPLETION_TOOL_NAME,
      description: COMPLETION_TOOL_DESCRIPTION,
      schema: COMPLETION_TOOL_INPUT_SCHEMA,
    },
  ) as DynamicStructuredTool<typeof COMPLETION_TOOL_INPUT_SCHEMA>;
}
