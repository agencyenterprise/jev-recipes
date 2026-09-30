import { tool } from '@langchain/core/tools';
import type { DynamicStructuredTool } from '@langchain/core/tools';

export type GuardableTool = {
  name: string;
  description: string;
  schema: unknown;
  returnDirect?: boolean;
  invoke(input: any, config?: any): Promise<unknown>;
};
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

export function guardTools(
  tools: readonly GuardableTool[],
  options: GuardToolsOptions,
): DynamicStructuredTool[] {
  const { request, ...guardOptions } = options;
  return tools.map((original) => {
    const schema = original.schema as JsonSchema;
    return tool(
      async (input: unknown, config?: { signal?: AbortSignal; toolCall?: unknown }) => {
        const decision = await reviewToolCall(
          {
            toolName: original.name,
            input,
            request: typeof request === 'function' ? request(input, config) : request,
          },
          guardOptions,
          config?.signal,
        );
        if (decision.action !== 'allow') return blockedOutput(original.name, decision);
        const { toolCall: _toolCall, ...delegatedConfig } = config ?? {};
        return original.invoke(input, delegatedConfig);
      },
      {
        name: original.name,
        description: original.description,
        schema,
        ...(original.returnDirect === undefined ? {} : { returnDirect: original.returnDirect }),
      },
    ) as DynamicStructuredTool;
  });
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
